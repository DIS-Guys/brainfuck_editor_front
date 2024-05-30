import { RequestBody } from '../types/RequestBody';

const BASE_URL = 'http://localhost:8080/brainfuck';

export function sendRequest(endpoint: string, data: RequestBody) {
  return fetch(BASE_URL + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return response.json();
  });
}
