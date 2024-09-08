// components/ui/select/Select.js
'use client'
import { useState } from 'react';

export const Select = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {selectedValue || 'Choose one'}
      </button>
      {isOpen && (
        <div>
          {React.Children.map(children, child => {
            return React.cloneElement(child, { onSelect: handleSelect });
          })}
        </div>
      )}
    </div>
  );
};

export const SelectItem = ({ value, children, onSelect }) => (
  <div onClick={() => onSelect(value)}>
    {children}
  </div>
);
