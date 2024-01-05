import random
import string
import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode
import hashlib
import binascii
import json
import user
import logging
import os

import sys
import os

logging.basicConfig(level=logging.DEBUG)

log_file = "log.txt"

def create_log_file():
    if not os.path.exists(log_file):
        try:
            with open(log_file, "w") as file:
                file.write("Log file created")
            print("Log file created successfully")
        except Exception as e:
            print("Error creating log file:", e)
    else:
        print("Log file already exists")

def write_log(message):
    try:
        with open(log_file, "a") as file:
            file.write(message + "\n")
    except Exception as e:
        print("Error writing log:", e)

create_log_file()


# This project is being created with:
# MySQL and Django or Flask
# The mision is: Give the user an adaptable UI capable of receiving an account of any kind of service
# and storage it into a secured database.
# Also, the user should be able to ask the program for the creation of a strong password
letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
numbers = "0123456789"
special_chars = "!#$%&/(=?¡[]*+-.:;_,}{"
lista = [letters, numbers, special_chars]



with open("bd.json", "r") as j:
	data = json.load(j)
	db = mysql.connector.connect(
    host = data["host"],
    user = data["user"],
    password = data["password"],
    database = data["database"])
cursor = db.cursor()



def userExists(email):
    try:
        query = "SELECT * FROM `users` WHERE email = %s"
        cursor.execute(query, (email,))
        write_log("cursor: " + str(email))
        result = cursor.fetchone()
        write_log("result: ")   
        write_log("result: " + str(result))
        if result: 
            return True
        else:
            return False 
    except Exception as e:
        write_log("Error in userExists ({}): {}\n Query: {}".format(email, e, query))

        

        
def hash_password(password):
    # Crear un salt aleatorio
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    pwdhash = binascii.hexlify(pwdhash)
    # Devolver el salt y el hash de la contraseña
    return (salt + pwdhash).decode('ascii')

def verify_password(stored_password, provided_password):
    # Separar el salt de la contraseña
    salt = stored_password[:64]
    stored_password = stored_password[64:]
    # Hash de la contraseña proporcionada
    pwdhash = hashlib.pbkdf2_hmac('sha256', provided_password.encode('utf-8'), salt.encode('ascii'), 100000)
    pwdhash = binascii.hexlify(pwdhash).decode('ascii')
    return pwdhash == stored_password

def login(user):
    
    try:
        if(userExists(user.email)):
            query = "SELECT password FROM `users` WHERE email = %s"
            
            cursor.execute(query, (user.email,))
            
            result = cursor.fetchone()
            print("result: " + str(result), file=sys.stderr)
            write_log("result: " + str(result[0]))
            if verify_password(result[0], user.password):
                return get_user_id(user.email)
            else:
                return False
        else:
            write_log("User doesn't exist")
            return False
    except Exception as e: 
        write_log("Error in login: " + str(e))
        print(e, file=sys.stderr)


def create_account(user):
    try:
        db.start_transaction()
        query = "INSERT INTO `users` (name, surname, email, password, register_date) VALUES (%s, %s, %s, %s, NOW())"
        cursor.execute(query, (user.name, user.surname, user.email, hash_password(user.password)))
        db.commit()
        print("[+] User {} created successfully".format(user.name))
        # obtener el last_id
        query = "SELECT LAST_INSERT_ID()"
        cursor.execute(query)
        result = cursor.fetchone()        
        return result[0]
    except Exception as e:
        return False 
        db.rollback()

def add_password(password):
    try:
        db.start_transaction()
        query = "INSERT INTO `passwords` (id_user, service, user, password) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (password.id_user, password.service, password.user, password.password))
        db.commit()
        write_log("[+] Password added successfully")
        return True
    except Exception as e:
        write_log("Error in add_password: " + str(e))
        db.rollback()
        return False

def get_user_passwords(id_user):
    try:
        query = "SELECT `service`, `password` FROM `passwords` WHERE id_user = %s"
        cursor.execute(query, (id_user,))
        result = cursor.fetchall()
        return result
    except Exception as e:
        print(e, file=sys.stderr)

def get_user_id(email):
    try:
        query = "SELECT `id_user` FROM `users` WHERE email = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        return result[0]
    except Exception as e:
        print(e, file=sys.stderr)


def create_strong_password(n_chars):
    # function for create a strong password with the number of characters asked by the user
    password = ""
    for i in range(0, n_chars):
        password += random.choice(random.choice(lista))

    return password


