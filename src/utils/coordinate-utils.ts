
interface Point {
  x: string | number;
  y: string | number;
}

export function isPoint(obj: unknown): obj is Point {
  return obj !== null && 
         typeof obj === 'object' && 
         'x' in obj && 
         'y' in obj;
}

export function safeParseCoordinate(obj: unknown): [number, number] | undefined {
  if (!obj) return undefined;
  
  if (isPoint(obj)) {
    const x = typeof obj.x === 'string' ? parseFloat(obj.x) : (typeof obj.x === 'number' ? obj.x : 0);
    const y = typeof obj.y === 'string' ? parseFloat(obj.y) : (typeof obj.y === 'number' ? obj.y : 0);
    return [x, y];
  }
  
  return undefined;
}
