import { forwardRef } from 'react'
import './NumberStepper.css'

export const NumberStepper = forwardRef(({ text, max, onChange }, ref) => {
  return (
    <div className="stepper-container">
      <span className="stepper-label">{text}</span>
      <input type="number" className="stepper-stepper" defaultValue={0} min={0} max={max} onChange={onChange} ref={ref}/>
    </div>
  );
});