export default function OutputPanel({ output, error }) {
  return (
    <div className="output-panel">
      {error ? (
        <pre className="output-error">{error}</pre>
      ) : (
        <pre className="output-text">{output}</pre>
      )}
    </div>
  );
}
