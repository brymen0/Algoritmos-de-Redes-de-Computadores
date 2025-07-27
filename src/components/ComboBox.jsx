import './ComboBox.css';
import React from 'react';

export const ComboBox = React.forwardRef(({ text, options, value, onChange }, ref) => {
  return (
    <div className="combo-container">
      <span className="combo-label">{text}</span>
      <select 
        className="combo-select" 
        value={value} 
        onChange={onChange}
        ref={ref}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
});
