/**
 * Executes an asynchronous function and retries on failure with exponential backoff.
 * 
 * @param fn The function to execute.
 * @param retries Maximum number of attempts.
 * @param delay Initial delay in milliseconds.
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000
): Promise<T> {
    let lastError: any;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (i < retries - 1) {
                const backoffDelay = delay * Math.pow(2, i);
                await new Promise((resolve) => setTimeout(resolve, backoffDelay));
            }
        }
    }
    throw lastError;
}

/**
 * Runs a list of tasks (functions returning promises) with a limit on concurrent executions.
 * 
 * @param tasks An array of functions returning promises to execute.
 * @param concurrencyLimit The maximum number of concurrent tasks running.
 */
export async function runWithConcurrency<T>(
    tasks: (() => Promise<T>)[],
    concurrencyLimit = 2
): Promise<T[]> {
    const results: T[] = [];
    let activeCount = 0;
    let nextIndex = 0;

    return new Promise<T[]>((resolve, reject) => {
        const runNext = async () => {
            if (nextIndex >= tasks.length && activeCount === 0) {
                resolve(results);
                return;
            }

            while (activeCount < concurrencyLimit && nextIndex < tasks.length) {
                const currentIndex = nextIndex++;
                activeCount++;

                (async () => {
                    try {
                        results[currentIndex] = await tasks[currentIndex]();
                    } catch (error) {
                        reject(error);
                        return;
                    } finally {
                        activeCount--;
                        runNext();
                    }
                })();
            }
        };

        if (tasks.length === 0) {
            resolve([]);
        } else {
            runNext();
        }
    });
}
