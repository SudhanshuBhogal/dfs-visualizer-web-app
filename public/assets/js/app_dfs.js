//Graph global vars
var Graph;
var newNode;
var dfsPath = [];
var finalPath = [];
var pathFound = false;
var startNodeId = 2;
var destNodeId = 14;
const NODE_COORDS = [ //all nodes coords for 1280 * 720 screen resolution
    [174, 54],
    [142, 146],
    [111, 243],
    [120, 386],
    [255, 447],
    [248, 551],
    [240, 657],
    [402, 654],
    [403, 336],
    [408, 199],
    [657, 240],
    [616, 441],
    [636, 634],
    [809, 512],
    [1004, 383],
    [1091, 201],
    [1016, 75],
    [865, 66],
    [1134, 522],
    [1184, 651]
];
const FIXED_NEIGHBOURS = [ //Neighbours array
    [1, 9],
    [0, 2],
    [1, 3, 9],
    [2, 4],
    [3, 5],
    [4, 6],
    [5, 7],
    [6, 8, 11],
    [7, 9, 11],
    [0, 2, 8, 10],
    [9, 13],
    [7, 8, 13],
    [13],
    [10, 11, 12, 14],
    [13, 15, 18],
    [14, 16],
    [15, 17],
    [16],
    [14, 19],
    [18]
];


//animation global vars
var nodeIndex = 1;
let beginX;
let beginY;
let endX;
let endY;
let distX;
let distY;
let exponent = 1;
let newX;
let newY;
let step = 0.01;
let pct = 0;

//for changing the color of the finalpath
let redAmt = 0;
let greenAmt = 200;
let colorSteps;

// Generating src and destination options in the dropdown
var srcNodeOptionsDiv = document.getElementById("src-node-options");
var destNodeOptionsDiv = document.getElementById("dest-node-options");
for (let i = 0; i < 20; i++) {
    let srcnodeopt = document.createElement("a");
    srcnodeopt.setAttribute("class", "dropdown-item");
    srcnodeopt.text = i;
    srcnodeopt.href = "#";
    srcNodeOptionsDiv.appendChild(srcnodeopt);
    let destnodeopt = document.createElement("a");
    destnodeopt.setAttribute("class", "dropdown-item");
    destnodeopt.text = i;
    destnodeopt.href = "#";
    destNodeOptionsDiv.appendChild(destnodeopt);
}

//For changing the node selection in the input text box
$(".node-selection-src .dropdown-menu a").click(function () {
    var selNode = $(this).text();
    $(".node-input-src").attr("value", selNode);
    startNodeId = parseInt(selNode);
    resetGraph();

});
$(".node-selection-dest .dropdown-menu a").click(function () {
    var selNode = $(this).text();
    $(".node-input-dest").attr("value", selNode);
    destNodeId = parseInt(selNode);
    resetGraph();
});

//fetching dropdown buttons to be able to disable them while ongoing simulation
var srcDropdownBtn = document.getElementById("dropdown-btn-src");
var destDropdownBtn = document.getElementById("dropdown-btn-dest");

//Attaching event listener to run button
var runButton = document.getElementById('run-button');
runButton.addEventListener('click', runDFS);


