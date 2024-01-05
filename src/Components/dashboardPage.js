import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardForm from "./dashboardForm";
import ShowPasswords from "./showPasswords";


const DashboardPage = () => {


    const [passwords, setPasswords] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        const token = location.state?.token;

        if (!token) {
            navigate("/");
        }
        else {
            fetch("http://localhost:5000/passwords", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    navigate("/");
                }
            })
            .then((data) => setPasswords(data))
            .catch((error) => console.error(error));
        }
    }
    , [navigate, location.state]); 

    const handleLogout = () => {
        fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        }).then((response) => {
        if (response.status === 200) {
            navigate("/");
        }
        });
    };


    // Aquí va el código para mostrar el dashboard donde el usuario verá sus contraseñas y podrá añadir nuevas
    return (
        <div>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Cerrar sesión</button>
        
        <h1>contraseñas</h1>
        <DashboardForm />
        <ShowPasswords passwords={ passwords }/>
        
        
        
        </div>
    );
};

export default DashboardPage;