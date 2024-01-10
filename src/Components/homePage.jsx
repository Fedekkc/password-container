import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
    /* Add your styles here */
    padding: 20px;
    border-radius: 5px;
`;

const Title = styled.h1`
    color: #333;
    font-size: 24px;
    margin-bottom: 10px;
`;

const Link = styled.a`
    color: #007bff;
    text-decoration: none;
    margin-right: 10px;

    &:hover {
        text-decoration: underline;
    }
`;

const HomePage = () => {
    return (
        <HomeContainer>
            <Title>Home Page</Title>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>           
        </HomeContainer>
    );
};

export default HomePage;
