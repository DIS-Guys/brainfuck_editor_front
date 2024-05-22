export function App() {
  return (
    <div className="container">
      <h1 className="title">Brainfuck Editor</h1>
      <div className="tools">
        <div className="editor">
          <div className="code-input">
            <textarea
              id="code-input"
              placeholder="Write your code here..."
            ></textarea>
            <button id="run-button"></button>
          </div>
          <div className="editor-blocks">
            <div className="input-container">
              <textarea id="input" placeholder="Input value"></textarea>
            </div>
            <div className="output-container">
              <div id="output">Result will be here...</div>
            </div>
          </div>
        </div>
        <div className="debugger">
          <div id="debugger-container">Місце для дебагера...</div>
        </div>
      </div>
    </div>
  );
}
