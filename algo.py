import heapq
def find(src,n):
    dist = [float('inf') for i in range(n)]
    q = []
    heapq.heapify(q)
    dist[src] = 0
    for i in range(n):
        heapq.heappush(q,(dist[i],i))
    while q:
        d,node = heapq.heappop(q)
        # print(node,d)
        for i,w in adj[node]:
            if d+w<dist[i]:
                dist[i] = d+w
                heapq.heappush(q,(dist[i],i))
    return dist

adj = [
    [[1,1],[2,2]],
    [[0,1],[3,3],[6,4]],
    [[0,2],[5,1],[4,2]],
    [[1,3],[5,1]],
    [[3,2],[6,3]],
    [[3,1],[7,4],[2,1]],
    [[4,3],[1,4],[7,5]],
    [[5,4],[6,5]]
]
def findPath(i,e,tans,c,d,ans,visited):
    
    if i==e:
        
        if c==d:
            
            ans.append(tans[:])
        return
    # print('i== ',i)
    for j,w in adj[i]:
        if visited[j]==False and w+c<=d:
            visited[j] = True
            findPath(j,e,tans+[j],c+w,d,ans,visited)
            visited[j] = False

def printPath(s,e,n):
    dist = find(s,n)
    sortd = dist[e]
    print(dist)
    visited = [False for i in range(n)]
    visited[s] = True
    ans = []
    findPath(s,e,[],0,sortd,ans,visited)
    print(ans)
printPath(0,6,8)





