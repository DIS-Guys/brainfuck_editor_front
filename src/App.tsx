import { useState } from 'react';
import { Editor } from './components/Editor';
import { Debugger } from './components/Debugger';
import './App.css';

export function App() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  return (
    <div className="container">
      <h1 className="title">Brainfuck Editor</h1>
      <div className="tools">
        <Editor code={code} setCode={setCode} input={input} setInput={setInput} />
        <Debugger code={code} input={input} />
      </div>
    </div>
  );
}
