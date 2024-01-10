import sys
from flask import Flask, render_template, request
import jwt
from datetime import datetime, timedelta
from flask_cors import CORS
from flask import jsonify
from app import add_password, create_account, get_user_passwords, login, user_exists, hash_password, verify_password, write_log
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
    



        
@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    try: 
        data = request.get_json()
        user_id = data.get('userId')
        if request.method == 'POST':
            action = request.args.get('action')
            if action == 'view':
                write_log("VIEW request")
                if not user_id:
                    return jsonify({'error': 'Faltan algunos campos requeridos'}), 400
                try:
                    passwords = get_user_passwords(user_id)
                    if(passwords == False):
                        write_log("Error in get_user_passwords")
                        return jsonify({'error': 'No se pudo obtener las contraseñas'}), 500
                    
                    # recorre la lista de contraseñas y las convierte a diccionarios
                    
                    for i in range(len(passwords)):
                        passwords[i] = passwords[i].to_dict()    
                        
                        
                    print(passwords, file=sys.stderr)
                    return jsonify({'passwords': passwords}), 200
                
                except Exception as e:
                    write_log("Error getting passwords in dashboard(): " + str(e))
                    return jsonify({'error': 'No se pudo obtener las contraseñas'}), 500
            elif action == 'add':
            
                service = data.get('service')
                user = data.get('user')
                password = data.get('password')
                
                if not user_id or not service or not user or not password:
                    return jsonify({'error': 'Faltan algunos campos requeridos'}), 400
                
                password = hash_password(password)
                passwordObj = Password(user_id, service, password, '')   
                
                
                if add_password(passwordObj):
                    write_log("Password added successfully")
                    return jsonify({'message': 'Contraseña guardada con éxito'}), 200
                else:
                    write_log("Error in add_password")
                    return jsonify({'error': 'No se pudo guardar la contraseña'}), 500
                
    except Exception as e:
        return jsonify({'error': 'No se han proporcionado datos en el formato esperado'}), 400


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
    
    if user_exists(email):      
        write_log("User already exists")
        return jsonify({'error': 'El correo utilizado ya está en uso'}), 409
    else:
        write_log("User doesn't exist")
        user = User(nombre, apellido, email, password, '')
        user_id = create_account(user)
        if user_id:
            # Genera un token JWT después de un registro exitoso
            token = generate_token(user_id)

            return jsonify({'message': 'Usuario registrado con éxito', 'token': token}), 200
        else:
            return jsonify({'error': 'No se pudo crear la cuenta'}), 500
        

if __name__ == '__main__':
    app.run(port=5000, debug=True)


