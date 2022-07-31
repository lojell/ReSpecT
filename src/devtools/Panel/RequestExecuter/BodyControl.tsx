import React, { FC, useCallback, useEffect, useState } from 'react';
import { BodyTextArrea } from './styles';

interface BodyControlProps {
  body: string;
  onChange: (body: string) => void;
}

const BodyControl: FC<BodyControlProps> = ({ body: bodyProp, onChange }) => {
  const [body, setBody] = useState(bodyProp);

  useEffect(() => {
    setBody(bodyProp);
  }, [bodyProp])

  const handleBodyChange = useCallback((e) => {
    setBody(e.target.value)
    onChange(e.target.value);
  }, []);
  console.log('render');
  return (
    <BodyTextArrea placeholder='Body' value={body} onChange={handleBodyChange}>
    </BodyTextArrea>
  );
};

export default BodyControl;
