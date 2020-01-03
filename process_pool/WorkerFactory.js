const child_process = require('child_process');

var count = 1;

class WorkerFactory {
    constructor(opts) {
        this.cb = opts.cb;
        this.worker = child_process.fork('./worker.js');
        this.pid = this.worker.pid;
        this.worker.on('message', (function(msg){
            if(msg.status === 'finish') {
               count++;
               this.cb(msg.pid);
            }
        }).bind(this))
        this.worker.on('error', function(e) {
            console.log('error', e)
        })

        this.waiting();
        
    }

    start() {
        this.worker.send({ status: 'start', count: count })
        
    }

    waiting() {
        this.worker.send({ status: 'waiting' });
    }

}

module.exports = WorkerFactory;