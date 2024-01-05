import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ShowPasswords from "./showPasswords";




const DashboardForm = () => {
    const [service, setService] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const handleSubmit = (e) => {
      const userId = localStorage.getItem('userId');
      console.log(userId);
        e.preventDefault();
        const data = { userId, service, user, password };
        
        fetch('http://localhost:5000/dashboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then((response) => {
          if (response.status === 200) {
            navigate('/dashboard');
          }    
        });
    
    
      }

    return (
        <div>
          <ShowPasswords />
          <form onSubmit={handleSubmit}>
            <label>
                Servicio:
                <input type="text" value={service} onChange={(e) => setService(e.target.value)} />
            </label>
            <br />
            <label>
                Usuario:
                <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
            </label>
            <br />
            <label>
                Contraseña:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <button type="submit">Guardar</button>
        </form>

        </div>
        
    );
}
    
export default DashboardForm;