import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShowPasswords from "./showPasswords";

const DashboardPage = () => {
  const [passwords, setPasswords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      const userId = localStorage.getItem("userId");
      console.log("userId", userId);
      console.log("token", token);

      fetch("http://localhost:5000/dashboard?action=view", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ userId: userId }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 404) {
            //El usuario no tiene contraseñas por ahora
            return null;
          } else if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/");
            throw new Error("Unauthorized");
          } else {
            throw new Error("Unexpected error");
          }
        })
        .then((data) => {
          if (data) {
            setPasswords(data);
          } else {
            setPasswords([]);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching passwords:", error);
          setIsLoading(false);
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status === 200) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <h1>Contraseñas</h1>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <ShowPasswords passwords={passwords} />
      )}
    </div>
  );
};

export default DashboardPage;
