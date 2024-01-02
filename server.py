from flask import Flask, render_template, request
from flask_cors import CORS
from app import create_account, login, check_user, hash_password, verify_password
from user import User
import time

app = Flask(__name__)
CORS(app)  # Configura CORS para permitir todas las solicitudes desde cualquier origen

@app.route('/')
def hello():
    return render_template('register.html')

@app.route('/home')
def home():
    if request.method == 'GET':
        action = request.args.get('action')
        if action == 'logout':
            return render_template('login.html')
        elif action == 'add':
            return render_template('add.html')
        else:
            return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'GET':
        return render_template('login.html')
    elif request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        if not email or not password:
            return 'Error: Todos los campos son obligatorios'
        user = User('', '', email, password, '')
        if check_user(user):
            if login(user):
                return render_template('home.html')
            else:
                return 'Error: Contraseña incorrecta'
        else:
            return 'Error: El usuario no existe'
    

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data:
        return 'Error: No se han proporcionado datos en el formato esperado'

    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    password = data.get('password')
    password2 = data.get('password2')

    if not nombre or not apellido or not email or not password or not password2:
        return 'Error: Todos los campos son obligatorios'
    if password != password2:
        return 'Error: Las contraseñas no coinciden'
    
    register_date = time.strftime('%Y-%m-%d %H:%M:%S')
    user = User(nombre, apellido, email, password, register_date)

    if create_account(user):
        return 'Registro exitoso'
    else:
        return 'Error: El usuario ya existe'

if __name__ == '__main__':
    app.run()


