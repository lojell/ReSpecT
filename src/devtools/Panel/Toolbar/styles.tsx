import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    background-color: #F1F3F4;
    border-top: 0.5px solid #D8DBDE;
    border-bottom: 0.5px solid #D8DBDE;
    padding: 2px 10px;
    height: 26px;
`

export const Control = styled.label`
    display: flex;
    align-items: center;
`;

export const Divider = styled.div`
    background-color: rgb(202, 205, 209);
    height: 16px;
    width: 1px;
    margin: auto 6px;
    display: inline-block;
`;

export const Select = styled.select`
    background: transparent;
    border: none;
    margin: auto 10px;
    font-size: 12px;
`;


export const ToolbarButton = styled.button`
    white-space: nowrap;
    overflow: hidden;
    background: 0 0;
    border-radius: 0;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    min-width: 28px;
`;

