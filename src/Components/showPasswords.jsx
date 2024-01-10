import React from "react";

const ShowPasswords = ({ passwords }) => {
    console.log(passwords)
    if (passwords == null) {
        
        return (
            <div>
                <h2>No hay contraseñas registradas</h2>
            </div>
        );

    }

    return (
        <div>
            {passwords.map((password, index) => (
                <div key={index}>
                    <p>ID: {password.id_user}</p>
                    <p>Service: {password.service}</p>
                    <p>Password: {password.password}</p>
                    <p>Register Date: {password.register_date}</p>
                </div>
                ))}
        </div>
    );
};

export default ShowPasswords;