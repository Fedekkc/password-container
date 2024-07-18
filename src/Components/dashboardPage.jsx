import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShowPasswords from "./showPasswords";
import { useAuth } from "./AuthContext"; // Ajusta la ruta según donde tengas definido AuthContext

const DashboardPage = () => {
  const { isLoggedIn, logout } = useAuth(); // Obtén el estado isLoggedIn y la función logout desde el contexto
  const [passwords, setPasswords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect((e) => {
    const token = localStorage.getItem("token");

    if (!isLoggedIn || !token) { // Verifica isLoggedIn para asegurar que el usuario esté autenticado
      navigate("/");
    } else {
      const userId = localStorage.getItem("userId");

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
            return null; // El usuario no tiene contraseñas por ahora
          } else if (response.status === 401) {
            logout(); // Cerrar sesión si el token es inválido
            throw new Error("Unauthorized");
          } else {
            throw new Error("Unexpected error");
          }
        })
        .then((data) => {
          setPasswords(data || []); // Establece las contraseñas si existen, de lo contrario establece un arreglo vacío
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching passwords:", error);
          setIsLoading(false);
        });
    }
  }, [isLoggedIn, navigate, logout]);

  const handleLogout = () => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status === 200) {
          logout(); // Llama a la función logout desde el contexto para cerrar sesión localmente
          navigate("/"); // Navega de vuelta a la página de inicio
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <ShowPasswords passwords={passwords} setPasswords={setPasswords} />
      )}
      <button onClick={handleLogout}>Cerrar sesión</button>
      <h1>Contraseñas</h1>
    </div>
  );
};

export default DashboardPage;
