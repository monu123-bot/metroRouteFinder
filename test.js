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
function find(src, n, adj) {
    console.log('find')
    let dist = new Array(n).fill(Infinity);
    let q = new PriorityQueue();
    dist[src] = 0;
    for (let i = 0; i < n; i++) {
        q.enqueue(i, dist[i]);
    }
    // console.log(q,q.items.length)
    while (q.items.length > 0) {
        // console.log('while')
        let e = q.dequeue();
        let node = e.element
        let d = e.priority
        //   console.log(node,d)

        for (let [i, w] of adj[node]) {
            if (d + w < dist[i]) {
                dist[i] = d + w;
                q.enqueue(i, dist[i]);
            }
        }
    }
    return dist;
}
function findPath(i, e, tans, c, d, ans, visited, adj) {

    if (i == e) {

        if (c == d) {

            ans.push(tans)
        }
        return
    }
    // console.log('i==',i)
    for (let l = 0; l < adj[i].length; l++) {
        // console.log(l)
        let j = adj[i][l][0]
        let w = adj[i][l][1]

        if (visited[j] == false && w + c <= d) {
            visited[j] = true
            findPath(j, e, [...tans, j], c + w, d, ans, visited, adj)
            visited[j] = false
        }
    }

}
function printPath(s, e, n, adj) {
    console.log('printPath')
    let dist = find(s, n, adj)
    // console.log(dist)
    let sortd = dist[e]
    let visited = new Array(n)
    for (i = 0; i < n; i++) {
        visited[i] = false
    }

    visited[s] = true
    // console.log(visited)
    let ans = new Array()

    findPath(s, e, [s], 0, sortd, ans, visited, adj)

    return [ans, sortd]
}
// let pq = new PriorityQueue()
// adj = [
//     [[1,1],[2,2]],
//     [[0,1],[3,3],[6,4]],
//     [[0,2],[5,1],[4,2]],
//     [[1,3],[5,1]],
//     [[3,2],[6,3]],
//     [[3,1],[7,4],[2,1]],
//     [[4,3],[1,4],[7,5]],
//     [[5,4],[6,5]]
// ]
function final(parcel) {
    // console.log(parcel)
    let path = parcel[0][0]
    console.log(parcel[1])
    if (Math.abs(path[0] - path[1]) != 1) {
        path.shift()
    }
    if (Math.abs(path[path.length - 1] - path[path.length - 2]) != 1) {
        path.pop()
    }
    // console.log(path)
    let dist = parcel[1]
    fs.readFile('./stationn.json', 'utf-8', (err, arr) => {
        const station = JSON.parse(arr)
        // for (let i = 0; i < path.length; i++) {
        //     console.log(path[i])
        //     console.log(station[path[i]].name, station[path[i]].dist)

        // }
        let tarr = new Array()
        tarr.push([path[0],0,station[path[0]].name])
        let newPath = new Array()
        let lastColor = station[path[0]].line[0]
        let cdist = 0
        // console.log("path :",path)
        if (station[path[1]].dist-station[path[0]].dist>0){
            let color = station[path[1]].line[0]
            newPath.push([station[path[1]][color]['up']])
        }
        else{
            let color = station[path[1]].line[0]
            newPath.push([station[path[1]][color]['down']])
        }
        for (let i = 1; i < path.length; i++) {
            // console.log("doing ",i,path[i])
            if (lastColor != station[path[i]].line[0]) {
                newPath.push(tarr)
                tarr = [[path[i], cdist,station[path[i]].name]]
                lastColor = station[path[i]].line[0]
                if (station[path[i+1]].dist-station[path[i]].dist>0){
                    let color = station[path[i]].line[0]
                    newPath.push([station[path[i]][color]['up']])
                }
                else{
                    let color = station[path[i]].line[0]
                    newPath.push([station[path[i]][color]['down']])
                }
            }
            else {
                cdist += Math.abs(station[path[i]].dist - station[path[i - 1]].dist)
                tarr.push([path[i], cdist,station[path[i]].name])
                lastColor = station[path[i]].line[0]

            }
            // console.log(tarr)
        }
        newPath.push(tarr)
        console.log(newPath)
    })
}
fs.readFile('./graphc.json', 'utf-8', (err, arr) => {
    const graph = JSON.parse(arr)
    // console.log(graph)
    const adj = new Array()
    for (key in graph) {
        adj.push(graph[key])
    }
    // console.log(adj)
    let parcel = printPath(8, 42, adj.length, adj)
    return final(parcel)
    // let ans = parcel[0]
    // let dist = parcel[1]
    // var a = 0
    // for (let i=0;i<ans[0].length;i++){

    //     console.log(station[ans[0][i]].name,station[ans[0][i]].dist)
    // }
    // console.log(dist)
})
