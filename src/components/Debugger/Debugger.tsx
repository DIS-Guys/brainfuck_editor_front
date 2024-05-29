import { useState } from 'react';
import './Debugger.css';

type Props = {
  code: string;
  input: string;
};

export const Debugger: React.FC<Props> = ({ code, input }) => {
  const [memorySize, setMemorySize] = useState(30000);
  const [debuggerCode, setDebuggerCode] = useState('');
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Array<Array<number>>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const highlightCode = (code: string, position: number) => {
    return code
      .split('\n')
      .join('')
      .split('')
      .map((char, index) => {
        if (index === position) {
          return `<span style="background-color: yellow;">${char}</span>`;
        }
        return char;
      })
      .join('');
  };

  const handleMemorySizeBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (+event.target.value > 30000) {
      setMemorySize(30000);
    }
  };

  const stepThroughCode = () => {
    if (!isDebugging || currentIndex >= debugInfo.length - 1) {
      return;
    }
    const newIndex = currentIndex + 1;
    setDebuggerCode(highlightCode(code, debugInfo[newIndex][0]));
    setCurrentIndex(newIndex);
  };

  const handleStartDebugging = () => {
    const body = {
      code,
      input,
    };

    setCurrentIndex(0);
    setIsDebugging(true);
    fetch('http://localhost:8080/brainfuck/debug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then(data => {
        if (data.output.length === 1) {
          setIsDebugging(false);
        } else {
          setDebugInfo(data.output);
          setDebuggerCode(highlightCode(code, 0));
        }
      });
  };

  return (
    <div className="debugger">
      <div className="memory-size">
        <p id="memory-size">Memory size</p>
        <input
          type="number"
          id="memory-size-input"
          onChange={(event) => setMemorySize(+event.target.value)}
          onBlur={handleMemorySizeBlur}
          value={memorySize}
        />
      </div>
      <div className="control-buttons">
        <button
          className="control-button"
          id="start"
          onClick={handleStartDebugging}
        >
          Start
        </button>
        <button
          className="control-button"
          id="stop"
          onClick={() => {
            setIsDebugging(false);
          }}
        >
          Stop
        </button>
        <button className="control-button" id="run">
          Run
        </button>
        <button className="control-button" id="step" onClick={stepThroughCode}>
          Step
        </button>
      </div>
      {isDebugging && (
        <div
          className="code-container"
          dangerouslySetInnerHTML={{ __html: debuggerCode }}
        ></div>
      )}
    </div>
  );
};
