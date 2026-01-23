import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-root">
      <header className="landing-header">
        <div className="landing-logo">
          <span className="landing-logo-mark">⦿</span>
          <span className="landing-logo-name">cord</span>
        </div>
        <Button size="small" onClick={() => navigate("/auth")}>
          Launch app
        </Button>
      </header>

      <main className="landing-main">
        <section className="hero">
          <div className="hero-left">
            <p className="hero-kicker">realtime collaborative editor</p>
            <h1 className="hero-title">
              Code with your team,
              <span className="hero-highlight"> in sync.</span>
            </h1>
            <p className="hero-subtitle">
              Spin up a room, invite teammates, and run code in multiple
              languages — all inside{" "}
              <span className="hero-inline-brand">cord</span>.
            </p>
            <div className="hero-actions">
              <Button onClick={() => navigate("/auth")}>Get started</Button>
              <button
                className="hero-ghost"
                onClick={() => navigate("/auth")}
              >
                Login to existing room
              </button>
            </div>
            <div className="hero-pills">
              <span>Live cursors</span>
              <span>Shared language &amp; code</span>
              <span>Judge0 execution</span>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="preview-room">cord / sample-room</span>
              </div>
              <div className="preview-body">
                <div className="preview-line-numbers">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <div className="preview-code">
                  <span>
                    <span className="kw">function</span>{" "}
                    <span className="fn">cord</span>() &#123;
                  </span>
                  <span>
                    &nbsp;&nbsp;<span className="kw">return</span>{" "}
                    <span className="str">"collaborate, compile, ship"</span>;
                  </span>
                  <span>&#125;</span>
                  <span className="comment">
                    // join a room and start typing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
