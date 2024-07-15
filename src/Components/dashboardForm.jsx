import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "./AuthContext";

const FormContainer = styled.div`
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.label`
  /* Estilos personalizados */
`;

const Input = styled.input`
  /* Estilos personalizados */
`;

const Button = styled.button`
  /* Estilos personalizados */
`;

const Icon = styled.img`
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border-radius: 50%;
  margin-top: 10px;
`;

const Message = styled.p`
  color: ${props => props.error ? 'red' : 'green'};
  font-size: 1rem;
`;

const DashboardForm = ({ setPasswords }) => {
  const { isLoggedIn } = useAuth();
  const [service, setService] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [icon, setIcon] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("No iniciaste sesión");
      navigate("/"); // Redirige al usuario si no está autenticado
      return;
    }

    if (!service || !user || !password || !icon) {
      setMessage("Por favor completa todos los campos");
      setError(true);
      return;
    }

    const formData = new FormData();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    formData.append("userId", userId);
    formData.append("service", service);
    formData.append("user", user);
    formData.append("password", password);
    formData.append("iconURI", icon);

    try {
      const response = await fetch("http://localhost:5000/dashboard?action=add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPasswords((prevPasswords) => [...prevPasswords, data]);
        setService("");
        setUser("");
        setPassword("");
        document.querySelector("input[type=file]").value = "";
        setIcon(null);
        setMessage("Datos agregados correctamente");
        setError(false);
        alert(isLoggedIn);        
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        alert("Sesión expirada");
        navigate("/");
      } else {
        const data = await response.json();
        setMessage(data.error || "Error al agregar datos");
        setError(true);
      }
    } catch (error) {
      console.error("Error al agregar datos:", error);
      setMessage("Error al agregar datos");
      setError(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ["png", "jpg"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!file) return;

    if (!allowedExtensions.includes(fileExtension)) {
      setMessage("Selecciona un archivo .png o .jpg");
      setError(true);
      return;
    }

    setIcon(file);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Label>
          Servicio:
          <Input type="text" value={service} onChange={(e) => setService(e.target.value)} />
        </Label>
        <br />
        <Label>
          Usuario:
          <Input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
        </Label>
        <br />
        <Label>
          Contraseña:
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Label>
        <br />
        <Label>
          Imagen:
          <Input type="file" accept=".png, .jpg" onChange={handleFileChange} />
          {icon && <Icon src={URL.createObjectURL(icon)} alt="icon" />}
        </Label>
        <br />
        <Button type="submit">Guardar</Button>
        {message && <Message error={error}>{message}</Message>}
      </form>
    </FormContainer>
  );
};

export default DashboardForm;
