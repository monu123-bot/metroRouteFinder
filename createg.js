const fs = require('fs');
fs.readFile('./station.json','utf-8',(err,arr)=>{
    const station = JSON.parse(arr)
    // console.log(graph)
    let myobj = {}
    Object.keys(station).forEach(function(key) {
      let ele = station[key]
   if(key>80){
      myobj[key-1] = ele
   }
   else{
    myobj[key] = ele
   }
     
    });
    const myJSON = JSON.stringify(myobj);

fs.writeFile('stationn.json', myJSON, 'utf8', function(err) {
  if (err) throw err;
  console.log('JSON file has been saved!');
});
    // console.log(myobj)
    
    // const stations = require("./stationc")
  })