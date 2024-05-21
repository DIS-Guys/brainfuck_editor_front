function App() {
  return (
    <div className="container">
      <header>
        <h1>Brainfuck Editor</h1>
      </header>
      <main>
        <div className="editor">
          <textarea
            id="code"
            placeholder="Enter your Brainfuck code here..."
          ></textarea>
        </div>
        <div className="controls">
          <button id="run">Run</button>
          <button id="stop">Stop</button>
        </div>
        <div className="output">
          <h2>Output</h2>
          <pre id="output"></pre>
        </div>
      </main>
    </div>
  );
}

export default App;
