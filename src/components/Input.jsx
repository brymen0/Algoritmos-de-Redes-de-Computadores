import './Input.css'

/*export function Input ({text, placeholder}) {
    return (
        <div className="container">
            <span className="input-label">{text}</span>
            <input type="text" placeholder={placeholder} className="input-field"/>
        </div>
    )
}*/

import React from 'react';

export const Input = React.forwardRef(({ text, placeholder }, ref) => {
  return (
    <div className="container">
      <span className="input-label">{text}</span>
      <input type="text" placeholder={placeholder} className="input-field" ref={ref} />
    </div>
  );
});
