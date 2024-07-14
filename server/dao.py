import mysql.connector
import mysql.connector.pooling
import hashlib
import binascii
import os
import datetime
import json
import logging
import random
from password import Password

class DatabaseConfig:
    def __init__(self, config_file='db/db.json'):
        with open(config_file, 'r') as j:
            data = json.load(j)
        self.dbconfig = {
            "host": data["host"],
            "user": data["user"],
            "password": data["password"],
            "database": data["database"]
        }

class DatabaseConnectionPool:
    def __init__(self, dbconfig):
        self.cnxpool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="mypool",
            pool_size=3,
            **dbconfig
        )

    def get_connection(self):
        return self.cnxpool.get_connection()

class Logger:
    def __init__(self, log_file="log.txt"):
        self.log_file = log_file
        self.create_log_file()

    def create_log_file(self):
        if not os.path.exists(self.log_file):
            try:
                with open(self.log_file, "w") as file:
                    file.write("Log file created")
                print("Log file created successfully")
            except Exception as e:
                print("Error creating log file:", e)
        else:
            print("Log file already exists")

    def write_log(self, message):
        try:
            with open(self.log_file, "a") as file:
                fecha = datetime.datetime.now()
                hora = fecha.strftime("%H:%M:%S")
                file.write("[{}] {}\n".format(hora, message))
        except Exception as e:
            print("Error writing log:", e)

class DAO:
    def __init__(self, dbconfig):
        self.dbconfig = dbconfig
        self.pool = DatabaseConnectionPool(self.dbconfig)
        self.logger = Logger()

    def execute_query(self, query, params=None, commit=False, return_last_insert_id=False):
        connection = self.pool.get_connection()
        cursor = connection.cursor()

        try:
            cursor.execute(query, params)
            if commit:
                connection.commit()
            if return_last_insert_id:
                cursor.execute("SELECT LAST_INSERT_ID()")
                last_insert_id = cursor.fetchone()[0]
                return last_insert_id
        except Exception as e:
            self.logger.write_log(f"Error executing query: {str(e)}\nQuery: {query}")
        finally:
            cursor.close()
            connection.close()

    def execute_fetch_query(self, query, params=None):
        connection = self.pool.get_connection()
        cursor = connection.cursor(dictionary=True)
        
        try:
            cursor.execute(query, params)
            result = cursor.fetchall()
            return result
        except Exception as e:
            self.logger.write_log(f"Error executing fetch query: {str(e)}\nQuery: {query}")
        finally:
            cursor.close()
            connection.close()

    def user_exists(self, email):
        query = "SELECT * FROM `users` WHERE email = %s"
        result = self.execute_fetch_query(query, (email,))
        return bool(result)

    def hash_password(self, password):
        salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        pwdhash = binascii.hexlify(pwdhash)
        return (salt + pwdhash).decode('ascii')

    def verify_password(self, stored_password, provided_password):
        salt = stored_password[:64]
        stored_password = stored_password[64:]
        pwdhash = hashlib.pbkdf2_hmac('sha256', provided_password.encode('utf-8'), salt.encode('ascii'), 100000)
        pwdhash = binascii.hexlify(pwdhash).decode('ascii')
        return pwdhash == stored_password

    def login(self, user):
        if self.user_exists(user.email):
            query = "SELECT password FROM `users` WHERE email = %s"
            result = self.execute_fetch_query(query, (user.email,))
            if result and self.verify_password(result[0]['password'], user.password):
                return self.get_user_id(user.email)
            else:
                return False
        else:
            self.logger.write_log("User doesn't exist")
            return False

    def create_account(self, user):
        try:
            query = "INSERT INTO `users` (name, surname, email, password, register_date) VALUES (%s, %s, %s, %s, NOW())"
            last_insert_id = self.execute_query(query, (user.name, user.surname, user.email, self.hash_password(user.password)), commit=True, return_last_insert_id=True)
            self.logger.write_log("[+] User added successfully")
            return last_insert_id
        except Exception as e:
            self.logger.write_log("Error in create_account: " + str(e))
            return False

    def add_password(self, password):
        try:
            query = "INSERT INTO `passwords` (id_user, service, password, register_date) VALUES (%s, %s, %s, NOW())"
            self.execute_query(query, (password.id_user, password.service, password.password), commit=True)
            self.logger.write_log("[+] Password added successfully")
            return True
        except Exception as e:
            self.logger.write_log("Error in add_password: " + str(e))
            return False

    def get_user_passwords(self, id_user):
        query = "SELECT * FROM `passwords` WHERE id_user = %s"
        result = self.execute_fetch_query(query, (id_user,))
        passwords = [Password(p['id_user'], p['service'], p['password'], p['register_date']) for p in result]
        return passwords if passwords else False

    def get_user_id(self, email):
        query = "SELECT `id_user` FROM `users` WHERE email = %s"
        result = self.execute_fetch_query(query, (email,))
        return result[0]['id_user']

    def create_strong_password(self, n_chars):
        letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        numbers = "0123456789"
        special_chars = "!#$%&/(=?¡[]*+-.:;_,}{"
        lista = [letters, numbers, special_chars]
        password = "".join(random.choice(random.choice(lista)) for _ in range(n_chars))
        return password
