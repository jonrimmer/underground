export interface Actor {
  act(): Promise<void> | void;
  draw(): void;
}
