import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";
import Button from "../components/Button";
import "./Room.css";

export default function Room() {
  const navigate = useNavigate();
  const [code, setCode] = useState("// Start coding...");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);


  return (
    <div className="room-root">

      {/* Top Bar */}
      <header className="room-header">
        <div className="room-actions-left">
          <Button size="small">Save Room</Button>
        </div>

        <div className="room-actions-right">
          <Button size="small">Compile</Button>
          <Button size="small">Run</Button>
          <Button size="small" onClick={() => navigate("/dashboard")}>
            Exit
          </Button>
        </div>
      </header>

      {/* Main Editor Area */}
      <main className="room-main">
        <div className="editor-pane">
          <CodeEditor value={code} onChange={setCode} readOnly={false} />
        </div>

        <div className="output-pane">
          <OutputPanel output={output} error={error} />
        </div>
      </main>

    </div>
  );
}
