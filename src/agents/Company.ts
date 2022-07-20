 // eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./Worker";

class Company {
    workers: Worker[];
    constructor() {
        this.workers = new Array(navigator.hardwareConcurrency || 4).fill(null)
        .map(()=> new Worker());
    }

    terminate() {
        for (const worker of this.workers) {
            worker.terminate();
        }
        this.workers = new Array(navigator.hardwareConcurrency || 4).fill(null)
        .map(()=> new Worker());
    }
}


export default new Company();
