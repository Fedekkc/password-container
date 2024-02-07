import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    password2: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    if (formData.nombre === '' || formData.apellido === '' || formData.email === '' || formData.password === '' || formData.password2 === '') {
      return false;
    }
    if (formData.password !== formData.password2) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Faltan campos por rellenar");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        const responseData = await response.json();

        if (responseData.token) {
          localStorage.setItem('token', responseData.token);
        }
        navigate('/login');
      } else if (response.status === 400) {
        alert("Las contraseñas no coinciden");
      } else if (response.status === 409) {
        alert("El email ya está registrado");
      } else if (response.status === 500) {
        alert("Error en el servidor");
      } else if (response.status === 401) {
        alert("Faltan campos por rellenar");
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <RegisterContainer>
      <Form onSubmit={handleSubmit} method="POST">
        <Nombres>
        <Input type="text" name="nombre" placeholder="Nombre" className='nombresInput' value={formData.nombre} onChange={handleChange} />
        <Input type="text" name="apellido" placeholder="Apellido" className='nombresInput' value={formData.apellido} onChange={handleChange} />
        </Nombres>
        <Input type="text" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} />
        <Input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
        <Input type="password" name="password2" placeholder="Repetir Contraseña" value={formData.password2} onChange={handleChange} />
        <SubmitButton type="submit">Registrarse</SubmitButton>
      </Form>
    </RegisterContainer>
  );
};

export default RegisterForm;

const RegisterContainer = styled.div`
  background-color: #111016;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  height: 50%;
  border-radius: 100px;
  box-shadow: 4px 6px 15px 1px rgba(254, 254, 254, 0.15);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  

`;

const Nombres = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 74%;
  height: 8%;
  .nombresInput {
    width: 40%;
    height: 100%;


  }

`;

const Input = styled.input`
  margin-top: 5%;
  padding: 10px;
  border-radius: 20px;
  border: none;
  width: 71%;
  height: 8%;
  font-size: 1.5rem;
  outline: none;
  background-color: rgba(58, 55, 55, 0.57);

  &::placeholder {
    color: rgba(197, 200, 200, 0.60);
    text-align: center;    
  }
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  width: 25%;
  height: 40px;
  border-radius: 35px;
  background-color: rgba(238, 239, 233, 0.8);
  color: #111016;

  &:hover {
    background-color: #111016;
    color: rgba(238, 239, 233, 0.8);
    cursor: pointer;
  }
`;
