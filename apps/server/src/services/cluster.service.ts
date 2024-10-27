// import cluster from 'cluster';
// import os from 'os';
import { Injectable } from '@nestjs/common';

// const numCPUs = os.cpus().length;

@Injectable()
export class AppClusterService {
  static clusterize(callback: () => void): void {
    // if (process.env.ENV_TYPE === 'prod') {
    //     if (cluster.isPrimary) {
    //         console.log(`Master server started on ${process.pid}`);
    //         for (let i = 0; i < numCPUs; i++) {
    //             cluster.fork();
    //         }
    //         // eslint-ignore-next-line @typescript-eslint/ban-types
    //         cluster.on('exit', (worker, code, signal) => {
    //             console.log(
    //                 `Worker ${worker.process.pid} died. Restarting`,
    //             );
    //             cluster.fork();
    //         });
    //     } else {
    //         console.log(`Cluster server started on ${process.pid}`);
    //         callback();
    //     }
    // } else {
    callback();
    // }
  }
}
