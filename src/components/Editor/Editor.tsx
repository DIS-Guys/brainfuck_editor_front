import { useEffect, useRef, useState } from 'react';
import './Editor.css';
import { Output } from '../../types/Output';

type Props = {
  code: string;
  setCode: (code: string) => void;
};

export const Editor: React.FC<Props> = ({ code, setCode }) => {
  const [input, setInput] = useState('');
  const [lineNumber, setLineNumber] = useState(1);
  const [interpretedCode, setInterpretedCode] = useState('');
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

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 329) {
      return;
    } else {
      setInput(event.target.value);
    }
  }

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

  const handleRun = () => {
    const body = {
      code,
      input,
    };

    fetch('http://localhost:8080/brainfuck/interpret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data: Output) => setInterpretedCode(data.output));
  };

  return (
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
        <button className="button" id="run-button" onClick={handleRun}></button>
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
            onChange={handleInputChange}
            value={input}
          ></textarea>
          <button className="button" id="clear-input-button" onClick={() => setInput('')}></button>
        </div>
        <div className="output-container">
          {interpretedCode ? (
            <div id="output">{interpretedCode}</div>
          ) : (
            <div id="output">Result will be here...</div>
          )}
        </div>
      </div>
    </div>
  );
};
