import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './Components/registerPage';
import LoginPage from './Components/loginPage';
import DashboardPage from './Components/dashboardPage';
import HomePage from './Components/homePage';
import NavBar from './Components/navBar';
import PrivateRoute from './Components/privateRoute';  // Importa el componente PrivateRoute

import { createGlobalStyle } from 'styled-components';

// Crea un componente global de estilo
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #0A071C;  // Cambia esto al color que desees
    margin: 0;  // Ajusta según tus necesidades
    font-family: 'Arial', sans-serif;  // Puedes cambiar la fuente
  }
`;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} />
      <GlobalStyle />
      
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Aplica PrivateRoute solo a la ruta de DashboardPage */}
          <PrivateRoute path="/dashboard" element={<DashboardPage />} isLoggedIn={isLoggedIn} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
