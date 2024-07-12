import datetime
import random
import string
import sys
import mysql.connector
import hashlib
import binascii
import json
import logging
import os
import mysql.connector.pooling
from user import User
from password import Password

letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
numbers = "0123456789"
special_chars = "!#$%&/(=?¡[]*+-.:;_,}{"
lista = [letters, numbers, special_chars]

logging.basicConfig(level=logging.DEBUG)

log_file = "log.txt"

def create_log_file():
    if not os.path.exists(log_file):
        try:
            with open(log_file, "w") as file:
                file.write("Log file created")
            print("Log file created successfully", file=sys.stderr )
        except Exception as e:
            print("Error creating log file:", e, file=sys.stderr )
    else:
        print("Log file already exists", file=sys.stderr )

def write_log(message):
    try:
        with open(log_file, "a") as file:
            fecha = datetime.datetime.now()
            hora = fecha.strftime("%H:%M:%S")
            file.write("[{}] {}\n".format(hora, message))
    except Exception as e:
        print("Error writing log:", e, file=sys.stderr )

create_log_file()

# Read database configuration from JSON
with open("db/db.json", "r") as j:
    data = json.load(j)

# Database connection pooling setup
dbconfig = {
    "host": data["host"],
    "user": data["user"],
    "password": data["password"],
    "database": data["database"]
}

cnxpool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=3,
    **dbconfig
)

def get_connection():
    return cnxpool.get_connection()

def close_connection(connection, cursor):
    cursor.close()
    connection.close()

def execute_query(query, params=None, commit=False, return_last_insert_id=False):
    connection = get_connection()
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
        write_log(f"Error executing query: {str(e)}\nQuery: {query}")
    finally:
        close_connection(connection, cursor)

def execute_fetch_query(query, params=None):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute(query, params)
        result = cursor.fetchall()
        return result
    except Exception as e:
        write_log(f"Error executing fetch query: {str(e)}\nQuery: {query}")
    finally:
        close_connection(connection, cursor)

def user_exists(email):
    query = "SELECT * FROM `users` WHERE email = %s"
    result = execute_fetch_query(query, (email,))
    return bool(result)

def hash_password(password):
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    pwdhash = binascii.hexlify(pwdhash)
    return (salt + pwdhash).decode('ascii')

def verify_password(stored_password, provided_password):
    salt = stored_password[:64]
    stored_password = stored_password[64:]
    pwdhash = hashlib.pbkdf2_hmac('sha256', provided_password.encode('utf-8'), salt.encode('ascii'), 100000)
    pwdhash = binascii.hexlify(pwdhash).decode('ascii')
    return pwdhash == stored_password

def login(user):
    if user_exists(user.email):
        query = "SELECT password FROM `users` WHERE email = %s"
        result = execute_fetch_query(query, (user.email,))

        if result and verify_password(result[0]['password'], user.password):
            return get_user_id(user.email)
        else:
            return False
    else:
        write_log("User doesn't exist")
        return False

def create_account(user):
    try:
        query = "INSERT INTO `users` (name, surname, email, password, register_date) VALUES (%s, %s, %s, %s, NOW())"
        last_insert_id = execute_query(query, (user.name, user.surname, user.email, hash_password(user.password)), commit=True, return_last_insert_id=True)
        
        write_log("[+] User added successfully")
        
        print(last_insert_id, file=sys.stderr)
        return last_insert_id
    except Exception as e:
        write_log("Error in create_account: " + str(e))
        return False

def add_password(password):
    try:
        query = "INSERT INTO `passwords` (id_user, service, password, register_date) VALUES (%s, %s, %s, NOW())"
        execute_query(query, (password.id_user, password.service, password.password), commit=True)
        write_log("[+] Password added successfully")
        return True
    except Exception as e:
        write_log("Error in add_password: " + str(e))
        return False

def get_user_passwords(id_user):
    query = "SELECT * FROM `passwords` WHERE id_user = %s"
    result = execute_fetch_query(query, (id_user,))
    passwords = []
    for p in result:
        passwords.append(Password(p['id_user'], p['service'], p['password'], p['register_date']))
    
    
    
    
    if not passwords:
        return False
    return passwords

def get_user_id(email):
    query = "SELECT `id_user` FROM `users` WHERE email = %s"
    result = execute_fetch_query(query, (email,))
    return result[0]['id_user']

def create_strong_password(n_chars):
    password = ""
    for _ in range(n_chars):
        password += random.choice(random.choice(lista))
    return password
