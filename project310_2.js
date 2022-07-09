/*
Author: Ryan Woodward & Asher Shores
Date: (start)6/5/2022  (edited) 6/7/2022
Description: JavaScript file for the primary project for CST-310
            create a scene to emulate a real world environment
File: project310.js
 */


"use strict";
//variable to hold HTML canvas
var canvas;

//variable to hold WebGL context
var gl;

//Initial Vetices of any generated cube, which is done through calling the cubeColor() function
const cubeVerts = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

//variable to count how many times the colorCube is used, so that sides can differ in color,
//so the objects show better against each other
let colorCount = 0;

//variable array that will hold the adjusted vertices of a cube
var points = [];

//variable array that will hold the values for each color- on the vertex
var colors = [];

//variables references the axes
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;

//theta, is the position of rotation, the start position can be set here
var theta = [0.5,0.5,0.5];

var thetaLoc;

window.onload = function init()
{
    //JS call to access the HTML canvas tag on the DOM
    canvas = document.getElementById( "gl-canvas" );

    //gets the WebGl context
    gl = WebGLUtils.setupWebGL( canvas );

    //Error checking to see if used browser accepts webgl context
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //*******************************************************
    //Objects within the Scene

        //the colorCube function is pas the changes to initial position and scale (set the cubeVerts array above)
        //and prints a cube with these changes.
    //*******************************************************
    //left wall----
    colorCube([-0.5,0.0,0.1],[0.02,0.7,1.2]);
    //right wall----
    colorCube([0.1,0.0,-0.5],[1.2,0.7,0.02]);
    //floor----
    colorCube([0.1,-0.34,0.1],[1.2,0.02,1.2]);

    //*****************
    //window
        //top left pane
    colorCube([-0.483,0.13,0.2],[0.02,0.15,0.15]);
        //top right pane
    colorCube([-0.483,0.13,0.04],[0.02,0.15,0.15]);
        //bottom left pane
    colorCube([-0.483,-0.03,0.2],[0.02,0.15,0.15]);
        //bottom right pane
    colorCube([-0.483,-0.03,0.04],[0.02,0.15,0.15]);
        //curtain rod
    colorCube([-0.483,0.23,0.12],[0.02,0.02,0.6]);
        //curtains
    colorCube([-0.483,0.022,0.32],[0.015,0.38,0.1]); //left curtain
    colorCube([-0.483,0.022,-0.1],[0.015,0.38,0.1]);   //right curtain

    //*****************
    //coffee table
        //bottom plank
    colorCube([0.09,-0.3,0.3],[0.4,0.02,0.17]);
        //top plank
   colorCube([0.09,-0.25,0.3],[0.4,0.02,0.17]);
        //middle supports
    colorCube([-0.06,-0.28,0.355],[0.03,0.05,0.03]); //front left
    colorCube([0.25,-0.28,0.355],[0.03,0.05,0.03]);  //front right
    colorCube([0.1,-0.28,0.355],[0.03,0.05,0.03]); //front middle
    colorCube([-0.06,-0.28,0.25],[0.03,0.05,0.03]); //back left
    colorCube([0.25,-0.28,0.25],[0.03,0.05,0.03]); //back right
    colorCube([0.1,-0.28,0.25],[0.03,0.05,0.03]); //back middle

    //rug
    colorCube([0.1,-0.328,0.3],[0.5,0.01,0.35]);

    //*****************
    //COUCH ----
    colorCube([0.1,-0.19,-0.43],   [0.5,0.2,0.03]);   //frame back
    colorCube([0.1,-0.29,-0.32],[0.5,0.03,0.25]);     //seat frame
    colorCube([-0.15,-0.26,-0.32],[0.03,0.1,0.27]);         //left arm frame
    colorCube([0.35,-0.26,-0.32],[0.03,0.1,0.25]);         //right arm frame
    colorCube([-0.005,-0.16,-0.4],[0.23,0.2,0.03]);        //left back cushion
    colorCube([0.235,-0.16,-0.4],[0.23,0.2,0.03]);       //right back cushion
    colorCube([-0.005,-0.26,-0.29],[0.24,0.03,0.23]);         //left seat cushion
    colorCube([0.24,-0.26,-0.29],[0.24,0.03,0.23]);      //right seat cushion
    colorCube([-0.15,-0.2,-0.32],[0.04,0.04,0.27]);          //left arm rest
    colorCube([0.35,-0.2,-0.32],[0.04,0.04,0.27]);         //right arm rest

    //*****************
    //Lamp
    colorCube([-0.4,-0.1,-0.4],[0.02,.5,0.02]); //lamp post
    colorCube([-0.4,-0.334,-0.4],[0.1,0.04,0.1]); //lamp base
    colorCube([-0.4,0.1,-0.4],[0.1,0.1,0.1]);

    //*******************************************************
    //*******************************************************




    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);



    //
    //  Code belowe is used to Load shaders and initialize attribute buffers
    //Shaders are largely handled in the HTML file
    //

    //creates a program and attaches the shaders (HTML file) to the program
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    //tells the context which program we want to use.
    gl.useProgram( program );

    //creates a buffers that will be used for color vectors
    var cBuffer = gl.createBuffer();
    //binds the color Buffer to the context
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    //assigns the buffer the data from the colors array, which gets filled after colorCube is called
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    //find and assigns the vertex Color attribute (in the vertex shader) to this variable
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    //creates a vertex buffer for the vertices of a generated cube
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    //assigns the buffer data from the points array, which gets filled after colorCube is called
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    //finds and assigns the vertex position, for each cube, to the variable, which will then located
    //by the second line in attribPointer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //this line finds the uniform 'theta' defined in the shaders and assigns it to the variable
    thetaLoc = gl.getUniformLocation(program, "theta");

    const modelLoc = gl.getUniformLocation(program, 'uModel');
    const viewLoc = gl.getUniformLocation(program, 'uView');
    const projectionLoc = gl.getUniformLocation(program, 'uProjection');

    const model = mat4();
    const view = mat4();
    const proj = mat4();

    perspective(Math.PI / 1.5, gl.canvas.width / gl.canvas.height, 1, 100);

    gl.uniformMatrix4fv(modelLoc, false, model);
    gl.uniformMatrix4fv(viewLoc, false, view);
    gl.uniformMatrix4fv(projectionLoc, false, proj);

    //render function call
    render();
}

