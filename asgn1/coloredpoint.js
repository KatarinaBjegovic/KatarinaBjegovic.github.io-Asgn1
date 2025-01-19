
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
        gl_FragColor =  u_FragColor;
    }`

    // make global either stuff that needs to be passed to shaders or user interfasce elements
let canvas;
let gl;
let a_position;
let u_FragColor;
let u_size;
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 20.0;


function setupWebGL(){
// Retrieve <canvas> element
    canvas = document.getElementById('webgl');
// Get the rendering context for WebGL
    gl = getWebGLContext(canvas); 
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

    // a_size = parseFloat(document.getElementById("size_slider").value);

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

    //document.getElementById('square').onclick = function() {shape="squafe"};
    //document.getElementById('triangle').onclick = function() {shape="squafe"};
    //document.getElementById('circle').onclick = function() {shape="squafe"};


}


function main() {
    setupWebGL();
    connectVariablesToGLSL();

    addActionsForHTMLUI();
// Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;

    // specify the color for clearing canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; // The array for a mouse press
var g_colors = []; // The array to store the color of a point
var g_sizes = []

function click(ev ) {
    [x,y] = convertCoordinatesEventToGL(ev);

// Store the coordinates to g_points array 
    g_points.push([x,y]);

    g_colors.push(g_selectedColor.slice());

    g_sizes.push(g_selectedSize);

    // dont need this....
    // if ( x >= 0.0 && y >=0.0) {
    //     g_colors.push([1.0,0.0,0.0,1.0]);
    // } else if (x < 0.0 && y < 0.0) {
    //     g_colors.push([0.0,1.0,0.0,1.0]);
    // } else {
    //     g_colors.push([1.0,1.0,1.0,1.0]);
    // }

    renderAllShapes();
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

    var len = g_points.length; 
    for (var i = 0; i < len; i++) {
        var xy = g_points[i];
        var rgba = g_colors[i];
        var size = g_sizes[i];
// Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_position, xy[0], xy[1], 0.0);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniform1f(u_size, size);
// Draw a point
        gl.drawArrays(gl.POINTS, 0, 1); 
    }
}


