import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

const DashboardForm = () => {
  const [service, setService] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [icon, setIcon] = useState(null); // Estado para la imagen

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica de campos
    if (!service || !user || !password || !icon) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Crear FormData para enviar datos con la imagen al backend
    const formData = new FormData();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    console.log(token);
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
        // Limpiar campos
        setService("");
        setUser("");
        setPassword("");
        // Para limpiar el input de tipo file
        document.querySelector("input[type=file]").value = "";
        setIcon(null);
        alert("Datos agregados correctamente");
        // Recargar la página para mostrar los nuevos datos
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || "Error al agregar datos");
      }
    } catch (error) {
      console.error("Error al agregar datos:", error);
      alert("Error al agregar datos");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ["png", "jpg"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!file) return;

    if (!allowedExtensions.includes(fileExtension)) {
      alert("Selecciona un archivo .png o .jpg");
      return;
    }

    setIcon(file); // Guardar el archivo en el estado
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
          {icon && <Icon src={URL.createObjectURL(icon)} alt="icon" />} {/* Mostrar la vista previa de la imagen */}
        </Label>
        <br />
        <Button type="submit">Guardar</Button>
      </form>
    </FormContainer>
  );
};

export default DashboardForm;
