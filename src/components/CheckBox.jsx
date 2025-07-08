import './CheckBox.css'

export function CheckBox ({text, onChange, checked}) {
    return (
        <div className="checkbox-container">
            <span className="checkbox-label">{text}</span>
            <input type="checkbox" className="checkbox-checkbox" onChange={onChange} checked={checked}/>
        </div>
    )
}