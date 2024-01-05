import React from "react";

const ShowPasswords = ({ passwords }) => {
    if (!passwords) {
        
        return (
            <div>
                <h2>No hay contraseñas registradas</h2>
            </div>
        );

    }

    return (
        <div>
        {passwords.map((password) => (
            <div key={password.id}>
            <h2>{password.service}</h2>
            <p>{password.user}</p>
            <p>{password.password}</p>
            </div>
        ))}
        </div>
    );
};

export default ShowPasswords;