import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi,describe, beforeEach, it, expect } from 'vitest';
import { Debugger } from './Debugger';
import { getDebugInfo, getInterpretedCode } from '../../api/code';

vi.mock('../../api/code');

const mockGetInterpretedCode = getInterpretedCode as ReturnType<typeof vi.fn>
const mockGetDebugInfo = getDebugInfo as ReturnType<typeof vi.fn>

describe('Debugger Component', () => {
  const setInterpretedCode = vi.fn();
  const props = {
    code: '++[>++<-]>.',
    input: '',
    setInterpretedCode,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Debugger component', () => {
    render(<Debugger {...props} />);
    expect(screen.getByText('Debugger')).toBeInTheDocument();
    expect(screen.getByText('Memory size - 30000')).toBeInTheDocument();
  });

  it('start debugging on Start button click', async () => {
    mockGetInterpretedCode.mockResolvedValue({ output: 'A' });
    mockGetDebugInfo.mockResolvedValue({ debugInfo: [[0, 0, 2], [1, 0, 4]] });

    render(<Debugger {...props} />);
    fireEvent.click(screen.getByText('Start'));

    await waitFor(() => {
      expect(getInterpretedCode).toHaveBeenCalledWith({
        code: '++[>++<-]>.',
        input: '',
      });
      expect(getDebugInfo).toHaveBeenCalledWith({
        code: '++[>++<-]>.',
        input: '',
      });
    });

    expect(screen.getByText('Debugger')).toBeInTheDocument();
  });

  it('stop debugging on Stop button click', () => {
    render(<Debugger {...props} />);
    fireEvent.click(screen.getByText('Stop'));

    expect(setInterpretedCode).toHaveBeenCalledWith('');
  });

  it('run through code on Run button click', async () => {
    mockGetInterpretedCode.mockResolvedValue({ output: 'A' });
    mockGetDebugInfo.mockResolvedValue({ debugInfo: [[0, 0, 2], [1, 0, 4]] });

    render(<Debugger {...props} />);
    fireEvent.click(screen.getByText('Start'));

    await waitFor(() => {
      expect(screen.getByText('Debugger')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Run'));

    await waitFor(() => {
      expect(screen.getByText('Debugger')).toBeInTheDocument();
    });
  });

  it('step through code on Step button click', async () => {
    mockGetInterpretedCode.mockResolvedValue({ output: 'A' });
    mockGetDebugInfo.mockResolvedValue({ debugInfo: [[0, 0, 2], [1, 0, 4]] });

    render(<Debugger {...props} />);
    fireEvent.click(screen.getByText('Start'));

    await waitFor(() => {
      expect(screen.getByText('Debugger')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Step'));

    await waitFor(() => {
      expect(screen.getByText('Debugger')).toBeInTheDocument();
    });
  });
});
