import React, { useState } from 'react';
import LoginForm from './loginForm';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 80vh;
`;


const LoginPage = ( {setIsLoggedIn} ) => {
  

  return (
    <LoginContainer>
      <LoginForm setIsLoggedIn={setIsLoggedIn} />
    </LoginContainer>
  );
}

export default LoginPage;