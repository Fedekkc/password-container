from flask import Flask, render_template, request
import jwt
from datetime import datetime, timedelta
from flask_cors import CORS
from flask import jsonify
from app import create_account, login, userExists, hash_password, verify_password
from user import User
from password import Password
import time


app = Flask(__name__)
app.config['SECRET_KEY'] = '46503911Ko!'
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
app.config['JSON_SORT_KEYS'] = False


# Función para generar un token JWT
def generate_token(user_id):
    expiration_time = datetime.utcnow() + timedelta(hours=1)
    payload = {'user_id': user_id, 'exp': expiration_time}
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token
CORS(app)  # Configura CORS para permitir todas las solicitudes desde cualquier origen    
    

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
        
        
@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No se han proporcionado datos en el formato esperado'}), 400

    user_id = data.get('userId')
    service = data.get('service')
    user = data.get('user')
    password = data.get('password')
    
    if not user_id or not service or not user or not password:
        return jsonify({'error': 'Faltan algunos campos requeridos'}), 402
    
    password = hash_password(password)
    passwordObj = Password(user_id, service, user, password, '')   
    


@app.route('/login', methods=['GET', 'POST'])
def login_page():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No se han proporcionado datos en el formato esperado'}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Faltan algunos campos requeridos'}), 402

    user = User('', '', email, password, '')

    user_id = login(user)
    if user_id:
        token = generate_token(user_id)
        return jsonify({'token': token, 'userId': user_id }), 200
    else:
        return jsonify({'error': 'Credenciales incorrectas'}), 401




@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No se han proporcionado datos en el formato esperado'}), 400

    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    password = data.get('password')
    password2 = data.get('password2')

    if not nombre or not apellido or not email or not password or not password2:
        return jsonify({'error': 'Faltan algunos campos requeridos'}), 401
    if password != password2:
        return jsonify({'error': 'Las contraseñas no coinciden'}), 400
    
    if userExists(User('', '', email, '', '')):      
        return jsonify({'error': 'El correo utilizado ya está en uso'}), 409

    else:
        register_date = time.strftime('%Y-%m-%d %H:%M:%S')
        user = User(nombre, apellido, email, password, register_date)
        user_id = create_account(user)
        if user_id:
            # Genera un token JWT después de un registro exitoso
            token = generate_token(user_id)

            return jsonify({'message': 'Usuario registrado con éxito', 'token': token}), 200
        else:
            return jsonify({'error': 'No se pudo crear la cuenta'}), 500
        

if __name__ == '__main__':
    app.run(port=5000, debug=True)


