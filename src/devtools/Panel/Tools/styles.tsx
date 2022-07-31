import styled from "styled-components";

interface ContainerProps {
    expand: boolean
}

export const Container = styled.div<ContainerProps>`
    display: flex;
    flex: ${props => props.expand ? 1 : 0};
`;

export const Navigation = styled.div`
    display: flex;
    background-color: #F1F3F4;
    
    width: 48px;
`;

export const NavigationButton = styled.button`
    background-color: #F1F3F4;
    border: none;
    border-left: 0.5px solid #D8DBDE;
    border-right: 0.5px solid #D8DBDE;
    padding: 6px;
    width: 100%;

    &:hover {
        background-color: #e6e6e6;
    }
`;

export const Body = styled.div`
    display: flex;
    width: 0px;
    flex: 1;
`;
