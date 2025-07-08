import './Button.css'

export function Button({ label, onClick }) {
  return (
    <button className="button-button" onClick={onClick}>
      {label}
    </button>
  );
}