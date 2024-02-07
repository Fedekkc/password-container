import React from 'react';
import RegisterForm from './registerForm';
import styled from 'styled-components';


const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 80vh;
`;

const RegisterPage = () => {
  return (
    <RegisterContainer>
      <RegisterForm />
    </RegisterContainer>
  );
};
export default RegisterPage;
