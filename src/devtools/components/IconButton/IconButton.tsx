import React, { FC } from 'react';
import styled from "styled-components";

import remove from '../../../assets/remove.svg';

const iconSet = {
  remove
}

const TButton = styled.button`
    white-space: nowrap;
    overflow: hidden;
    background: 0 0;
    border-radius: 0;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    opacity: 0.1;

    &:hover {
        opacity: 0.3;
    }

    &:active {
        opacity: 0.5;
        transform: translateY(2px);
    }
`;

interface IconButtonProps {
  name: keyof typeof iconSet;
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const IconButton: FC<IconButtonProps> = ({ name, onClick }) => {
  const Icon = iconSet[name];
  return (
    <TButton onClick={onClick}>
      <Icon />
    </TButton>
  );
};

export default IconButton;



