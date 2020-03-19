class RGraph {


    constructor() {
        this.nodeList = [];
        this.isDestfound = false;
    }



    async dfs(startId, endId, dfsPath) {
        // console.log("Start id:" + startId + "   Dest node:" + endId + "  Dfs path:" + dfsPath);
        let tempnode;
        let actualPath = [];
        for (let node of this.nodeList) {
            if (node.id === startId) {
                tempnode = node;
                break;
            }
        }
        let visited = [];
        await this.dfsUtil(tempnode, visited, startId, endId, dfsPath);

        //finding the final path
        for (let i = dfsPath.length - 1; i >= 0; i--) {
            actualPath.push(dfsPath[i]);
            if (dfsPath[i] === endId) {
                break;
            }
        }

        await this.sleep(1000);//sleeping for to let trails animation complete
        this.isDestfound = false; //resetting isdestfound

        return actualPath;
    }



    async dfsUtil(node, visited, startId, endId, dfsPath) {
        //newly discovered nodes are found here
        // print(dfsPath);
        dfsPath.push(node.id);
        visited[node.id] = true;
        await this.sleep(500); //wait for some time for animation to complete
        
        //if destination node is found, return
        if (node.id === endId) {
            this.isDestfound = true;
            return;
        }
        
        //Traverse and push the neighbours of the current node onto the stack in recursion
        for (let n of node.neighbours) {
            if (!visited[n.id]) {
                if (n.id !== startId && n.id != endId) {
                    n.colorr = color(75, 123, 236); //If node is not start or destination node, color it as discovered node
                }
                await this.dfsUtil(n, visited, startId, endId, dfsPath);
            }
            
            await this.sleep(200); // wait for animation to complete

            //if destination is found, stop traversing any further neighbours and start emptying the stack
            if (this.isDestfound) {
                break;
            }

            //prevent adding duplicate path nodes to the path that were just previosly added
            if (dfsPath[dfsPath.length - 1] != node.id) {
                dfsPath.push(node.id);
            }
        }

        // Done nodes are found here

        //prevent adding duplicate path nodes to the path that were just previosly added
        if (dfsPath[dfsPath.length - 1] != node.id) {
            dfsPath.push(node.id);
        }

        await this.sleep(200);
        if (node.id != startId) {
            node.colorr = color(132,108,91); //While going back to start after finding the destination, If current node is not start node, color it as discovered node
        }
    }



    display() {
        this.displayEdges();
        this.displayVertices();
    }



    displayVertices() {
        for (let node of this.nodeList) {
            node.display();
        }
    }



    displayEdges() {
        for (let node of this.nodeList) {
            node.plotEdgesWithNeighbours();
        }
    }



    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


}