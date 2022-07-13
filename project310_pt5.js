/****************************************************************************************
Author: Ryan Woodward & Asher Shores
Date:  (Start)6/11/2022
Description: Primary project of CST-310, for this portion of the project we
            are adding cameras, improved appearance and rendering of the shapes,
               and, (time permitting) meshes to further enhance the look of the scene
File: project310_pt5.js
 Dependencies: project310_pt.html, webgl-utils.js, initShaders.js, MV.js
 *****************************************************************************************/
//NOTES:
    //Adjust theta, radius, and phi and camera positions so the scene is more visible
    //create general color matrix at begin program and when each object method is accessed give it values corresponding to the object


//*************************************************
//Global Variables
//*************************************************
var canvas,
    gl,
    vertexPoints = [],
    vertexColors = [],
    perspective_near = 0.3,
    perspective_far = 3.0,
    radius = 4.0,
    theta = 0.0,
    phi = 0.0,
    dr = 5.0 * Math.PI/180.0,
    y_FOV = 45.0,                   //Field of View in Y direction angle (degrees)
    aspect,                         //Viewport aspect ratio
    model_view_Matrix,
    projection_Matrix,
    modelView, projection,
    camera,
    eye;

const at = vec3(0.0,0.0,0.0); //This variable relates to the camera, I believe where it is pointing 'at'
const up = vec3(0.0, 1.0, 0.0); //This variable relates to the camera, I believe from the camera's position what is the 'up' direction

var vertexData =[
    vec4(-0.5, -0.5,  1.5, 1.0),
    vec4(-0.5,  0.5,  1.5, 1.0),
    vec4(0.5,  0.5,  1.5, 1.0),
    vec4(0.5, -0.5,  1.5, 1.0),
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5,  0.5, 0.5, 1.0),
    vec4(0.5,  0.5, 0.5, 1.0),
    vec4( 0.5, -0.5, 0.5, 1.0)
];

var colorData = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
];

//*************************************************
//Program Starting Function
//*************************************************
window.onload = function init(){

    initCanvas();

    document.getElementById("Button1").onclick = function(){perspective_near  *= 1.1; perspective_far *= 1.1;};
    document.getElementById("Button2").onclick = function(){perspective_near *= 0.9; perspective_far *= 0.9;};
    document.getElementById("Button3").onclick = function(){radius *= 2.0;};
    document.getElementById("Button4").onclick = function(){radius *= 0.5;};
    document.getElementById("Button5").onclick = function(){theta += dr;};
    document.getElementById("Button6").onclick = function(){theta -= dr;};
    document.getElementById("Button7").onclick = function(){phi += dr;};
    document.getElementById("Button8").onclick = function(){phi -= dr;};
    document.getElementById("Button9").onclick = function(){camera = 1;};
    document.getElementById("Button10").onclick = function(){camera = 2;};
    document.getElementById("Button11").onclick = function(){camera = 3;};

    render();
}//init()

//*************************************************
//Initialization & Rendering Functions
//*************************************************


function initCanvas(){

    canvas = document.getElementById("rCanvas");
    gl = canvas.getContext("webgl");

    if ( !gl ) { alert( "FEHLER: WebGL isn't available" ); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = canvas.width / canvas.height;
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
}//initCanvas()


function drawScene(){

    createWallsFloor();
    createCouch();
    createRug();
    gl.uniformMatrix4fv( modelView, false, flatten(model_view_Matrix) );
    gl.uniformMatrix4fv( projection, false, flatten(projection_Matrix) );
    gl.drawArrays( gl.TRIANGLES, 0, vertexPoints.length );

}//drawScene


function createCamera(){
    switch(camera){
        case 1:
            // on an orbit
            eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
                radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
            break;
        case 2:
            //fixed point
            eye = vec3(0.5,0.7,4.2);
            break;
        case 3:
            //fixed point
            eye = vec3(-0.5,0.0,0.0);
        default:
            eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
                radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
            break;
    }

    model_view_Matrix = lookAt(eye, at , up);
    projection_Matrix = perspective(y_FOV, aspect, perspective_near, perspective_far);
}//createCamera()


var render = function(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    createCamera();
    drawScene();
    requestAnimFrame(render);
}//render()

//*************************************************
//Specific Scene Object Functions
//*************************************************

function createWallsFloor(){

    colorCube([-0.1,-0.19,2],[0.9,0.0125,0.9]);

    var wallFloorProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(wallFloorProgram);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( wallFloorProgram, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexPoints), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( wallFloorProgram, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( wallFloorProgram, "modelView" );
    projection = gl.getUniformLocation( wallFloorProgram, "projection" );
}//createWallFloor

function createCouch(){
/*
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

 */
    //GOOD FLOOR START
    //colorCube([-0.1,-0.19,2],[0.9,0.0125,0.9]);


    var couchProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(couchProgram);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( couchProgram, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexPoints), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( couchProgram, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( couchProgram, "modelView" );
    projection = gl.getUniformLocation( couchProgram, "projection" );
}//createCouch()

function createRug(){

    var rugProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(rugProgram);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( rugProgram, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexPoints), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( rugProgram, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( rugProgram, "modelView" );
    projection = gl.getUniformLocation( rugProgram, "projection" );
}//createRug()

//createCoffeeTable()

//createWindow()

//createCurtains()

//createCurtainRod()

//createLamp()

//*************************************************
//General Object Creation Functions
//*************************************************


function colorCube(pos, scale){

    quad( 1, 0, 3, 2, pos, scale);
    quad( 2, 3, 7, 6, pos, scale);
    quad( 3, 0, 4, 7, pos, scale);
    quad( 6, 5, 1, 2, pos, scale);
    quad( 4, 5, 6, 7, pos, scale);
    quad( 5, 4, 0, 1, pos, scale);
}//colorCube()


function quad(a, b, c, d, position, scale) {

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        let currPoint = vertexData[indices[i]];
        let u;

        // This portion applies the manual scaling done in the function call
        u = scalem(scale[0], scale[1], scale[2]);
        currPoint = mult(u,currPoint);

        // this portion applies the manual positioning done in the function call
        u = translate(position[0], position[1], position[2]);
        currPoint = mult(u,currPoint);

        //these lines push the points to their respective arrays is preparation to be rendered
        vertexPoints.push( currPoint );
        vertexColors.push(colorData[a]);

    }
}//quad()


//-------------END--------------------