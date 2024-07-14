import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ShowPasswords from "./showPasswords";
import styled from "styled-components";

const FormContainer = styled.div`
  background-color: #f5f5f5;
`;

const Label = styled.label`
  /* Add your custom styles here */
`;

const Input = styled.input`
  /* Add your custom styles here */
`;

const Button = styled.button`
  /* Add your custom styles here */
`;

const DashboardForm = () => {
  const [service, setService] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    const userId = localStorage.getItem("userId");
    console.log(userId);
    
    const data = { userId, service, user, password };

    fetch("http://localhost:5000/dashboard?action=add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status === 200) {
        navigate("/dashboard");
      }
    });
  };

  return (
    <FormContainer>
      <ShowPasswords />
      <form onSubmit={handleSubmit}>
        <Label>
          Servicio:
          <Input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
        </Label>
        <br />
        <Label>
          Usuario:
          <Input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </Label>
        <br />
        <Label>
          Contraseña:
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Label>
        <br />
        <Label>
          Imagen
          <Input type="file" />
        </Label>
        <Button type="submit">Guardar</Button>
      </form>
    </FormContainer>
  );
};

export default DashboardForm;