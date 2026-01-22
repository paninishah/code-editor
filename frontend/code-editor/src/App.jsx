import CodeEditor from "./components/CodeEditor";
import OutputPanel from "./components/OutputPanel";
import Buttons from "./components/Buttons";

function App() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top Bar */}
      <header
        style={{
          height: "50px",
          background: "#1e1e1e",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <span>Room: abc123</span>
        <span style={{ color: "lime" }}>LIVE</span>
        <button style={{ background: "red", color: "white" }}>
          End Session
        </button>
      </header>

      {/* Main Area */}
      <main style={{ flex: 1, display: "flex" }}>
        <div style={{ flex: 3 }}>
          <CodeEditor />
        </div>
        <div style={{ flex: 1 }}>
          <OutputPanel />
        </div>
      </main>

      {/* Bottom Bar */}
      <footer
        style={{
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          borderTop: "1px solid #ccc",
        }}
      >
        <Buttons />
      </footer>
    </div>
  );
}

export default App;
