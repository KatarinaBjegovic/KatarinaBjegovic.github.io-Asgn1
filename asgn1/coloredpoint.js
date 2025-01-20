var VSHADER_SOURCE = `
    attribute vec4 a_position;
    uniform float u_size; 
    void main() {
        gl_Position = a_position;
        gl_PointSize = u_size ;
    }`

var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`


class Point{
    constructor(){
        this.type = 'point';
        this.position = [0.0,0.0,0.0];
        this.color = [0.5,0.5,0.5];
        this.size = 5.0;
    }
    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        
        gl.disableVertexAttribArray(a_position);

        gl.vertexAttrib3f(a_position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_size, size);

        gl.drawArrays(gl.POINTS, 0, 1); 
    }
}



function drawTriangle(verticies){
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0,0);

    gl.enableVertexAttribArray(a_position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}


class HardTriangle{
    constructor(){
        this.type = 'hardtriangle';
        this.coors = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
    }
    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        drawTriangle(this.coors); 
    }
}



function drawAllTriangles() {
    let triangles = [
        [0, 140, -40, 80, 40, 80], // top tree
        [0, 100, -60, 0, 60, 0], // mid tree 
        [0, 20, -80, -80, 80, -80], //bottom tree

        [-20, -80, 20, -80, -20, -140], //L stump
        [20, -80, -20, -140, 20, -140], // R stump

        [100, 0, 120, 0, 100, -140], // ski 1 L
        [120, 0, 100, -140, 120, -140], // ski 1 R
        [140, 0, 160, 0, 140, -140], // ski 2 L
        [160, 0, 140, -140, 160, -140] // ski 2 R
    ]; 
    let black_triangles = [
        [0, 130, -30, 85, 30, 85], // top tree
        [0, 90, -50, 5, 50, 5], // mid tree 
        [0, 10, -70, -75, 70, -75], //bottom tree

        [-15, -70, 15, -70, -15, -135], //L stump
        [15, -70, -15, -135, 15, -135], // R stump

        [105, -5, 115, -5, 105, -135], // ski 1 L
        [115, -5, 105, -135, 115, -135], // ski 1 R
        [145, -5, 155, -5, 145, -135], // ski 2 L
        [155, -5, 145, -135, 155, -135] // ski 2 R
    ]; 

    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas before drawing


    for (let i = 0; i < triangles.length; i++) {
        let t_coord = triangles[i];
        t_coord = [t[0]/200, t[1]/200, t[2]/200, t[3]/200, t[4]/200, t[5]/200];
        let white_tri = new HardTriangle();
        white_tri.coors = t_coord;
        white_tri.color = [1.0,1.0,1.0,1.0];
        g_shapesList.push(white_tri);
    }
    for (let i = 0; i < triangles.length; i++) {
        let t_coord = triangles[i];
        t_coord = [t[0]/200, t[1]/200, t[2]/200, t[3]/200, t[4]/200, t[5]/200];
        let black_tri = new HardTriangle();
        black_tri.coors = t_coord;
        black_tri.color = [0.0,0.0,0.0,1.0];
        g_shapesList.push(white_tri);
    }

    let circles = [
        [-10,110,0],
        [10,70,0],
        [-10,30,0],
        [-50,-90,0],
        [30,-70,0],
        [10,-30,0],
        [-10,-50,0]
    ]

    gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0);
    for (let i = 0; i < circles.length; i++) {
        let c_coord = circles[i];
        c_coord = [t[0]/200, t[1]/200, t[2]/200];
        let circ = new Circle();
        circ.position = c_coord;
        circ.size = 20.0;
        circ.color = [1.0,0.0,0.0,1.0];
        circ.segments = 20;
        g_shapesList.push(circ);
        let circ_black = new Circle();
        circ_black.position = c_coord;
        circ_black.size = 10.0;
        circ_black.color = [0.0,0.0,0.0,1.0];
        circ_black.segments = 20;
        g_shapesList.push(circ_black);

    }





}



// function drawAllTriangles() {
//     let triangles = [
//         [0, 140, -40, 80, 40, 80], // top tree
//         [0, 100, -60, 0, 60, 0], // mid tree 
//         [0, 20, -80, -80, 80, -80], //bottom tree

//         [-20, -80, 20, -80, -20, -140], //L stump
//         [20, -80, -20, -140, 20, -140], // R stump

//         [100, 0, 120, 0, 100, -140], // ski 1 L
//         [120, 0, 100, -140, 120, -140], // ski 1 R
//         [140, 0, 160, 0, 140, -140], // ski 2 L
//         [160, 0, 140, -140, 160, -140] // ski 2 R
//     ]; 
//     let black_triangles = [
//         [0, 130, -30, 85, 30, 85], // top tree
//         [0, 90, -50, 5, 50, 5], // mid tree 
//         [0, 10, -70, -75, 70, -75], //bottom tree

//         [-15, -70, 15, -70, -15, -135], //L stump
//         [15, -70, -15, -135, 15, -135], // R stump

//         [105, -5, 115, -5, 105, -135], // ski 1 L
//         [115, -5, 105, -135, 115, -135], // ski 1 R
//         [145, -5, 155, -5, 145, -135], // ski 2 L
//         [155, -5, 145, -135, 155, -135] // ski 2 R
//     ]; 

//     gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas before drawing

//     gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0); // Set a default color for the triangles
//     for (let i = 0; i < triangles.length; i++) {
//         console.log("Drawing triangle ", i + 1, " with vertices: ", triangles[i]);
//         let t = triangles[i];
//         console.log("Drawing triangle ", i + 1, " with vertices: ", t[0]);
//         drawTriangle([t[0]/200, t[1]/200, t[2]/200, t[3]/200, t[4]/200, t[5]/200]);
//         //drawTriangle([(t[0] + 200)/200, (-1*t[1]+200)/200, (t[2]+200)/200, (-1*t[3]+200)/200, (t[4]+200)/200, (-1*t[5]+200)/200]);
//     }

//     gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0);
//     for (let i = 0; i < triangles.length; i++) {
//         let t = black_triangles[i];
//         drawTriangle([t[0]/200, t[1]/200, t[2]/200, t[3]/200, t[4]/200, t[5]/200]);
//         //drawTriangle([(t[0] + 200)/200, (-1*t[1]+200)/200, (t[2]+200)/200, (-1*t[3]+200)/200, (t[4]+200)/200, (-1*t[5]+200)/200]);
//     }

//     gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0);
//     for (let i = 0; i < triangles.length; i++) {
//         let t = black_triangles[i];
//         drawTriangle([t[0]/200, t[1]/200, t[2]/200, t[3]/200, t[4]/200, t[5]/200]);
//         //drawTriangle([(t[0] + 200)/200, (-1*t[1]+200)/200, (t[2]+200)/200, (-1*t[3]+200)/200, (t[4]+200)/200, (-1*t[5]+200)/200]);
//     }





// }


class Triangle{
    constructor(){
        this.type = 'triangle';
        this.position = [0.0,0.0,0.0];
        this.color = [0.5,0.5,0.5];
        this.size = 5.0;
    }
    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        //gl.vertexAttrib3f(a_position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_size, size);

        var d = this.size/200.0; 
        drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]); 
    }
}



class Circle{
    constructor(){
        this.type = 'circle';
        this.position = [0.0,0.0,0.0];
        this.color = [0.5,0.5,0.5];
        this.size = 5.0;
        this.segments = 10;
    }
    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        //gl.vertexAttrib3f(a_position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_size, size);

        var d = this.size/200.0; 
        let angleStep = 360/this.segments;
        for (var angle = 0; angle < 360; angle += angleStep) {
            let centerpt = [xy[0], xy[1]];
            let angle1 = angle;
            let angle2 = angle + angleStep;
            let vec1 = [Math.cos(angle1 * Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
            let vec2 = [Math.cos(angle2 * Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
            let pt1 = [centerpt[0]+vec1[0], centerpt[1]+vec1[1]];
            let pt2 = [centerpt[0]+vec2[0], centerpt[1]+vec2[1]];
            drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]); 
        }
    }
}

const SQUARE = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
//const HARDTRI = 3;
    // make global either stuff that needs to be passed to shaders or user interfasce elements
let canvas;
let gl;
let a_position;
let u_FragColor;
let u_size;
let g_selectedColor = [0.5,0.5,0.5,1.0];
let g_selectedSize = 20.0;
let g_selectedType=SQUARE;
let g_selectedSegments = 10.0;
var g_shapesList = []


function setupWebGL(){
    canvas = document.getElementById('webgl');
    gl = getWebGLContext(canvas); 
    gl = canvas.getContext( "webgl", { preserveDrawingBuffer: true} );
    if (!gl) {
        console.log('Failed to get the rendering context')
        return;
    }
}

function connectVariablesToGLSL(){
    if (!initShaders(gl,VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('Failed to initialize shaders');
        return;
    }
    a_position = gl.getAttribLocation(gl.program, 'a_position')
    if (a_position < 0) {
        console.log('Failed to get the storage location of a_position');
        return;
    }
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }
    u_size = gl.getUniformLocation(gl.program, 'u_size');
    if (!u_size) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }
}

function addActionsForHTMLUI(){
    document.getElementById("red").addEventListener('mouseup', function(){g_selectedColor[0] = this.value/255; }); 
    document.getElementById("green").addEventListener('mouseup', function(){g_selectedColor[1] = this.value/255; }); 
    document.getElementById("blue").addEventListener('mouseup', function(){g_selectedColor[2] = this.value/255; }); 

    document.getElementById("size_slider").addEventListener('mouseup', function(){g_selectedSize = this.value; }); 
    document.getElementById("segment_slider").addEventListener('mouseup', function(){g_selectedSegments = this.value; }); 

    document.getElementById('clear').onclick = function() {g_shapesList=[]; renderAllShapes();};

    document.getElementById('square').onclick = function() {g_selectedType = SQUARE};
    document.getElementById('triangle').onclick = function() {g_selectedType=TRIANGLE};
    document.getElementById('circle').onclick = function() {g_selectedType=CIRCLE};

    document.getElementById('pix_winter').onclick = drawAllTriangles;

}




function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHTMLUI();

    canvas.onmousedown = click;
    canvas.onmousemove = function(ev){ if (ev.buttons == 1) { click(ev) } };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
}


function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer 
    var y = ev.clientY; // y coordinate of a mouse pointer 
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2); 
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return([x,y]);
}


function renderAllShapes(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_shapesList.length;

    for (var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
}




function click(ev ) {
    [x,y] = convertCoordinatesEventToGL(ev);

    let point;
    if (g_selectedType==CIRCLE) {
        point = new Circle();
        point.segments = g_selectedSegments;
    } else if (g_selectedType==TRIANGLE) {
        point = new Triangle();
    } // else if (g_selectedType==HARDTRI) { point = new HardTri(); }
    else {
        point = new Point();
    }


    point.position = [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);

    renderAllShapes();
}

 
