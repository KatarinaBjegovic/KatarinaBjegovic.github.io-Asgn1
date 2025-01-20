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
var g_shapesList_SAVED = [];


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
    document.getElementById('pix_spring').onclick = SpringPage;

    document.getElementById('save').onclick = function() {g_shapesList_SAVED = g_shapesList; };
    document.getElementById('view').onclick = function() {g_shapesList = []; renderSavedShapes(); };


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

function renderSavedShapes(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_shapesList_SAVED.length;

    for (var i = 0; i < len; i++) {
        g_shapesList_SAVED[i].render();
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

 


function SpringPage() {
    let center_circle = [0,0,0]; // size 40
    let mid_circle = [ // size = 20
        [-60,-20,0],
        [0,-60,0],
        [60,-20,0],
        [40,40,0],
        [-20,60,0],
    ];

    let small_circles = [ // 10
        [-40,60,0],
        [-20,80, 0],

        [40,60,0],
        [60,40,0],

        [60,-40,0],
        [80,-20,0],

        [20,-80,0],
        [-20,-80,0],

        [-60,-40,0],
        [-80,-20,0]
    ];

    let big_circles = [ // 60
        [100,-60,0],
        [0,-120,0],
        [-100,-60,0],
        [-60,100,0],
        [80,80,0]
    ];

    let fixers = [ //20
        [-70,-30,0],
        [0,-80,0],
        [70,-30,0],
        [50,50,0],
        [-30,70,0]
    ];

    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas before drawing
    g_shapesList=[]; 
    renderAllShapes();

    let c_coord = [center_circle[0]/200, center_circle[1]/200, center_circle[2]/200];
    let center = new Circle();
    center.position = c_coord;
    center.size = 55.0;
    center.color = [1.0,1.0,1.0,1.0];
    center.segments = 20;
    g_shapesList.push(center);

    for (let i = 0; i < big_circles.length; i++) {
        let c_coord = big_circles[i];
        c_coord = [c_coord[0]/200, c_coord[1]/200, c_coord[2]/200];
        let circ = new Circle();
        circ.position = c_coord;
        circ.size = 50.0;
        circ.color = [1.0,1.0,1.0,1.0];
        circ.segments = 20;
        g_shapesList.push(circ);
        let circ_black = new Circle();
        circ_black.position = c_coord;
        circ_black.size = 43.0;
        circ_black.color = [0.0,0.0,0.0,1.0];
        circ_black.segments = 20;
        g_shapesList.push(circ_black);
    }

    for (let i = 0; i < mid_circle.length; i++) {
        let c_coord = mid_circle[i];
        c_coord = [c_coord[0]/200, c_coord[1]/200, c_coord[2]/200];
        let circ = new Circle();
        circ.position = c_coord;
        circ.size = 20.0;
        circ.color = [1.0,1.0,1.0,1.0];
        circ.segments = 20;
        g_shapesList.push(circ);
        let circ_black = new Circle();
        circ_black.position = c_coord;
        circ_black.size = 15.0;
        circ_black.color = [0.0,0.0,0.0,1.0];
        circ_black.segments = 20;
        g_shapesList.push(circ_black);
    }

    for (let i = 0; i < small_circles.length; i++) {
        let c_coord = small_circles[i];
        c_coord = [c_coord[0]/200, c_coord[1]/200, c_coord[2]/200];
        let circ = new Circle();
        circ.position = c_coord;
        circ.size = 10.0;
        circ.color = [1.0,1.0,1.0,1.0];
        circ.segments = 20;
        g_shapesList.push(circ);
        let circ_black = new Circle();
        circ_black.position = c_coord;
        circ_black.size = 5.0;
        circ_black.color = [0.0,0.0,0.0,1.0];
        circ_black.segments = 20;
        g_shapesList.push(circ_black);
    }

    for (let i = 0; i < fixers.length; i++) {
        let c_coord = fixers[i];
        c_coord = [c_coord[0]/200, c_coord[1]/200, c_coord[2]/200];
        let circ_black = new Circle();
        circ_black.position = c_coord;
        circ_black.size = 15.0;
        circ_black.color = [0.0,0.0,0.0,1.0];
        circ_black.segments = 20;
        g_shapesList.push(circ_black);
    }

    

    let center_black = new Circle();
    center_black.position = c_coord;
    center_black.size = 48.0;
    center_black.color = [0.0,0.0,0.0,1.0];
    center_black.segments = 20;
    g_shapesList.push(center_black);
    
    renderAllShapes();
}


function WinterPage() {
    let triangles = [
        [-50, 140, -90, 80, -10, 80], // top tree
        [-50, 100, -110, 0, 10, 0], // mid tree 
        [-50, 20, -120, -80, 30, -80], //bottom tree

        [-70, -80, -30, -80, -70, -140], //L stump
        [-30, -80, -70, -140, -30, -140], // R stump

        [50, 0, 70, 0, 50, -140], // ski 1 L
        [70, 0, 50, -140, 70, -140], // ski 1 R
        [90, 0, 110, 0, 90, -140], // ski 2 L
        [110, 0, 90, -140, 110, -140] // ski 2 R
    ]; 
    let black_triangles = [
        [-50, 130, -80, 85, -20, 85], // top tree
        [-50, 90, -100, 5, 0, 5], // mid tree 
        [-50, 10, -110, -75, 20, -75], //bottom tree

        [-65, -70, -35, -70, -65, -135], //L stump
        [-35, -70, -65, -135, -35, -135], // R stump

        [55, -5, 65, -5, 55, -135], // ski 1 L
        [65, -5, 55, -135, 65, -135], // ski 1 R
        [95, -5, 105, -5, 95, -135], // ski 2 L
        [105, -5, 95, -135, 105, -135] // ski 2 R
    ]; 
    let circles = [
        [-60,110,0],
        [-40,70,0],
        [-60,30,0],
        [-100,-90,0],
        [-20,-70,0],
        [-40,-30,0],
        [-60,-50,0],
        [-20,10,0]
    ];


    let ski_circles = [
        [60,0,0],
        [100,0,0]
    ];

    let buckles = [
        [55, -45, 65, -45, 55, -95], // buckle 1 L
        [65, -45, 55, -95, 65, -95], // buckle 1 R
        [90, -45, 110, -45, 90, -95], // buckle 2 L
        [110, -45, 90, -95, 110, -95] // buckle 2 R
    ];
    

    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas before drawing
    g_shapesList=[]; 
    renderAllShapes();


    for (let i = 0; i < triangles.length; i++) {
        let t_coord = triangles[i];
        t_coord = [t_coord[0]/150, t_coord[1]/150, t_coord[2]/150, t_coord[3]/150, t_coord[4]/150, t_coord[5]/150];
        let white_tri = new HardTriangle();
        white_tri.coors = t_coord;
        white_tri.color = [1.0,1.0,1.0,1.0];
        g_shapesList.push(white_tri);
    }
    
    for (let i = 0; i < ski_circles.length; i++) {
        let c_coord = ski_circles[i];
        c_coord = [c_coord[0]/150, c_coord[1]/150, c_coord[2]/150];
        let circ = new Circle();
        circ.position = c_coord;
        circ.size = 15.0;
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
        t_coord = [t_coord[0]/150, t_coord[1]/150, t_coord[2]/150, t_coord[3]/150, t_coord[4]/150, t_coord[5]/150];
        let black_tri = new HardTriangle();
        black_tri.coors = t_coord;
        black_tri.color = [0.0,0.0,0.0,1.0];
        g_shapesList.push(black_tri);
    }

    for (let i = 0; i < buckles.length; i++) {
        let t_coord = buckles[i];
        t_coord = [t_coord[0]/150, t_coord[1]/150, t_coord[2]/150, t_coord[3]/150, t_coord[4]/150, t_coord[5]/150];
        let buckle = new HardTriangle();
        buckle.coors = t_coord;
        buckle.color = [1.0,1.0,1.0,1.0];
        g_shapesList.push(buckle);
    }

    gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0);
    for (let i = 0; i < circles.length; i++) {
        let c_coord = circles[i];
        c_coord = [c_coord[0]/150, c_coord[1]/150, c_coord[2]/150];
        let circ = new Circle();
        circ.position = c_coord;
        circ.size = 15.0;
        circ.color = [1.0,1.0,1.0,1.0];
        circ.segments = 20;
        g_shapesList.push(circ);
        let circ_black = new Circle();
        circ_black.position = c_coord;
        circ_black.size = 12.0;
        circ_black.color = [0.0,0.0,0.0,1.0];
        circ_black.segments = 20;
        g_shapesList.push(circ_black);
    }
    renderAllShapes();
}
