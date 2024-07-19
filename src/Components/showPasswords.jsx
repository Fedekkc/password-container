import React, { useState } from "react";
import styled from "styled-components";
import DashboardForm from "./dashboardForm";

const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rem; 
    padding: 20px;     
    margin-top: 20px;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    width: 80%;
    height: 80%;
    
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
`;

const Title = styled.h2`
    color: #333;
`;


const PasswordContainer = styled.div`
    cursor: pointer;
    background-color: #111016;
    border-radius: 101px;
    width: 100%;
    max-width: 100%;
    
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;    
    box-shadow: 4px 6px 15px 1px rgba(254, 254, 254, 0.15);
    height: 6rem;

    &:hover {
        transform: scale(1.05);
        transition: transform 0.2s;
    }
`;

const PasswordFrame = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
    
`;

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const IconContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 50%;
`;

const Icon = styled.img`
    width: 3rem;
    height: 3rem;
    object-fit: cover;
    border-radius: 50%;
    margin-top: 10px;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: left;
    width: 20%;
`;

const PasswordService = styled.p`
    font-size: 2.0rem;
    font-family: 'Gurajada', sans-serif;
    color: #FFFFFF;
    margin-right: 10px;
`;

const Plus = styled.p`
    color: #FFFFFF;
    font-size: 2.0rem;
    font-family: 'Gurajada', sans-serif;
`;

const PasswordDetails = styled.div`
    background-color: #f1f1f1;
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    text-align: left;
`;

const AnimContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
    max-width: 100%;
`;


const ShowPasswords = ({ passwords, setPasswords }) => {
    const [showForm, setShowForm] = useState(false);

    const handleAddPassword = (e) => {
        e.preventDefault();
        setShowForm(!showForm);
    };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    if (passwords == null) {
        return (
            <Container>
                <Title>No hay contraseñas registradas</Title>
            </Container>
        );
    }

    return (
        <MainContainer>
            {showForm && <DashboardForm setPasswords={setPasswords} />}
            <Container>
                <PasswordContainer onClick={handleAddPassword}>
                    <Plus>+</Plus>
                </PasswordContainer>
                {passwords.map((password, index) => (
                    <AnimContainer key={index}>
                        <PasswordContainer onClick={() => toggleExpand(index)}>
                            <PasswordFrame>
                                <IconContainer>
                                    {password.iconURI && <Icon src={password.iconURI} alt="a" />} 
                                </IconContainer>
                                <TextContainer>
                                    <PasswordService>{password.service}</PasswordService> 
                                </TextContainer>
                            </PasswordFrame>
                        </PasswordContainer>
                        {expandedIndex === index && (
                            <PasswordDetails>
                                <p>Contraseña: {password.password}</p>
                                <p>Usuario: {password.username}</p>
                            </PasswordDetails>
                        )}
                    </AnimContainer>
                ))}
            </Container>
        </MainContainer>
    );
};

export default ShowPasswords;
