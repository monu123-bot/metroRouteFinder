const express = require("express");

// const con = require("./config");
const app = express();
// const fs = require('fs');
app.set("view engine", "ejs");
var session = require("express-session");

const cookieParser = require("cookie-parser");

const port = process.env.PORT || 8000;


app.use(
  session({
      secret: "secreatkey",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 3000000 },
  })
  )
sessioncheck = (req, res, next) => {
    if (!req.session.user) {
      res.render("login");
    } else {
      next();
    }
  };
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




const fs = require('fs')
// User defined class
// to store element and its priority
class QElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}

// PriorityQueue class
class PriorityQueue {

    // An array is used to implement priority
    constructor() {
        this.items = [];
    }

    // functions to be implemented
    // enqueue(item, priority)
    // enqueue function to add element
    // to the queue as per priority
    enqueue(element, priority) {
        // creating object from queue element
        var qElement = new QElement(element, priority);
        var contain = false;

        // iterating through the entire
        // item array to add element at the
        // correct location of the Queue
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                // Once the correct location is found it is
                // enqueued
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }

        // if the element have the highest priority
        // it is added at the end of the queue
        if (!contain) {
            this.items.push(qElement);
        }
    }


    // dequeue()
    // dequeue method to remove
    // element from the queue
    dequeue() {
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    // front()
    // isEmpty()
    // isEmpty function
    isEmpty() {
        // return true if the queue is empty.
        return this.items.length == 0;
    }

    // printPQueue()
}

// function to find sortest distance of all nodes from source node
function find(src, n, adj) {
   
    let dist = new Array(n).fill(Infinity);
    let q = new PriorityQueue();
    dist[src] = 0;
    for (let i = 0; i < n; i++) {
        q.enqueue(i, dist[i]);
    }
   
    while (q.items.length > 0) {
      
        let e = q.dequeue();
        let node = e.element
        let d = e.priority
       

        for (let [i, w] of adj[node]) {
            if (d + w < dist[i]) {
                dist[i] = d + w;
                q.enqueue(i, dist[i]);
            }
        }
    }
    return dist;
}
// function to find path with given distance between source and dest.
function findPath(i, e, tans, c, d, ans, visited, adj) {

    if (i == e) {

        if (c == d) {

            ans.push(tans)
        }
        return
    }
 
    for (let l = 0; l < adj[i].length; l++) {
      
        let j = adj[i][l][0]
        let w = adj[i][l][1]

        if (visited[j] == false && w + c <= d) {
            visited[j] = true
            findPath(j, e, [...tans, j], c + w, d, ans, visited, adj)
            visited[j] = false
        }
    }

}
// function to print the path
function printPath(s, e, n, adj) {
    
    let dist = find(s, n, adj)
   
    let sortd = dist[e]
    let visited = new Array(n)
    for (i = 0; i < n; i++) {
        visited[i] = false
    }

    visited[s] = true
    
    let ans = new Array()
   
    findPath(s, e, [s], 0, sortd, ans, visited, adj)

    return [ans, sortd]
}
// function which creates a packet, which os ready to go to front end

function  final(parcel,newPath,station) {
    let path = parcel[0][0]
  
    if (Math.abs(path[0] - path[1]) != 1) {
        path.shift()
    }
    if (Math.abs(path[path.length - 1] - path[path.length - 2]) != 1) {
        path.pop()
    }
    let dist = parcel[1]
    
        let tarr = new Array()
        tarr.push([parseInt(path[0]),0,station[path[0]].name,station[path[0]].line[0]])
        let lastColor = station[path[0]].line[0]
        let cdist = 0
        if (station[path[1]].dist-station[path[0]].dist>0){
            let color = station[path[1]].line[0]
            newPath.push([-1,station[path[1]][color]['up']])
        }
        else{
            let color = station[path[1]].line[0]
            newPath.push([-1,station[path[1]][color]['down']])
        }
        for (let i = 1; i < path.length; i++) {
            if (lastColor != station[path[i]].line[0]) {
               
                    newPath.push(tarr)
                
                
                tarr = [[path[i], cdist.toFixed(2),station[path[i]].name,station[path[i]].line[0]]]
                lastColor = station[path[i]].line[0]
                if (station[path[i+1]].dist-station[path[i]].dist>0){
                    let color = station[path[i]].line[0]
                    newPath.push([-1,station[path[i]][color]['up']])
                }
                else{
                    let color = station[path[i]].line[0]
                    newPath.push([-1,station[path[i]][color]['down']])
                }
            
            }
            else {
                cdist += Math.abs(station[path[i]].dist - station[path[i - 1]].dist)
                tarr.push([path[i], cdist.toFixed(2),station[path[i]].name,station[path[i]].line[0]])
                lastColor = station[path[i]].line[0]
            }
        }
        newPath.push(tarr)
        newPath.push(dist)
        return newPath
}

// get api for route 
app.get('/findroute',(req,res)=>{
    let newPath = new Array()
  var from = req.query.from
  var to = req.query.to

  let fromNum
  let toNum
  
 fs.readFile('./graphc.json', 'utf-8', (err, arr) => {
    const graph = JSON.parse(arr)
   
    const adj = new Array()
    let search_List = new Array()
    fs.readFile('./stationn.json','utf-8',(err,stations)=>{
        const station = JSON.parse(stations) 
        
    for(key in station){
      search_List.push([station[key].name])
    }
    search_List.sort()
        for (key in graph) {
           
            if (station[key].name===from){
                
               fromNum = key
           
            }
            if (station[key].name===to){
                toNum = key
               
             }
            adj.push(graph[key])
            
        }
        
        let parcel = printPath(fromNum, toNum, adj.length, adj)
       
        final(parcel,newPath,station)
        let d = newPath.pop().toFixed(2)
        let t = d*2.4
        t = t.toFixed(2)
        let f = 0
        let cf = [0,0]
        
         if(d <= 2 )
         {
            f = 10
            cf = [8,9]
          }
           else if (d <= 5)
           {
            f = 20
            cf = [16,18]
           }
           
          else if(d <=12)
          { 
          f = 30
          cf = [24,27]
          }
       
          else if(d <= 21)
         {  
         f = 40
         cf = [32,36]
         }
        
          else if(d <= 32 )
          { 
            f = 50
            cf = [40,45]
            }
       
          else
          { 
          f = 60
          cf = [48,54]
          }
        let gateInfo = [station[toNum].gate,station[fromNum].gate]
        let scolor = newPath[1][0][3]
        let ecolor = station[toNum].line[0]
        // console.log(scolor,ecolor,newPath)
        res.render('home',{newPath,search_List,to,from,d,t,f,cf,gateInfo,scolor,ecolor})
      })
      

})
  })
  app.get('/lines',(req,res)=>{
    let color = req.query.color
    fs.readFile('./stationn.json','utf-8',(err,stations)=>{
      const station = JSON.parse(stations) 
    res.render('lines',{color,station})
    })
  })

app.get('/',(req,res)=>{
  
  
  fs.readFile('./stationn.json','utf-8',(err,arr)=>{
    const station1 = JSON.parse(arr)
    let search_List = new Array()
    for(key in station1){
      search_List.push([station1[key].name])
    }
    
    search_List.sort()
    let newPath = []
    let to = 0
    let from = 0
    let d = 0
    let t = 0
    let f = 0
    let cf = [0,0]
    let gateInfo = [{},{}]
    let scolor = ''
    let ecolor =''
  res.render('home',{newPath,search_List,to,from,d,t,f,cf,gateInfo,scolor,ecolor})
  })

})


app.listen(port, () => {
    console.log(`app is running on port : ${port}`);
});