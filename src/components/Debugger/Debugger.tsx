import { useState } from 'react';
import './Debugger.css';
import { DebugInfo } from '../../types/DebugInfo';
import classNames from 'classnames';

type Props = {
  code: string;
  input: string;
};

export const Debugger: React.FC<Props> = ({ code, input }) => {
  const [memorySize, setMemorySize] = useState(30000);
  const [debuggerCode, setDebuggerCode] = useState('');
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugInfo, setDebugInfo] = useState<number[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [memory, setMemory] = useState<number[]>(Array(30000).fill(0));
  const [memoryViewStart, setMemoryViewStart] = useState(0);

  const highlightCode = (code: string, position: number) => {
    return code
      .split('\n')
      .join('')
      .split('')
      .map((char, index) => {
        if (index === position) {
          return `<span style="background-color: rgba(255, 255, 0, 0.5);">${char}</span>`;
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
    const newDebugInfo = debugInfo[newIndex];
    setDebuggerCode(highlightCode(code, newDebugInfo[0]));
    setCurrentIndex(newIndex);
    setMemory((prevMemory) => {
      const newMemory = [...prevMemory];
      newMemory[newDebugInfo[1]] = newDebugInfo[2];
      return newMemory;
    });
    if (newDebugInfo[1] >= memoryViewStart + 10) {
      setMemoryViewStart(newDebugInfo[1] - 9);
    } else if (newDebugInfo[1] < memoryViewStart) {
      setMemoryViewStart(newDebugInfo[1]);
    }
  };

  const handleStartDebugging = () => {
    const body = {
      code,
      input,
    };

    setIsDebugging(true);
    setCurrentIndex(0);
    setMemory(Array(30000).fill(0));
    setMemoryViewStart(0);
    fetch('http://localhost:8080/brainfuck/debug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data: DebugInfo) => {
        if (data.debugInfo.length === 1) {
          setIsDebugging(false);
        } else {
          setDebugInfo(data.debugInfo);
          setDebuggerCode(highlightCode(code, 0));
        }
      });
  };

  const handleStopDebugging = () => {
    setCurrentIndex(-1);
    setMemory(Array(30000).fill(0));
    setMemoryViewStart(0);
    setIsDebugging(false);
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
          onClick={handleStopDebugging}
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
      <div className="memory-container">
        {memory
          .slice(memoryViewStart, memoryViewStart + 10)
          .map((cell, index) => (
            <div key={index} className="memory-wrapper">
              <div
                className={classNames('memory-cell', {
                  highlighted:
                    memoryViewStart + index === debugInfo[currentIndex]?.[1],
                })}
              >
                {cell}
              </div>
              <div className="memory-index">{memoryViewStart + index}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
