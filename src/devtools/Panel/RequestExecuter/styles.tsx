import styled from "styled-components";
import Input from "../../components/Input";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    border-top: 1px solid #e2e2e2;
    background: #fff;
    z-index: 1;
`;


export const TExecuter = styled.div`
    display: flex;
    padding: 10px;
`;

export const TMethod = styled.div`
    display: flex;
    width: 75px;
`;

export const TUrl = styled.div`
    flex: 1;
    display: flex;
    padding-left: 10px;
`;

export const TSendButton = styled.button`
    display: flex;
`;

export const TInput = styled(Input)`
    border: none;
    margin-right: 10px;
    outline: none;
    width: 100%;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;


    &::placeholder {
        color: #cacaca;
    }
`;

export const TInputMethod = styled(TInput)`
    text-transform: uppercase;
`;

export const Divider = styled.div`
    background-color: #a9a9a9;
    width: 0.5px;
    margin: auto 6px;
    display: inline-block;
    height: 100%;
`;

export const TConfigTabs = styled.ul`
    display: flex;
    padding: 0;
    margin: 0 15px;
    align-items: stretch;
    margin: -10px 10px;
`;

export const TTab = styled.li`
    display: flex;
`;

export const TLink = styled.a<{ active?: boolean }>`
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 5px;
    min-width: 70px;
    justify-content: center;
    user-select: none;
    
    color: black;
    font-weight: ${({ active }) => active ? 'bold' : 'normal'};

    &:hover {
        font-weight: bold;
        background-color: #fafafa;
    }
`;

export const TTabContent = styled.div`
    border-top: 1px solid #e2e2e2;
    height:  150px;
`;

export const THeadersContainer = styled.div`
    display: grid;
    grid-template-columns: 30px 1fr 3fr;
    overflow-y: auto;
    height: 100%;
    padding: 10px;
    grid-auto-rows: min-content;
`;

export const TCell = styled.div`
    margin: 0 10px;
`;

export const HeaderInput = styled.input`
    border: none;
    margin-right: 10px;
    outline: none;
    width: 100%;

    &::placeholder {
        color: #cacaca;
    }
`;


export const BodyTextArrea = styled.textarea`
    resize: none;
    border: none;
    outline: none;
    padding: 10px;
    width: 100%;
    height: 100%;

    /* margin: -10px;
    width: calc(100% + 20px);
    height: calc(100% + 20px); */

    &::placeholder {
        color: #cacaca;
    }
`;
