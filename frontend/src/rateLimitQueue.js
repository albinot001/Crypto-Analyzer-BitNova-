export class RateLimitQueue {
  constructor(delay) {
    this.queue = [];
    this.delay = delay;
    this.timer = null;
  }

  add(requestFn) {
    this.queue.push(requestFn);
    this.processQueue();
  }

  processQueue() {
    if (!this.timer && this.queue.length) {
      const requestFn = this.queue.shift();
      requestFn();
      this.timer = setTimeout(() => {
        this.timer = null;
        this.processQueue();
      }, this.delay);
    }
  }
}
