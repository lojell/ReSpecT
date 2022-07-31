import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 0;
  flex: 1;
`;

export const LabelItem = styled.span`
  color: rgb(145 148 157);
  display: inline-block;
  flex: none;
  margin: auto 2px;
  padding: 3px;
  border-radius: 6px;
  overflow: hidden;
  cursor: none;
  font-size: 12px;
  line-height: 14px;
`;



export const FilterItem = styled.span<{ active: boolean, special?: boolean }>`
  background-color: ${({ active, special }) => active && !special ? 'rgb(202, 205, 209)' : 'none'};
  color: rgb(32, 33, 36);
  display: inline-block;
  flex: none;
  margin: auto 2px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  font-size: 12px;
  line-height: 14px;
  
  border: ${({ active, special }) => (active && special) ? 'rgb(164 184 199) 2px solid' : 'none'};
  padding: ${({ active, special }) => (active && special) ? '1px 7px' : '3px 9px'};

  &:hover {
    background-color: rgb(212, 216, 219);
  }
  &:active {
    background-color: rgb(202, 205, 209);
  }
`;


export const SpecialFilterItem = styled(FilterItem)`
  font-weight: 500;
`;

export const RegularFilterContainer = styled.div`
  display: flex;
  overflow-y: auto;
  user-select: none;

  &::-webkit-scrollbar {
    height: 1.3px;
    background: #cfcfcf;
  }

  &::-webkit-scrollbar-thumb {
      background: #393812;
      height: 2px;
  }

  &::-webkit-scrollbar-corner { display: none; }
  &::-webkit-scrollbar-button { display: none; }
  &::-webkit-scrollbar-track { display: none; }
  &::-webkit-scrollbar-track-piece { display: none; }
  
  &::-webkit-scrollbar-corner { display: none; }
  &::-webkit-resizer { display: none; }

`;

