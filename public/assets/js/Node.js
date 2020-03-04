class Node {
    constructor(x, y, width, height, id) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.neighbours = [];
        this.colorr = color(255, 212, 68);
    }


    addNeighbour(newNeighbour) {
        this.neighbours.push(newNeighbour);
    }

    plotEdgesWithNeighbours() {
        push();
        for (let node of this.neighbours) {
            strokeWeight(5);
            stroke(90, 2, 15);
            line(this.x, this.y, node.x, node.y);
        }
        pop();
    }

    display() {
        this.displayNode();
        this.displayID();
    }
    displayNode() {
        push();
        fill(this.colorr);
        noStroke();
        ellipse(this.x, this.y, this.width, this.height);
        pop();
    }

    displayID() {
        push();
        textSize(32);
        textAlign(CENTER, CENTER);
        fill(0);
        text(this.id, this.x, this.y);
        pop();
    }
}