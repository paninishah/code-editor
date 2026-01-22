import "./Button.css";

export default function Button({ children, onClick, size = "default" }) {
  return (
    <button className={`btn btn-${size}`} onClick={onClick}>
      {children}
    </button>
  );
}

