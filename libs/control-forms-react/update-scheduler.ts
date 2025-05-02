type TimeoutId = ReturnType<typeof setTimeout>;

export class UpdateScheduler {

  private timeoutId: TimeoutId | null = null;

  public scheduleUpdate(callback: () => void) {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(callback, 0);
  }

}
