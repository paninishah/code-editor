import "./Header.css";

export default function Header({ right }) {
  return (
    <header className="app-header">
      <div className="app-logo">
        <span className="logo-mark">⦿</span>
        <div>
          <span className="logo-name">cord</span>
          <span className="logo-subtitle">collaborative code</span>
        </div>
      </div>
      <div className="app-header-right">{right}</div>
    </header>
  );
}
