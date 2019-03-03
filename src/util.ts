export function getKeyPress(): Promise<number> {
  return new Promise(resolve => {
    const handler = (event: KeyboardEvent) => {
      window.removeEventListener('keydown', handler);
      resolve(event.keyCode);
    };
    window.addEventListener('keydown', handler);
  });
}
