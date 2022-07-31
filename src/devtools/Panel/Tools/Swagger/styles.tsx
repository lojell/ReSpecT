import styled from "styled-components";

export const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
`;

export const Divider = styled.div`
    background-color: #e2e2e2;
    height: 0.5px;
    padding: 0;
`;

export const ButtonGroup = styled.div`
    padding: 9px 15px;
    display: flex;
    justify-content: end;
`;

export const Button = styled.button`
    color: white;
    cursor: pointer;
    border: none;
    background-color: ${props => props.disabled ? '#c4c4c4' : '#1a73e8'};
    padding: 4.5px;
    border-radius: 3px;
    box-shadow:  ${props => props.disabled ? '#c4c4c4' : '0px 1px 4px 0px rgb(26 115 232)'} ;
    width: 150px;


    &:hover {
        background-color: ${props => props.disabled ? '#c4c4c4' : '#065ccc'};
    }

    &:active {
        background-color: #065ccc;
        box-shadow: 0px 1px 0px 0px rgb(26 115 232);
        transform: translateY(2px);
    }
`;

export const Form = styled.form`
    margin: 6px;
    display: flex;
    flex-direction: column;
    flex: 1;

        
    & p {
        display: flex;
        align-items: center;
    }

    & label {
        width: 100px;
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        color: #a5acad;
        text-align: right;
        margin-right: 8px;
    }

    & input {
        border: none;
        padding: 11px;
        border-radius: 3px;
        box-shadow: inset 0px 0px 2px 0px rgb(0 0 0 / 13%);
        flex: 1
    }

    & button {
        border: none;
        background-color: #f8f8f8;
        padding: 11px;
        border-radius: 3px;
        box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 13%);
    }
`;

export const ApiDroppableArea = styled.div`
    margin: 6px;
    flex: 1;
    border: 3px dashed #d3d3d3;
    background-color: rgb(255 255 255);
    border-radius: 26px;
    position: relative;
`;

export const DropLabel = styled.div`
    background: aliceblue;
    padding: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export const CornerBar = styled.div`
    position: absolute;
    right: 25px;
    top: 10px;
    z-index: 1000;
`;

export const CopyButton = styled.button`
    white-space: nowrap;
    overflow: hidden;
    background: 0 0;
    border-radius: 0;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    min-width: 28px;
    opacity: 0.1;
    transition: opacity 0.1s ease-in;
    will-change: transform;

    &:hover {
        opacity: 0.5;
    }

    &:active {
        opacity: 0.7;
        transform: translateY(2px);
    }
`;
