import React from "react";
import styled from "styled-components";

const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
    margin-top: 20px;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    width: 80%;
    height: 80%;
`;

const Title = styled.h2`
    color: #333;
`;

// Botón "agregar contraseña"
const AddButton = styled.div`
    cursor: pointer;
    background-color: #111016;
    border-radius: 101px;
    width: 40%;
    margin: auto;
    box-shadow: 4px 6px 15px 1px rgba(254, 254, 254, 0.15);
    p {
    
        color: #FFFFFF;
        font-size: 2.0rem;
        font-family: 'Gurajada', sans-serif;
    }
`;


const PasswordContainer = styled.div`
    cursor: pointer;
    background-color: #111016;
    border-radius: 101px;
    width: 40%;
    margin: auto;
    box-shadow: 4px 6px 15px 1px rgba(254, 254, 254, 0.15);
    p {
       
        color: #FFFFFF;
        font-size: 2.0rem;
        font-family: 'Gurajada', sans-serif;
    }
`;

const PasswordFrame = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;



const ShowPasswords = ({ passwords }) => {
    if (passwords == null) {
        return (
            <Container>
                <Title>No hay contraseñas registradas</Title>
            </Container>
        );
    }

    return (
        <Container>
            <AddButton> <p>+</p> </AddButton>
            {passwords.map((password, index) => (
                <PasswordContainer key={index}>
                    <PasswordFrame>
                    <p>{password.service}</p>
                    </PasswordFrame>
                </PasswordContainer>
            ))}
        </Container>
    );
};

export default ShowPasswords;