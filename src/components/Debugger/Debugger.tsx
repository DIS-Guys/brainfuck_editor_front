import { useState, useEffect } from 'react';
import './Debugger.css';
import { DebugInfo } from '../../types/DebugInfo';
import classNames from 'classnames';
import { Ascii } from '../../types/Ascii';
import { getDebugInfo, getInterpretedCode } from '../../api/code';
import { RequestBody } from '../../types/RequestBody';
import { Output } from '../../types/Output';

type Props = {
  code: string;
  input: string;
  setInterpretedCode: React.Dispatch<React.SetStateAction<string>>;
};

const asciiNames: Ascii = {
  0: 'NUL',
  1: 'SOH',
  2: 'STX',
  3: 'ETX',
  4: 'EOT',
  5: 'ENQ',
  6: 'ACK',
  7: 'BEL',
  8: 'BS',
  9: 'TAB',
  10: 'LF',
  11: 'VT',
  12: 'FF',
  13: 'CR',
  14: 'SO',
  15: 'SI',
  16: 'DLE',
  17: 'DC1',
  18: 'DC2',
  19: 'DC3',
  20: 'DC4',
  21: 'NAK',
  22: 'SYN',
  23: 'ETB',
  24: 'CAN',
  25: 'EM',
  26: 'SUB',
  27: 'ESC',
  28: 'FS',
  29: 'GS',
  30: 'RS',
  31: 'US',
  127: 'DEL',
};

export const Debugger: React.FC<Props> = ({
  code,
  input,
  setInterpretedCode,
}) => {
  const [debuggerCode, setDebuggerCode] = useState('');
  const [runIndex, setRunIndex] = useState(0);
  const [runResult, setRunResult] = useState('');
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugInfo, setDebugInfo] = useState<number[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [memory, setMemory] = useState<number[]>(Array(30000).fill(0));
  const [memoryViewStart, setMemoryViewStart] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && currentIndex < debugInfo.length - 1) {
      const timer = setTimeout(() => {
        stepThroughCode();
      }, 0);
      return () => clearTimeout(timer);
    } else {
      setIsRunning(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isRunning]);

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

  const isDot = (code: string, position: number) => {
    if (code[position] === '.') {
      const newRunIndex = runIndex + 1;
      setInterpretedCode((prevCode) => prevCode + runResult[runIndex]);
      setRunIndex(newRunIndex);
    }
  };

  const stepThroughCode = () => {
    if (!isDebugging || currentIndex >= debugInfo.length - 1) {
      return;
    }
    const newIndex = currentIndex + 1;
    const newDebugInfo = debugInfo[newIndex];
    setDebuggerCode(highlightCode(code, newDebugInfo[0]));
    isDot(code, debugInfo[currentIndex][0]);
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
    const body: RequestBody = {
      code,
      input,
    };

    setIsDebugging(true);
    setRunIndex(0);
    setInterpretedCode('');
    setCurrentIndex(0);
    setMemory(Array(30000).fill(0));
    setMemoryViewStart(0);
    getInterpretedCode(body).then((data: Output) => {
      setRunResult(data.output);
    });
    getDebugInfo(body).then((data: DebugInfo) => {
      if (data.debugInfo.length === 1) {
        setIsDebugging(false);
      } else {
        setDebugInfo(data.debugInfo);
        setDebuggerCode(highlightCode(code, 0));
      }
    });
  };

  const handleRun = () => {
    setIsRunning(true);
  };

  const handleStopDebugging = () => {
    setInterpretedCode('');
    setCurrentIndex(-1);
    setMemory(Array(30000).fill(0));
    setMemoryViewStart(0);
    setIsDebugging(false);
    setIsRunning(false);
  };

  const getAsciiSymbol = (value: number) => {
    if (value >= 32 && value <= 126) {
      return String.fromCharCode(value);
    } else if (value in asciiNames) {
      return asciiNames[value];
    } else {
      return '';
    }
  };

  return (
    <div className="debugger">
      <h2>Debugger</h2>
      <div className="memory-size">
        <p id="memory-size">Memory size - 30000</p>
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
        <button className="control-button" id="run" onClick={handleRun}>
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
              <div className="ascii-symbol">{getAsciiSymbol(cell)}</div>
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
