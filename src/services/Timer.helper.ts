export class DebounceTimer {
  private debounceTimer;
  exec(callback, time: number) {
    window.clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(callback, time);
  }
}
