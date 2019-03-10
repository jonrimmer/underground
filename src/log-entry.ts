export class LogEntry {
  date: Date = new Date();
  constructor(
    public text: string,
    public type: 'info' | 'danger' | 'success' = 'info'
  ) {}
}
