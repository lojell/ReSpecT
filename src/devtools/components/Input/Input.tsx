import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Input: FC<InputProps> = ({ value: valueProp, onChange, placeholder, className }) => {
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp])

  const handleValueChange = useCallback((e) => {
    setValue(e.target.value)
    onChange(e.target.value);
  }, []);

  return (
    <input type='text' value={value} onChange={handleValueChange} className={className} placeholder={placeholder} />
  );
};

export default Input;