function preload() {
    //making graph
    Graph = new RGraph();
    for (coord of NODE_COORDS) {
        Graph.nodeList.push(new Node(coord[0], coord[1], 50, 50, Graph.nodeList.length));
    }
    for (let i = 0; i < Graph.nodeList.length; i++) {
        for (let j = 0; j < FIXED_NEIGHBOURS[i].length; j++) {
            Graph.nodeList[i].addNeighbour(Graph.nodeList[FIXED_NEIGHBOURS[i][j]]);
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0, 15, 30);
    displayLabels();
    Graph.display();
    noLoop();
}

function draw() {
    displayLabels();
    Graph.display();
    //if finalpath is empty, continue traversing for dfsPath. Else, traverse path finalPath
    if (finalPath.length <= 0) {
        visuallyTraverse(dfsPath, color(255), 25, true);
    }
    else {
        visuallyTraverse(finalPath, color(redAmt,greenAmt,175,20), 30, false);
    }
}


function visuallyTraverse(path, ballColor, ballSize, showTrails) {
    if (path.length >= 2) { // this bcz length of the dfsPath array should be atleast 2 to be able to visualize the path
        beginX = Graph.nodeList[path[nodeIndex - 1]].x;
        beginY = Graph.nodeList[path[nodeIndex - 1]].y;
        endX = Graph.nodeList[path[nodeIndex]].x;
        endY = Graph.nodeList[path[nodeIndex]].y;
        distX = endX - beginX;
        distY = endY - beginY;

        if (pathFound && path[nodeIndex] !== destNodeId) {
            Graph.nodeList[path[nodeIndex]].colorr = color(redAmt, greenAmt, 175); //color the nodes in the final path
        }
        if (showTrails) {
            fill(0, 3);
            rect(0, 0, width, height);
        }
        pct += step;
        if (pct <= 1.0) { //if in between two nodes
            for(let p=0;p<5;p++){ //this loop helps smoothens the movement of the ball
                newX = beginX + pct * distX;
                newY = beginY + pow(pct, exponent) * distY;
                noStroke();
                fill(ballColor);
                ellipse(newX, newY, ballSize, ballSize);
                pct+=step;
            }
        } else { //else check if more nodes are available to traverse then reset pct to 0 and increment nodeIndex to go to next node
            if (nodeIndex < path.length - 1) {
                if(pathFound){
                    redAmt+=colorSteps;
                    greenAmt-=colorSteps;
                }
                nodeIndex++;
                pct = 0.0;
            } else {
                if (pathFound) { //Otherwise if pathfound then stop the draw function and re-enable the run and dropdown buttons
                    noLoop();
                    runButton.classList.add("btn-outline-warning");
                    runButton.classList.remove("disabled");
                    runButton.classList.remove("btn-outline-secondary");
                    srcDropdownBtn.classList.remove("disabled");
                    destDropdownBtn.classList.remove("disabled");
                }
            }
        }
    }
}


async function runDFS() {
    // alert("I'm working");
    resetGraph();
    Graph.nodeList[startNodeId].colorr = color(20, 200, 20);
    Graph.nodeList[destNodeId].colorr = color(200, 0, 0);
    //disabling the run button and dropdown buttons while simulation
    runButton.classList.remove("btn-outline-warning");
    runButton.classList.add("btn-outline-secondary");
    runButton.classList.add("disabled");
    srcDropdownBtn.classList.add("disabled");
    destDropdownBtn.classList.add("disabled");
    loop();
    // debugger;
    finalPath = await Graph.dfs(startNodeId, destNodeId, dfsPath);
    pathFound = true;
    print("Finalpaht length::"+finalPath.length);
    colorSteps = 255/(finalPath.length-2);
    print("ColorSteps: "+colorSteps);
    print("DFS Path := " + dfsPath);
    print("Final Path in setup()" + finalPath);
    nodeIndex = 1;
    pct = 0.0;
}

function resetGraph() {
    clear();
    background(0, 15, 30);
    //resetting variables
    dfsPath = [];
    finalPath = [];
    pathFound = false;
    pct = 0.0;
    redAmt=0;
    greenAmt=255;
    colorSteps = 0;
    nodeIndex = 1;
    //resets colors of all nodes
    for (let node of Graph.nodeList) {  
        if (node.id == startNodeId) {
            Graph.nodeList[startNodeId].colorr = color(20, 200, 20);
        } else if (node.id == destNodeId) {
            Graph.nodeList[destNodeId].colorr = color(200, 0, 0);
        } else {
            node.colorr = color(255, 212, 68);
        }
    }
    Graph.display(); //display the graph again
    displayLabels();
}

function displayLabels() {
    push();
    //for source
    stroke(255);
    strokeWeight(5);
    line(1210, 30, 1210, 270);
    noStroke();
    fill(20, 200, 20);
    ellipse(1250, 50, 40, 40);
    textSize(24);
    textAlign(LEFT, CENTER);
    fill(255);
    text("Source", 1275, 50);

    //for dest
    fill(200, 0, 0);
    ellipse(1250, 100, 40, 40)
    fill(255);
    text("Destination", 1275, 100);

    //for undiscovered
    fill(255, 212, 68);
    ellipse(1250, 150, 40, 40)
    fill(255);
    text("Undiscovered", 1275, 150);

    //for discovered
    fill(75, 123, 236);
    ellipse(1250, 200, 40, 40)
    fill(255);
    text("Discovered", 1275, 200);

    //for done
    fill(132,108,91);
    ellipse(1250, 250, 40, 40)
    fill(255);
    text("Done", 1275, 250);
    pop();
}
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
