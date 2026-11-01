import { windHost, type WindRequest } from './host.ts';

// Runs the living wind off the main thread (#36): a worker the game (or the demo, standing in for it) talks to through
// WindWorker (client.ts). What it does with each message is in host.ts.

export type { WindRequest, WindReply } from './host.ts';

const handle = windHost((reply, transfer) => self.postMessage(reply, { transfer }));
self.onmessage = (e: MessageEvent<WindRequest>) => handle(e.data);
