import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={handleSubmit} method="POST">
      <label>
        Nombre:
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
      </label>
      <br />
      <label>
        Apellido:
        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} />
      </label>
      <br />
      <label>
        Email:
        <input type="text" name="email" value={formData.email} onChange={handleChange} />
      </label>
      <br />
      <label>
        Contraseña:
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
      </label>
      <br />
      <label>
        Repetir Contraseña:
        <input type="password" name="password2" value={formData.password2} onChange={handleChange} />
      </label>
      <br />
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default RegisterForm;
