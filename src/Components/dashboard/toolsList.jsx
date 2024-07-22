import React from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Tool = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    background-color: #111016;
    border-radius: 101px;


`;


const toolsList = () => {
    return (
        <Container>
            
            <Tool>  </Tool>
            
        </Container>
    );
}