function colorCube(pos, scale)
{
    quad( 1, 0, 3, 2, pos, scale);
    quad( 2, 3, 7, 6, pos, scale);
    quad( 3, 0, 4, 7, pos, scale);
    quad( 6, 5, 1, 2, pos, scale);
    quad( 4, 5, 6, 7, pos, scale);
    quad( 5, 4, 0, 1, pos, scale);
}

function quad(a, b, c, d, pos, scale)
{

    //the if statement is used to determine what color vectors will be used for each vertex
    //its purpose to 'mix up' the colors applied to each side of the cube so that the colors
    //when objects are viewed from one side show up against each other.
    if(colorCount < 4){

        var vertexColors = [
            [0.9,0.9,0.9,1.0],
            [0.3,0.3,0.3,1.0],
            [0.8,0.8,0.8,1.0],
            [0.5,0.5,0.5,1.0],
            [0.8,0.8,0.8,1.0],

            [0.5,0.5,0.5,1.0],
            [0.9,0.9,0.9,1.0],
            [0.3,0.3,0.3,1.0],

        ];

    }else{
        var vertexColors = [
            [0.8,0.8,0.8,1.0],
            [0.5,0.5,0.5,1.0],
            [0.9,0.9,0.9,1.0],
            [0.3,0.3,0.3,1.0],

            [0.5,0.5,0.5,1.0],
            [0.8,0.8,0.8,1.0],
            [0.3,0.3,0.3,1.0],
            [0.9,0.9,0.9,1.0],
        ];
    }



    colorCount++;

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    //this array holds the values, passed to it, correspinding to the vertices defined
    //in the cubeVerts array
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        let currPoint = cubeVerts[indices[i]];
        let u;

        // This portion applies the manual scaling done in the function call
        u = scalem(scale[0], scale[1], scale[2]);
        currPoint = mult(u,currPoint);

        // this portion applies the manual positioning done in the function call
        u = translate(pos[0], pos[1], pos[2]);
        currPoint = mult(u,currPoint);

        //these lines push the points to their respective arrays is preparation to be rendered
        points.push( currPoint );
        colors.push(vertexColors[a]);

    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // theta[axis] += 0;

    theta[0] = document.getElementById('xRotation').value;
    theta[1] = document.getElementById('yRotation').value;
    theta[2] = document.getElementById('zRotation').value;

    gl.uniform3fv(thetaLoc, theta);

    //the drawing text is triangles, and the length is set by how many vetices were added to the points array
    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    requestAnimFrame(render);
}