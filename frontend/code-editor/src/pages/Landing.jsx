import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-root">

      <header className="landing-header">
        <Button size="small" onClick={() => navigate("/auth")}>
          Get Started
        </Button>
      </header>

      <main className="landing-main">
        <div className="hero">
          <div className="hero-letter">C</div>
          <div className="hero-words">
            <span>ode</span>
            <span>ollaborate</span>
            <span>ompile</span>
          </div>
        </div>
      </main>

    </div>
  );
}
