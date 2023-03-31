const fs = require('fs')
fs.readFile('./graphc.json','utf-8',(err,arr)=>{
    const graph = JSON.parse(arr)
    fs.readFile('./station.json','utf-8',(err,arr)=>{
        const station = JSON.parse(arr)
        console.log(graph)
    
    
    })


})