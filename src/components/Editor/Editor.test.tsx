import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { Editor } from './Editor';

describe('Editor Component', () => {
  const mockSetCode = vi.fn();
  const mockSetInput = vi.fn();
  const mockSetInterpretedCode = vi.fn();

  const defaultProps = {
    code: '',
    setCode: mockSetCode,
    input: '',
    setInput: mockSetInput,
    interpretedCode: '',
    setInterpretedCode: mockSetInterpretedCode,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<Editor {...defaultProps} />);
    expect(screen.getByPlaceholderText('Write your code here...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Input a value...')).toBeInTheDocument();
    expect(screen.getByText('Result will be here...')).toBeInTheDocument();
  });

  it('should change code input and update line numbers', () => {
    render(<Editor {...defaultProps} />);
    const codeInput = screen.getByPlaceholderText('Write your code here...') as HTMLTextAreaElement;
    fireEvent.change(codeInput, { target: { value: '++++[-]\n' } });
    expect(mockSetCode).toHaveBeenCalledWith('++++[-]\n');
    expect(screen.getAllByText(/\d+/).length).toBe(2);
  });

  it('should change input field', () => {
    render(<Editor {...defaultProps} />);
    const inputField = screen.getByPlaceholderText('Input a value...') as HTMLTextAreaElement;
    fireEvent.change(inputField, { target: { value: 'test input' } });
    expect(mockSetInput).toHaveBeenCalledWith('test input');
  });

  it('should not update input field if length exceeds 329 characters', () => {
    render(<Editor {...defaultProps} />);
    const inputField = screen.getByPlaceholderText('Input a value...') as HTMLTextAreaElement;
    fireEvent.change(inputField, { target: { value: 'a'.repeat(330) } });
    expect(mockSetInput).not.toHaveBeenCalled();
  });

  it('should clear editor on clear button click', () => {
    render(<Editor {...defaultProps} />);
    const clearButton = screen.getByTestId('clear-editor-button');
    const codeInput = screen.getByTestId('code-input')
    fireEvent.click(clearButton);
    expect(mockSetCode).toHaveBeenCalledWith('');
    expect(mockSetCode).toHaveBeenCalledTimes(1);
    expect(codeInput).toHaveTextContent('');
  });

  it('should clear input on clear button click', () => {
    render(<Editor {...defaultProps} />);
    const clearButton = screen.getByTestId('clear-input-button');
    fireEvent.click(clearButton);
    const input = screen.getByTestId('input');
    expect(input).toHaveTextContent('');
  });

  it('should clear output on clear button click', () => {
    render(<Editor {...defaultProps} />);
    const clearButton = screen.getByTestId('clear-output-button');
    const output = screen.getByTestId('output');
    fireEvent.click(clearButton);
    expect(output).toHaveTextContent('Result will be here...');
  });

  it('should handle scroll synchronization', () => {
    render(<Editor {...defaultProps} />);
    const codeInput = screen.getByPlaceholderText('Write your code here...');
    const lineNumbers = screen.getByText('1').parentElement as HTMLDivElement;
    fireEvent.scroll(codeInput, { target: { scrollTop: 100 } });
    expect(lineNumbers.scrollTop).toBe(100);
  });
});
