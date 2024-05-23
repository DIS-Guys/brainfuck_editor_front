import { useEffect, useRef, useState } from 'react';

export function App() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [lineNumber, setLineNumber] = useState(1);
  const mainRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  const handleCodeInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const numberOfLines = event.target.value.split('\n').length;
    setCode(event.target.value);
    setLineNumber(numberOfLines);
  };

  const handleScroll = () => {
    if (lineNumbersRef.current && mainRef.current) {
      lineNumbersRef.current.scrollTop = mainRef.current.scrollTop;
    }
  };

  const clearEditor = () => {
    setCode('');
    setLineNumber(1);
    mainRef.current?.focus();
  };

  return (
    <div className="container">
      <h1 className="title">Brainfuck Editor</h1>
      <div className="tools">
        <div className="editor">
          <div className="code-input">
            <div className="line-numbers" ref={lineNumbersRef}>
              {Array.from({ length: lineNumber }, (_, i) => (
                <div key={i} className="number">
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              className="input"
              id="code-input"
              placeholder="Write your code here..."
              ref={mainRef}
              onChange={handleCodeInputChange}
              onScroll={handleScroll}
              value={code}
            ></textarea>
            <button className="button" id="run-button"></button>
            <button
              className="button"
              id="clear-button"
              onClick={clearEditor}
            ></button>
          </div>
          <div className="editor-blocks">
            <div className="input-container">
              <textarea
                className="input"
                id="input"
                placeholder="Input a value..."
                onChange={(event) => setInput(event.target.value)}
                value={input}
              ></textarea>
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
