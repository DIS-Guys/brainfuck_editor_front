import { RequestBody } from '../types/RequestBody';
import { sendRequest } from '../utils/sendRequest';

export const getInterpretedCode = (data: RequestBody) => {
  return sendRequest('/interpret', data);
};

export const getDebugInfo = (data: RequestBody) => {
  return sendRequest('/debug', data);
};
