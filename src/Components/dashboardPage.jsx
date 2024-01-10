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

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
        }
        else {
            const userId = localStorage.getItem("userId");
            console.log(userId)
            localStorage.setItem("userId", userId);
            try {
                fetch("http://localhost:5000/dashboard?action=view", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ userId }),
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("AAAAAAAAAAAAAAAAAAAAA")
                    console.log(data.passwords)
                    setPasswords(data.passwords);
                })
                .catch((error) => {
                    console.error("Error fetching passwords:", error);
                });
            } catch (error) {
                console.error("Error fetching passwords:", error);
            }
        }
    }, [navigate, location.state]); 

    const handleLogout = () => {
        try {
            fetch("http://localhost:5000/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
                if (response.status === 200) {
                    navigate("/");
                }
            });
        } catch (error) {
            console.error("Error logging out:", error);
        }
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