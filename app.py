import random
import string
import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode
import hashlib
import binascii
import json
import user


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


def check_user(user):
    try:
        query = "SELECT * FROM `users` WHERE email = %s"
        cursor.execute(query, (user.email))
        result = cursor.fetchall()
        if len(result) == 0:
            return False
        else:
            return True
    except Exception as e:
        print(e)

        
def hash_password(password):
    # Crear un salt aleatorio
    salt = hashlib.sha256().hexdigest().encode('ascii')
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
        query = "SELECT * FROM `users` WHERE email = %s"
        cursor.execute(query, (user.email))
        result = cursor.fetchall()
        if len(result) == 0:
            return False
        else:
            if verify_password(result[0][4], user.password):
                return True
            else:
                return False
    except Exception as e:
        print(e)


def create_account(user):
    try:
        db.start_transaction()
        query = "INSERT INTO `users` (name, surname, email, password, register_date) VALUES (%s, %s, %s, %s, NOW())"
        cursor.execute(query, (user.name, user.surname, user.email, hash_password(user.password)))
        db.commit()
        print("[+] User {} created successfully".format(user.name))
        return True
    except Exception as e:
        print(e)
        return False 
        db.rollback()



def create_strong_password(n_chars):
    # function for create a strong password with the number of characters asked by the user
    password = ""
    for i in range(0, n_chars):
        password += random.choice(random.choice(lista))

    return password

