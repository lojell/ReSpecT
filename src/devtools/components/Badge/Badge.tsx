import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import styled from "styled-components";

const TSpan = styled.span`
    position: absolute;
    top: 4px;
    right: 0;
    color: #212529;
    background-color: #fafafa;
    display: inline-block;
    padding: 0.25em 0.4em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
`;

interface BadgeProps {
  value: number;
  className?: string;
}

const Badge: FC<BadgeProps> = ({ value, className }) => {

  return (
    value > 0
      ? <TSpan className={className}>{value}</TSpan>
      : null
  );
};

export default Badge;
