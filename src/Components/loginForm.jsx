import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);

  const handleRegister = () => {
    navigate('/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        const responseData = await response.json();

        if (responseData.token) {
          setToken(responseData.token);
          localStorage.setItem('token', token);
          localStorage.setItem('userId', responseData.userId);
          setIsLoggedIn(true);
          console.log("Sesión iniciada");
          navigate('/dashboard', { state: { token: responseData.token } });
        } else {
          alert("No se ha podido iniciar sesión");
        }
      } else if (response.status === 401) {
        alert("El email o la contraseña son incorrectos");
      } else if (response.status === 402) {
        alert("Faltan campos por rellenar");
      } else if (response.status === 400) {
        alert("Datos incorrectos");
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <LoginContainer>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Correo Electrónico'
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Contraseña'
        />
        <Buttons>
          <RegisterButton type="button" onClick={handleRegister}>Registrarse</RegisterButton>
          <LoginButton type="submit">Iniciar sesión</LoginButton>
        </Buttons>
      </Form>
    </LoginContainer>
  );
};

export default LoginForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Input = styled.input`
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 2rem;
  border: none;
  width: 70%;
  font-size: 1.5rem;
  outline: none;
  background-color: rgba(58, 55, 55, 0.57);

  &::placeholder {
    color: rgba(197, 200, 200, 0.60);
  }
`;

const Buttons = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  
`;

const RegisterButton = styled.button`
  width: 45%;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: inset 0.1rem rgba(238, 239, 233, 0.8);
  background-color: #111016;
  color: #959695;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(238, 239, 233, 0.8);
    color: #111016;
    cursor: pointer;
  }
`;

const LoginButton = styled.button`
  width: 45%;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  background-color: rgba(238, 239, 233, 0.8);
  color: #111016;
  font-size: 1rem;
  height: 2.5rem;
  
  text-align: center;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #111016;
    color: rgba(238, 239, 233, 0.8);
    border: inset 0.1rem rgba(238, 239, 233, 0.8);
    cursor: pointer;
  }
`;

const LoginContainer = styled.div`
  background-color: #111016;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40rem;
  height: 30rem;
  border-radius: 6.25rem;
  box-shadow: 0.25rem 0.375rem 0.9375rem 0.0625rem rgba(254, 254, 254, 0.15);
  padding: 2rem;

  @media (max-width: 768px) {
    width: 80%;
    height: auto;
    padding: 1rem;
  }

  @media (max-width: 480px) {
    width: 90%;
    height: auto;
    padding: 0.5rem;
  }
`;
