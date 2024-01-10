import React from "react";
import styled from "styled-components";

const BurguerButton = (props) => {
    return (
        <Burguer>
        <div onClick={props.handleClick} className={`icon nav-icon-5 ${props.clicked ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>

        </div>
        </Burguer>

    );
}

export default BurguerButton;

const Burguer = styled.div`
    .icon {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 24px;
        margin: 0 10px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
    }
    .icon span {
        position: absolute;
        display: block;
        width: 100%;
        height: 3px;
        background-color: #fff;
        border-radius: 3px;
        opacity: 1;
        left: 0;
        transform: rotate(0deg);
        transition: all 0.3s ease-in-out;
    }
    .icon span:nth-child(1) {
        top: 0px;
    }
    .icon span:nth-child(2) {
        top: 10px;
    }
    .icon span:nth-child(3) {
        top: 20px;
    }
    .icon.open span:nth-child(1) {
        top: 10px;
        left: 0;
        transform: rotate(45deg);
    }
    .icon.open span:nth-child(2) {
        opacity: 0;
    }
    .icon.open span:nth-child(3) {
        top: 10px;
        left: 0;
        transform: rotate(-45deg);
    }
    .icon.open span:nth-child(1),
    .icon.open span:nth-child(3) {
        background-color: #fff;
    }
    .icon.open span:nth-child(2) {
        background-color: transparent;
    }
    .icon.open span:nth-child(1) {
        left: 50%;
    }
    .icon.open span:nth-child(3) {
        left: 50%;
    }
    .icon.open span:nth-child(1) {
        transform: rotate(45deg);
    }
    .icon.open span:nth-child(3) {
        transform: rotate(-45deg);
    }


`;
