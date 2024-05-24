import { useEffect, useState } from 'react';
import './Debugger.css';

type Props = {
  code: string;
}

export const Debugger: React.FC<Props> = ({ code }) => {
  const [memorySize, setMemorySize] = useState(30000);
  const [debuggerCode, setDebuggerCode] = useState('');
  const [isDebugging, setIsDebugging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    const highlightedCode = code
      .split('\n')
      .join('')
      .split('')
      .map((char, index) => {
        if (index === currentPosition) {
          return `<span style="background-color: yellow;">${char}</span>`;
        }
        return char;
      })
      .join('');
    setDebuggerCode(highlightedCode);
  }, [code, currentPosition]);

  const handleMemorySizeBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (+event.target.value > 30000) {
      setMemorySize(30000);
    }
  };

  const stepThroughCode = () => {
    setCurrentPosition((prevPosition) => {
      if (prevPosition < code.length - 1) {
        return prevPosition + 1;
      }
      return prevPosition;
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
          onClick={() => {
            setIsDebugging(true);
            setCurrentPosition(0);
          }}
        >
          Start
        </button>
        <button
          className="control-button"
          id="stop"
          onClick={() => {
            setIsDebugging(false);
            setCurrentPosition(0);
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
