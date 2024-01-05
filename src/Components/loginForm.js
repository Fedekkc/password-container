import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

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
          localStorage.setItem('token', responseData.token);
          //Almacena el ID del usuario en localStorage o en una cookie si es necesario
          localStorage.setItem('userId', responseData.userId);

          navigate('/dashboard', { state: { token: responseData.token } });
        }
        else {
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
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Contraseña:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default LoginForm;
