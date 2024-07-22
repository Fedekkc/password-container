import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(smtp_server, port, sender_email, sender_password, receiver_email, subject, body):
    # Crear el objeto del mensaje
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject

    # Agregar el cuerpo del mensaje
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Conectar al servidor SMTP
        server = smtplib.SMTP(smtp_server, port)
        server.starttls()  # Utilizar TLS (Transport Layer Security)
        server.login(sender_email, sender_password)

        # Enviar el correo
        text = msg.as_string()
        server.sendmail(sender_email, receiver_email, text)

        # Cerrar la conexión
        server.quit()

        print("Correo enviado exitosamente")

    except Exception as e:
        print(f"Error: {str(e)}")

# Configuración del correo
smtp_server = 'smtp.gmail.com'
port = 587
sender_email = 'kkctest05@gmail.com'
sender_password = 'xuqm frqc nctx rpvn'
receiver_email = 'cacacefederico05@gmail.com'
subject = 'Asunto del correo'
body = 'Contenido del correo'

send_email(smtp_server, port, sender_email, sender_password, receiver_email, subject, body)
