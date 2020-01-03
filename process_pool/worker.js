const process = require('process');
const fs = require('fs');

process.on('message', function(msg){
    if(msg.status === 'start') {
        // 做写文件操作
         fs.writeFile('./fileDir/文件'+ msg.count +'.txt', new Date(), (err) => {
             if (err) throw err;
             process.send({ status: 'finish', pid: process.pid });
         });
    }
})



