import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';
import { Editor } from './components/Editor';
import { Debugger } from './components/Debugger';

vi.mock('./components/Editor', () => ({
  Editor: vi.fn(() => <div>Editor Component</div>),
}));

vi.mock('./components/Debugger', () => ({
  Debugger: vi.fn(() => <div>Debugger Component</div>),
}));

describe('App', () => {
  it('renders the title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Brainfuck Editor/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the Editor and Debugger components', () => {
    render(<App />);
    const editorElement = screen.getByText(/Editor Component/i);
    const debuggerElement = screen.getByText(/Debugger Component/i);
    expect(editorElement).toBeInTheDocument();
    expect(debuggerElement).toBeInTheDocument();
  });

  it('passes the correct props to Editor component', () => {
    render(<App />);
    const mockSetCode = vi.fn();
    const mockSetInput = vi.fn();
    const mockSetInterpretedCode = vi.fn();

    render(
      <Editor
        code=""
        setCode={mockSetCode}
        input=""
        setInput={mockSetInput}
        setInterpretedCode={mockSetInterpretedCode}
        interpretedCode=""
      />
    );

    expect(Editor).toHaveBeenCalledWith(
      expect.objectContaining({
        code: '',
        setCode: expect.any(Function),
        input: '',
        setInput: expect.any(Function),
        setInterpretedCode: expect.any(Function),
        interpretedCode: '',
      }),
      {}
    );
  });

  it('passes the correct props to Debugger component', () => {
    render(<App />);
    const mockSetInterpretedCode = vi.fn();

    render(
      <Debugger code="" input="" setInterpretedCode={mockSetInterpretedCode} />
    );

    expect(Debugger).toHaveBeenCalledWith(
      expect.objectContaining({
        code: '',
        input: '',
        setInterpretedCode: expect.any(Function),
      }),
      {}
    );
  });
});
