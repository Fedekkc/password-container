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
          // Almacena el token en localStorage o en una cookie si es necesario
          localStorage.setItem('token', token);
          // Almacena el ID del usuario en localStorage o en una cookie si es necesario
          localStorage.setItem('userId', responseData.userId);

          // Actualiza el estado de isLoggedIn en App.js
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
    <>
      <LoginContainer>
      <Form onSubmit={handleSubmit}>
      
      <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Correo Electrónico' />
      
      
      
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Contraseña' />
      <Buttons>
      <RegisterButton type="button" className='registerButton' onClick={handleRegister}>Registrarse</RegisterButton>
      <LoginButton type="submit" className='loginButton'>Iniciar sesión</LoginButton>
      </Buttons>
      
      
      
    </Form>
    </LoginContainer>
    
    
    </>
    
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
  margin-top: 10%;
  
  padding: 10px;
  border-radius: 20px;
  border: none;
  width: 71%;
  height: 18%;
  font-size: 2.1rem;
  outline: none;
  
  background-color: rgba(58, 55, 55, 0.57);

  
  &::placeholder {
    color: rgba(197, 200, 200, 0.60);
  }
`;

const Buttons = styled.div`
width: 71%;
height: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;


`;


const RegisterButton = styled.button`

width: 25%;
height: 30%;
border-radius: 35px;
border: inset 2px rgba(238,239,233,0.8);
background-color: #111016;
color: #959695;

&:hover{
  background-color: rgba(238,239,233,0.8);
  color: #111016;
  cursor: pointer;
}
`;

const LoginButton = styled.button`

width: 25%;
height: 30%;
border-radius: 35px;
background-color: rgba(238,239,233,0.8);
color: #111016;

&:hover{
  background-color: #111016;
  color: rgba(238,239,233,0.8);
  border: inset 2px rgba(238,239,233,0.8);
  cursor: pointer;
}

`;


const LoginContainer = styled.div`
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

