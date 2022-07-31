import styled from "styled-components";
import LogoIco from '../../../assets/logo.svg';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0px;
`;

export const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;

    align-self: center;
    flex: 1;
    justify-content: center;
`;

export const LogoIcoStyled = styled(LogoIco)`
    opacity: 0.1;
`;