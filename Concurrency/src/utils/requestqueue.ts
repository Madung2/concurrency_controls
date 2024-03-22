export class RequestQueue {
    private queue: Array<() => Promise<any>> = [];
    private processing = false;

    async enqueue<T>(task: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.queue.push(() => task().then(resolve).catch(reject));
            if (!this.processing) {
                this.processing = true;
                this.processNext();
            }
        });
    }

    private async processNext() {
        if (this.queue.length === 0) {
            this.processing = false;
            return;
        }
        // queue에서 태스크를 꺼내 실행
        const task = this.queue.shift();
        await task(); 
        this.processNext();
    }
}