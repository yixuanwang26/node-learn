const os = require('os');
const process = require('process');
const WorkerFactory = require('./WorkerFactory');
var pool = []; // 线程池
var target = 50;
var working = new Map(); // 工作中
const cpus = os.cpus().length; // cpu 总数

function returnWorker(pid) {
   // 归还执行完任务的 worker
   if(working.has(pid) && working.get(pid)){
       const reWork = working.get(pid);
       pool.push(reWork);
       working.set(pid, null);
       target--;
       console.log('还有'+ target + '个文件待建。。。');
   }
}

// 创建cpu.length个在等待中的进程
for(var i = 0; i < cpus; i++) {
    const worker = new WorkerFactory({ cb: returnWorker });
    pool.push(worker);
}

var timer = setInterval(function() {
    if(target < 1) {
        clearInterval(timer);
        process.exit()
    }else if(pool.length > 0) {
        // 从进程池分配进程
        const currentWork = pool.shift();
        working.set(currentWork.pid, currentWork);
        currentWork.start();
    }
}, 100)


