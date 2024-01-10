import React, { useState } from "react";
import styled from "styled-components";
import BurguerButton from "./burguerButton";

const NavBar = ({ isLoggedIn }) => {
    const [clicked, setClicked] = useState(false);
  
    const handleClick = () => {
      setClicked(!clicked);
    };
  
    return (
      <>
        <NavContainer>
          <h2>Navbar</h2>
          <div className={`links ${clicked ? "active" : ""}`}>
            {isLoggedIn ? (
              <>
                <a href="/dashboard">Dashboard</a>
                <a href="/profile">Profile</a>
                <a href="/logout">Logout</a>
              </>
            ) : (
              <>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
              </>
            )}
          </div>
          <div className="burguerContainer">
          <BurguerButton clicked={clicked} handleClick={handleClick} />
          </div>
        <Bgdiv className={`links ${clicked ? "active" : ""}`}></Bgdiv>
      </NavContainer>
    </>
  );
};

export default NavBar;

const NavContainer = styled.div`
    h2{
        color: white;
        font-size: 1.5rem;

    }
    position: relative;
    padding: .4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #111016;
    
    

    a{
        color: white;
        text-decoration: none;
        margin-right: 1rem;
    }

    .links{
        position: absolute;
        top: -700px;
        left: -2000px;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        transition: all .6s ease;
        z-index: 1;
        a{
            color: white;
            font-size: 2rem;
            display: block;
        }
        @media(min-width: 768px){
            position: initial;
            margin: 0;
            a{
                
                font-size: 1rem;
                color: white;
                display: inline;
            }
        }

    }

    .links.active {
        width: 100%;
        display: block;
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        top: 100%; /* Cambia esta línea */
        left: 0;
        right: 0;
        text-align: center;
        
        transform: translateY(0); /* Cambia esta línea */
        a {
            
            color: white;
            font-size: 2rem;
            margin-top: 1rem;
        }
    }
    

    .burguerContainer{
        @media(min-width: 768px){
            display: none;
        }

    }




    

`;


const Bgdiv = styled.div`
    position: absolute;
    top: 100%; /* Cambia esta línea */
    left: 0;
    background-color: #111016;
    z-index: 0;
    width: 0%;
    height: 0;
    transition: all 0.6s ease;

    &.active {
        border-radius: 0 0 80% 0;
        width: 100%;
        height: 100vh;
        z-index: 0;
        top: 100%; /* y esta línea */
        left: 0;
    }
`;