import React from 'react';
import styled from "styled-components";

const TSpinnerContainer = styled.div`
  z-index: 10000;
  margin: 3px;
`;

const TSpinner = styled.div`
    animation: 400ms linear infinite spinner;
    border-bottom: 2px solid transparent;
    border-left: 2px solid #29d;
    border-radius: 50%;
    border-right: 2px solid transparent;
    border-top: 2px solid #29d;
    box-sizing: border-box;
    height: 18px;
    width: 18px;

    @keyframes spinner {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
`;

const Spinner: React.FC = () => (
  <TSpinnerContainer>
    <TSpinner />
  </TSpinnerContainer>
)

export default Spinner
