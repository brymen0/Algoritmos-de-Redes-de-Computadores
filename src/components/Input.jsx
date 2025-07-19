import './Input.css'
import React from 'react';

export const Input = React.forwardRef(({ text, placeholder, value, onChange,onKeyDown}, ref) => {
  return (
    <div className="container">
      <span className="input-label">{text}</span>
      <input 
        type="text" 
        placeholder={placeholder} 
        className="input-field" 
        ref={ref} 
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}/>
    </div>
  );
});
