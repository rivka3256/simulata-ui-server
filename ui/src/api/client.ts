const BASE_URL = 'http://localhost:3000/api';
const WS_BASE_URL = 'ws://localhost:3000/api/ws';


export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // console.log(`[API] Fetching: ${endpoint} with options:`, options);
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  // console.log(`[API] Received response for: ${endpoint} with status: ${response.status}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    console.log(`[API] Error response for: ${endpoint} -`, error);
    throw new Error(error.message || 'API request failed');
  }

  // לטיפול במקרה של 204 No Content (כמו במחיקה)
  if (response.status === 204) return {} as T;
  // console.log(`response ${response.status} ${response.statusText}`);
  return response.json();
}

export function connectRunWs(
  runId: string,
  onMessage: (data: any) => void,
  onComplete: (data: any) => void,
  _unused?: any,
  onInit?: (data: any) => void
) {
  // יצירת החיבור לשרת עבור הרצה ספציפית
  const ws = new WebSocket(`${WS_BASE_URL}/run/${runId}`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // ניתוב ההודעה לפונקציה המתאימה ב-RunView
    if (data.type === 'init' && onInit) {
      onInit(data);
    } else if (data.type === 'complete' || data.status === 'completed') {
      onComplete(data);
    } else {
      onMessage(data);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  return ws;
}