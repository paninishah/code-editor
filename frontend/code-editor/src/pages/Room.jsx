import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";
import Button from "../components/Button";
import "./Room.css";

const LANGUAGES = ["javascript", "python", "cpp", "c", "java"];
// Always talk to local backend / websocket
const API_BASE = "http://127.0.0.1:8000";
const WS_BASE = "ws://127.0.0.1:8000";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = new WebSocket(
      `${WS_BASE}/ws/room/${roomId}/?token=${encodeURIComponent(token || "")}`
    );

    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "init") {
        setCode(data.code || "");
        setLanguage(data.language || "javascript");
      }

      if (data.type === "code") {
        isRemoteUpdate.current = true;
        setCode(data.code);
      }

      if (data.type === "language") {
        setLanguage(data.language);
      }
    };

    return () => socket.close();
  }, [roomId]);

  function sendSocket(payload) {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  }

  async function runCode() {
    if (!code.trim()) return;

    setRunning(true);
    setError(null);
    setOutput("");

    try {
      const res = await fetch(`${API_BASE}/api/execution/run/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();
      setOutput(data.output || "");
      setError(data.error || null);
    } catch {
      setError("Execution failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="room-root">
      <Header
        right={
          <>
            <div className="room-id-box">
              <span className="room-id-label">Room</span>
              <span className="room-id-value">{roomId}</span>
              <button
                className="copy-room-btn"
                onClick={() => navigator.clipboard.writeText(roomId)}
              >
                Copy
              </button>
            </div>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                sendSocket({
                  type: "language",
                  language: e.target.value,
                });
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <Button size="small" onClick={runCode} disabled={running}>
              {running ? "Running..." : "Run"}
            </Button>
            <Button size="small" onClick={() => navigate("/dashboard")}>
              Exit
            </Button>
          </>
        }
      />

      <main className="room-main">
        <div className="editor-pane">
          <CodeEditor
            value={code}
            language={language}
            readOnly={false}
            onChange={(val) => {
              if (isRemoteUpdate.current) {
                isRemoteUpdate.current = false;
                return;
              }

              setCode(val);
              sendSocket({ type: "code", code: val });
            }}
          />
        </div>

        <div className="output-pane">
          <OutputPanel output={output} error={error} />
        </div>
      </main>
    </div>
  );
}
