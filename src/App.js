import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './Components/registerPage';
import LoginPage from './Components/loginPage';
import DashboardPage from './Components/dashboardPage';
import HomePage from './Components/homePage';
import NavBar from './Components/navBar';
import PrivateRoute from './Components/privateRoute';
import { createGlobalStyle, ThemeProvider } from 'styled-components'; // ThemeProvider es opcional, pero si se usa, se debe definir un tema para el estilo global

// Crea un componente global de estilo
const GlobalStyle = createGlobalStyle`
  body {
    //Establecemos de fondo un degradé que va de abajo para arriba desde #0A071C al #010003

    background: #0A071C;
    background: -webkit-linear-gradient(to top, #0A071C, #010003);
    background: linear-gradient(to top, #0A071C, #010003);
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-position: center center;
    height: 100vh;
    width: 100vw;
    overflow: hidden;

    margin: 0;
    font-family: 'Arial', sans-serif;
  }
`;

// Define un tema si es necesario
const theme = {
  colors: {
    primary: '#0077cc',
  },

  mediaQueries: {
    below768: 'only screen and (max-width: 768px)',
  },

  borderRadius: {
    normal: '5px',
  },

};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <Router>
          <NavBar isLoggedIn={isLoggedIn} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </>
    </ThemeProvider>
  );
};

export default App;
