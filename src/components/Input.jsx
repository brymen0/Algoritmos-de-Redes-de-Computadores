import './Input.css'
import React from 'react';

export const Input = React.forwardRef(({ text, placeholder, onKeyDown}, ref) => {
  return (
    <div className="container">
      <span className="input-label">{text}</span>
      <input type="text" placeholder={placeholder} className="input-field" ref={ref} onKeyDown={onKeyDown}/>
    </div>
  );
});
