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
var g_shapesList = [];
var g_shapesList_WINTER = [];


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

    document.getElementById('pix_winter').onclick = WinterPage;

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

 


function WinterPage() {
    let triangles = [
        [-100, 140, -140, 80, -60, 80], // top tree
        [-100, 100, -160, 0, -40, 0], // mid tree 
        [-100, 20, -180, -80, -20, -80], //bottom tree

        [-120, -80, -80, -80, -120, -140], //L stump
        [-80, -80, -120, -140, -80, -140], // R stump

        [0, 0, 20, 0, 0, -140], // ski 1 L
        [20, 0, 0, -140, 20, -140], // ski 1 R
        [40, 0, 60, 0, 40, -140], // ski 2 L
        [60, 0, 40, -140, 60, -140] // ski 2 R
    ]; 
    let black_triangles = [
        [-100, 130, -130, 85, -70, 85], // top tree
        [-100, 90, -150, 5, -50, 5], // mid tree 
        [-100, 10, -170, -75, -30, -75], //bottom tree

        [-115, -70, -85, -70, -115, -135], //L stump
        [-85, -70, -115, -135, -85, -135], // R stump

        [5, -5, 15, -5, 5, -135], // ski 1 L
        [15, -5, 05, -135, 15, -135], // ski 1 R
        [45, -5, 55, -5, 45, -135], // ski 2 L
        [55, -5, 45, -135, 55, -135] // ski 2 R
    ]; 
    let circles = [
        [-110,110,0],
        [-90,70,0],
        [-110,30,0],
        [-150,-90,0],
        [-70,-70,0],
        [-90,-30,0],
        [-110,-50,0],
        [-40,-10,0],
        [-70,10,0],
        [-50,70,0]
    ];
    
    let ski_circles = [
        [10,0,0],
        [50,0,0]
    ]

    let buckles = [
        [3, -45, 17, -45, 3, -95], // buckle 1 L
        [17, -45, 3, -95, 17, -95], // buckle 1 R
        [43, -45, 63, -45, 43, -95], // buckle 2 L
        [63, -45, 43, -95, 63, -95] // buckle 2 R
    ]

    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas before drawing

    for (let i = 0; i < triangles.length; i++) {
        let t_coord = triangles[i];
        t_coord = [t_coord[0]/150, t_coord[1]/180, t_coord[2]/180, t_coord[3]/180, t_coord[4]/180, t_coord[5]/180];
        let white_tri = new HardTriangle();
        white_tri.coors = t_coord;
        white_tri.color = [1.0,1.0,1.0,1.0];
        g_shapesList.push(white_tri);
    }
    
    for (let i = 0; i < ski_circles.length; i++) {
        let c_coord = ski_circles[i];
        c_coord = [c_coord[0]/180, c_coord[1]/180, c_coord[2]/180];
        let circ = new Circle();
        circ.position = c_coord;
        circ.size = 10.0;
        circ.color = [1.0,1.0,1.0,1.0];
        circ.segments = 20;
        g_shapesList.push(circ);
        let circ_black = new Circle();
        circ_black.position = c_coord;
        circ_black.size = 10.0;
        circ_black.color = [0.0,0.0,0.0,1.0];
        circ_black.segments = 20;
        g_shapesList.push(circ_black);
    }

    for (let i = 0; i < black_triangles.length; i++) {
        let t_coord = black_triangles[i];
        t_coord = [t_coord[0]/150, t_coord[1]/180, t_coord[2]/180, t_coord[3]/180, t_coord[4]/180, t_coord[5]/180];
        let black_tri = new HardTriangle();
        black_tri.coors = t_coord;
        black_tri.color = [0.0,0.0,0.0,1.0];
        g_shapesList.push(black_tri);
    }

    for (let i = 0; i < buckles.length; i++) {
        let t_coord = buckles[i];
        t_coord = [t_coord[0]/150, t_coord[1]/180, t_coord[2]/180, t_coord[3]/180, t_coord[4]/180, t_coord[5]/180];
        let buckle = new HardTriangle();
        buckle.coors = t_coord;
        buckle.color = [1.0,1.0,1.0,1.0];
        g_shapesList.push(buckle);
    }

    gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0);
    for (let i = 0; i < circles.length; i++) {
        let c_coord = circles[i];
        c_coord = [c_coord[0]/180, c_coord[1]/180, c_coord[2]/180];
        let circ = new Circle();
        circ.position = c_coord;
        circ.size = 10.0;
        circ.color = [1.0,1.0,1.0,1.0];
        circ.segments = 20;
        g_shapesList.push(circ);
        let circ_black = new Circle();
        circ_black.position = c_coord;
        circ_black.size = 8.0;
        circ_black.color = [0.0,0.0,0.0,1.0];
        circ_black.segments = 20;
        g_shapesList.push(circ_black);
    }
    renderAllShapes();
}
