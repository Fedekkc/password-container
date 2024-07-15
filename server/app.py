import sys
from flask import Flask, render_template, request, jsonify
import jwt
from datetime import datetime, timedelta
from flask_cors import CORS
from dao import DAO, DatabaseConfig
from user import User
from password import Password
import os
from functools import wraps
from werkzeug.utils import secure_filename


app = Flask(__name__)

def configure_app():
    app.config['SECRET_KEY'] = '46503911Ko!'
    app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
    app.config['JSON_SORT_KEYS'] = False
    app.config['UPLOAD_FOLDER'] = 'static/images'
    
    CORS(app)
    # crear la carpeta de imágenes si no existe
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])



# Clase Logger personalizada
class Logger:
    def __init__(self, log_file='log/app.log'):
        self.log_file = log_file

    def write_log(self, message):
        with open(self.log_file, 'a') as f:
            log_entry = f"{datetime.now()} - {message}\n"
            f.write(log_entry)

# Instancia del logger
logger = Logger()

# Configuración de la base de datos y DAO
db_config = DatabaseConfig()
dao = DAO(db_config.dbconfig)

# Función para generar un token JWT
def generate_token(user_id):
    current_time = datetime.now()
    expiration_time = current_time + timedelta(hours=5)
    expiration_time_to_unix = expiration_time.timestamp() 
    payload = {'user_id': user_id, 'exp': expiration_time_to_unix} # exp puede ser cualquier fecha y hora en el futuro 
    # Codificamos el payload con la clave secreta especificando TODOS los parámetros de la funcion
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    logger.write_log("Generando token para el usuario: {}".format(str(user_id)))

    logger.write_log("Token generado: {}".format(str(token)))
    logger.write_log("Generado a las: {}".format(current_time))
    logger.write_log("Expira: {}".format(expiration_time))
    
    try:
        decoded_payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        logger.write_log("Prueba de decodificación: {}".format(decoded_payload))
    except jwt.ExpiredSignatureError:
        logger.write_log("El token ha expirado inmediatamente después de ser generado.")
    except jwt.InvalidTokenError:
        logger.write_log("El token generado es inválido.")
    
    return token

def check_token(token):
    try:
        logger.write_log("Checking token")  
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        logger.write_log("Token decodificado: {}".format(str(decoded_token)))  
        current_time = datetime.now()
        current_time = current_time.timestamp()
        expiration_time = decoded_token['exp']
        logger.write_log("Hora actual: {}".format(str(current_time)))
        if current_time > expiration_time:
            return 'Token expirado. Por favor inicia sesión de nuevo'
        logger.write_log(decoded_token['user_id'])
        return decoded_token['user_id'] 

    except jwt.ExpiredSignatureError:
        logger.write_log("Token expirado")
        return 'Token expirado. Por favor inicia sesión de nuevo'
    except jwt.InvalidTokenError:
        logger.write_log("Token inválido")  
        return 'Token inválido. Por favor inicia sesión de nuevo'


# Función para validar las extensiones de archivo permitidas
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg'}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        logger.write_log("Token required: {}".format(str(token)))  

        if not token:
            logger.write_log("Token not provided")
            return jsonify({'error': 'Token no proporcionado'}), 401

        try:
            token = token.split(" ")[1]  # Para obtener solo el token sin 'Bearer '
            user_id = check_token(token)
            logger.write_log("Token provided: {}".format(str(token)))
            logger.write_log("User ID: {}".format(str(user_id)))  
        except:
            return jsonify({'error': 'Token inválido'}), 401

        return f(user_id, *args, **kwargs)

    return decorated

@app.route('/dashboard', methods=['POST'])
@token_required
def dashboard(user_id):
    try:
        action = request.args.get('action')
        logger.write_log("Dashboard accessed by user {}".format(str(user_id)))  

        if not user_id:
            return jsonify({'error': 'Falta el ID de usuario'}), 400

        if action == 'view':
            logger.write_log("Viewing passwords")
            try:
                passwords = dao.get_user_passwords(user_id)
                jsonPasswords = []
                for p in passwords:
                    logger.write_log("Password retrieved: {}".format(str(p)))
                    jsonPasswords.append(p.to_dict())
                logger.write_log("Passwords retrieved")
                return jsonify(jsonPasswords), 200
            
            except Exception as e:
                logger.write_log(str(e))
                return jsonify({'error': 'Error en el servidor'}), 500
            

        if action == 'add':
            service = request.form.get('service')
            user = request.form.get('user')
            password = request.form.get('password')
            iconURI = request.files['iconURI']

            if not service or not user or not password or not iconURI:
                return jsonify({'error': 'Faltan algunos campos requeridos'}), 400

            if iconURI and allowed_file(iconURI.filename):
                filename = secure_filename(iconURI.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                iconURI.save(file_path)

                # Guardar la ruta de la imagen en la base de datos
                password = Password(user_id, service, password,'', file_path)
                if dao.add_password(password):
                    return jsonify({'message': 'Contraseña guardada con éxito'}), 200
                else:
                    return jsonify({'error': 'No se pudo guardar la contraseña'}), 500
            else:
                return jsonify({'error': 'Formato de archivo no permitido (.png, .jpg)'}), 400

        else:
            return jsonify({'error': 'Acción no válida'}), 400

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'Error en el servidor'}), 500

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

    user_id = dao.login(user)
    if user_id:
        token = generate_token(user_id)
        return jsonify({'token': token, 'userId': user_id}), 200
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

    if dao.user_exists(email):
        logger.write_log("User already exists")
        return jsonify({'error': 'El correo utilizado ya está en uso'}), 409
    else:
        logger.write_log("User doesn't exist")
        user = User(nombre, apellido, email, password, '')
        user_id = dao.create_account(user)
        if user_id:
            token = generate_token(user_id)
            return jsonify({'message': 'Usuario registrado con éxito', 'token': token}), 200
        else:
            return jsonify({'error': 'No se pudo crear la cuenta'}), 500

if __name__ == '__main__':
    configure_app()
    app.run(port=5000, debug=True)
