import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    padding: 10px 15px;
    align-items: center;
`;

export const Logo = styled.div`
    user-select: none;
    margin-right: 5px;
    display: flex;
`;

export const Center = styled.div`
    flex: 1;
`;

export const Controls = styled.div`
`;

export const ButtonLink = styled.button`
    background-color: transparent;
    border: none;
    color: #1A73E8;

    display: flex;
    align-items: center;
    gap: 10px;

    padding: 0;
    font-size: 12px;
`;

export const Button = styled.button`
    background-color: #F1F3F4;
    border: none;
    color: #585858;
    border-radius: 3px;
    font-size: 10px;
    font-weight: bold;
    padding: 15px;
    box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 13%);

    &:hover {
        background-color: #e6e6e6;
    }
`

export const Link = styled.a`
    color: #1A73E8;
    font-size: 12px;
`;

export const Divider = styled.div`
    width: 0.5px;
    display: inline-block;
    background-color: rgb(216, 219, 222);
    width: 0.5px;
    margin: 0 10px;
    display: inline-block;
    height: 140%;
`;