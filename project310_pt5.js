/****************************************************************************************
Author: Ryan Woodward & Asher Shores
Date:  (Start)6/11/2022
Description: Primary project of CST-310, for this portion of the project we
            are adding cameras, improved appearance and rendering of the shapes,
               and, (time permitting) meshes to further enhance the look of the scene
File: project310_pt5.2.js
 Dependencies: project310_pt.html, webgl-utils.js, initShaders.js, MV.js
 *****************************************************************************************/

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

//********************************************
//Vertex Data
//********************************************
//This is form cubes only
var vertexData =[

    vec4(-0.5, -0.5,  1.5, 1.0),
    vec4(-0.5,  0.5,  1.5, 1.0),
    vec4(0.5,  0.5,  1.5, 1.0),
    vec4(0.5, -0.5,  1.5, 1.0),

    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5,  0.5, 0.5, 1.0),
    vec4(0.5,  0.5, 0.5, 1.0),
    vec4( 0.5, -0.5, 0.5, 1.0)

    /*
    //trapezoid coordinates - works with the normal indices pattern of colorCube

    //Bottom 4 Coordinates of trap
    vec4(-0.5,0,-0.5,1.0),
    vec4(-0.5,0.0,0.5,1.0),
    vec4(0.5,0.0,0.5,1.0),
    vec4(0.5,0.0,-0.5,1.0),

    //top four coords fo the trap
    vec4(-1.5,1,-1.5,1.0),
    vec4(-1.5,1.0,1.5,1.0),
    vec4(1.5,1.0,1.5,1.0),
    vec4(1.5,1.0,-1.5,1.0),
     */
];

var heptagonData=[ //used for lamp post

    //Single hept 8 coords
    vec4(-2.247,0.0,1.564,1.0),
    vec4(-1.802,0.0,3.514,1.0),
    vec4(0.0,0.0,4.381,1.0),
    vec4(1.802,0.0,3.514,1.0),

    vec4(2.247,0.0,1.564),
    vec4(1.0,0.0,0.0,1.0),
    vec4(-1.0,0.0,0.0,1.0),
    vec4(0.0,0.0,2.077),

    //second heptagonal plane one unit above the original
    vec4(-2.247,1.0,1.564,1.0),
    vec4(-1.802,1.0,3.514,1.0),
    vec4(0.0,1.0,4.381,1.0),
    vec4(1.802,1.0,3.514,1.0),

    vec4(2.247,1.0,1.564),
    vec4(1.0,1.0,0.0,1.0),
    vec4(-1.0,1.0,0.0,1.0),
    vec4(0.0,1.0,2.077)
];

var horizontalHeptagonData =[
    //Single hept 8 coords
    vec4(-2.247,1.564,0.0,1.0),
    vec4(-1.802,3.514,0.0,1.0),
    vec4(0.0,4.381,0.0,1.0),
    vec4(1.802,3.514,0.0,1.0),

    vec4(2.247,1.5640,0.0,1.0),
    vec4(1.0,0.0,0.0,1.0),
    vec4(-1.0,0.0,0.0,1.0),
    vec4(0.0,2.077,0.0),

    //second heptagonal plane one unit above the original
    vec4(-2.247,1.564,1.0,1.0),
    vec4(-1.802,3.514,1.0,1.0),
    vec4(0.0,4.381,1.0,1.0),
    vec4(1.802,3.514,1.0,1.0),

    vec4(2.247,1.564,1.0,1.0),
    vec4(1.0,0.0,1.0,1.0),
    vec4(-1.0,0.0,1.0,1.0),
    vec4(0.0,2.077,1.0,1.0)
];

//*******************************************************
//Color Data
//*******************************************************

//Called by heptagon classes
var lampPostColorData =[
   vec4(0.0,0.0,0.0,0.9),
    vec4(0.0,0.0,0.0,1.0),
    vec4(0.0,0.0,0.0,0.7),
    vec4(0.0,0.0,0.0,0.5),
    vec4(0.0,0.0,0.0,0.6),
    vec4(0.0,0.0,0.0,1.0),
];

var lampShadeColor =[
    vec4(0.6,0.6,0.6,0.65),
    vec4(0.5,0.5,0.5,0.65),
    vec4(0.4,0.4,0.4,0.65),
    vec4(0.5,0.5,0.5,0.68),
    vec4(0.45,0.45,0.45,0.68),
    vec4(0.5,0.5,0.5,0.75),
];

var windowColors = [
    vec4(0.85,0.85,0.85, 0.95),
    vec4(0.85,0.85,0.85, 1.0),
    vec4(0.85,0.85,0.85, 0.95),
    vec4(0.85,0.85,0.85, 0.95),
    vec4(0.85,0.85,0.85, 0.95),
    vec4(0.85,0.85,0.85, 1.0),
];

var wallColors = [
    vec4(0.8,0.8,0.8,0.85),
    vec4(0.8,0.8,0.8,0.82),
    vec4(0.8,0.8,0.8,0.85),
    vec4(0.8,0.8,0.8,0.85),
    vec4(0.8,0.8,0.8,0.84),
    vec4(0.8,0.8,0.8,0.87),
];

var floorColors =[
    vec4(0.6,0.5,0.4,0.8),      // lt brown? 13         --floor
    vec4(0.65,0.5,0.4,0.8),      // lt brown? 13         --floor
    vec4(0.6,0.5,0.4,0.754),      // lt brown? 13         --floor
    vec4(0.6,0.5,0.4,0.8),      // lt brown? 13         --floor
    vec4(0.65,0.5,0.4,0.8),      // lt brown? 13         --floor
    vec4(0.6,0.5,0.4,0.75),      // lt brown? 13         --floor
];

var rugColors =[
    vec4(0.98, 0.95, 0.85, 1),
    vec4(0.98, 0.95, 0.85, 0.94),
    vec4(0.98, 0.95, 0.85, 0.94),
    vec4(0.98, 0.95, 0.85, 1),
    vec4(0.98, 0.95, 0.85, 0.97),
    vec4(0.98, 0.95, 0.85, 1),
];

var couchColors = [
    vec4(0.32,0.32,0.32,0.8),
    vec4(0.315,0.315,0.315,0.8),
    vec4(0.33,0.33,0.33,0.86),
    vec4(0.35,0.35,0.35,0.78),
    vec4(0.25,0.25,0.25,0.78),
    vec4(0.23,0.23,0.23,0.75),
];

var curtainColor = [
    vec4(0.5,0.5,0.5,0.7),
    vec4(0.4,0.4,0.4,0.7) ,
    vec4(0.5,0.5,0.5,0.64) ,
    vec4(0.5,0.5,0.5,0.7) ,
    vec4(0.5,0.5,0.5,0.65) ,
    vec4(0.5,0.5,0.5,0.7) ,
];

var curtainAccentColor = [
    vec4( 0.0, 0.0, 0.0, 0.3 ),
    vec4( 0.0, 0.0, 0.0, 0.3 ),
    vec4( 0.0, 0.0, 0.0, 0.3 ),
    vec4( 0.0, 0.0, 0.0, 0.3 ),
    vec4( 0.0, 0.0, 0.0, 0.3 ),
    vec4( 0.0, 0.0, 0.0, 0.3 ),
];

var coffeeTableColors =[
    vec4(0.6,0.5,0.4,0.7),      // lt brown? 16
    vec4(0.6,0.5,0.4,0.75),      // lt brown? 17
    vec4(0.6,0.5,0.4,0.7),      // lt brown? 16
    vec4(0.6,0.5,0.4,0.75),      // lt brown? 17
    vec4(0.6,0.5,0.4,0.7),      // lt brown? 16
    vec4(0.6,0.5,0.4,0.75),      // lt brown? 17
];

var coffeeTableColors2 =[
    vec4(0.6,0.5,0.4,0.75),      // lt brown? 16
    vec4(0.6,0.5,0.4,0.8),      // lt brown? 17
    vec4(0.6,0.5,0.4,0.75),      // lt brown? 16
    vec4(0.6,0.5,0.4,0.75),      // lt brown? 17
    vec4(0.6,0.5,0.4,0.8),      // lt brown? 16
    vec4(0.6,0.5,0.4,0.75),      // lt brown? 17
];

//------------------------------------------------------------------------------------------------
//*************************************************
//Program Starting Function
//*************************************************
window.onload = function init(){

    initCanvas();

    //Commented out unused buttons
    //document.getElementById("Button1").onclick = function(){perspective_near  *= 1.1; perspective_far *= 1.1;};
    //document.getElementById("Button2").onclick = function(){perspective_near *= 0.9; perspective_far *= 0.9;};
    //document.getElementById("Button3").onclick = function(){radius *= 2.0;};
    //document.getElementById("Button4").onclick = function(){radius *= 0.5;};
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
            eye = vec3(1.2,0.9,4.6);
            break;
        case 3:
            //fixed point
            eye = vec3(1.5,0.5,4.2);
            break;
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

    //create tiling**

    //Floor
    colorCube([-0.003,-0.19,2.0],[0.75,0.0125,0.63], floorColors);
    //back/right wall
    colorCube([0.0,0.05,2.3],[0.75,0.49,0.022], wallColors);
    //left wall
    colorCube([-0.38,0.05,2],[0.0125,0.5,0.6], wallColors);

    //***********
    //COUCH
    //**********
    colorCube([0.1, -0.1, 2.4],[0.5, 0.17, 0.025], couchColors); //frame back
    colorCube([0.1,-0.17,2.33],[0.5,0.025,0.17], couchColors);   // frame seat
    colorCube([-0.136,-0.13,2.3],[0.025,0.1,0.2],couchColors);    //left arm frame
    colorCube([0.34,-0.13,2.3],[0.025,0.1,0.2],couchColors);  //right arm frame
    colorCube([-0.02, -0.15,2.35],[0.245, 0.025, 0.17], couchColors);   //left seat cushion
    colorCube([0.23, -0.15,2.35],[0.245, 0.025, 0.17], couchColors);   //right seat cushion
    colorCube([-0.02,-0.09,2.42],[0.245,0.17,0.025],couchColors);   //left back cushion
    colorCube([0.23,-0.09,2.42],[0.245,0.17,0.025], couchColors);   //left back cushion
    colorHorizHeptagon([-0.145,-0.1,2.2],[0.01,0.01,0.4],couchColors); // leftarm rest
    colorHorizHeptagon([0.35,-0.1,2.4],[0.01,0.01,0.2],couchColors);  //right arm rest

    //************
    //RUG
    //************
    colorCube([0.09,-0.17,2.6],[0.35,0.002,0.2], rugColors);

    //************
    //COFFEE TABLE
    //************
    colorCube([0.09,-0.15,2.7],[0.25,0.015,0.1], coffeeTableColors); //bottom panel
    colorCube([0.09,-0.12,2.7],[0.25,0.015,0.1],coffeeTableColors);//top panel
    colorCube([-0.01,-0.14,2.8265],[0.02,0.03,0.015],coffeeTableColors2);  //left from support
    colorCube([0.085,-0.14,2.8265],[0.02,0.03,0.015],coffeeTableColors2);    //front middle support
    colorCube([0.19,-0.14,2.8265],[0.02,0.03,0.015],coffeeTableColors2);     //front front right
    colorCube([-0.01,-0.14,2.77],[0.02,0.03,0.015],coffeeTableColors2);  //left from support
    colorCube([0.085,-0.14,2.77],[0.02,0.03,0.015],coffeeTableColors2);    //front middle support
    colorCube([0.19,-0.14,2.77],[0.02,0.03,0.015],coffeeTableColors2);     //front front right

    colorHorizHeptagon([-0.02, -.18, 2.83],[0.005,0.005, 0.003],lampPostColorData); //front left wheel
    colorHorizHeptagon([0.19, -.18, 2.83],[0.005,0.005, 0.003],lampPostColorData); //front right wheel
    colorHorizHeptagon([-0.02, -.18, 2.78],[0.005,0.005, 0.003],lampPostColorData); //back left wheel
    colorHorizHeptagon([0.19, -.18, 2.78],[0.005,0.005, 0.003],lampPostColorData); //front right wheel

    //*************
    //WINDOW
    //*************
    colorCube([-0.373,0.13,2.6],[0.016,0.12,0.12], windowColors); //top left pane
    colorCube([-0.373,0.13,2.465],[0.016,0.12,0.12], windowColors); //top right pane
    colorCube([-0.373,0.005,2.465],[0.016,0.12,0.12], windowColors); //bottom right pane
    colorCube([-0.373,0.005,2.6],[0.016,0.12,0.12],windowColors); //top left pane

    //*************
    //CURTAINS
    //*************
    colorCube([-0.363,0.071,2.47],[0.005,0.3,0.05],curtainColor ); //right curtain
    colorCube([-0.363,0.071,2.73],[0.005,0.3,0.05],curtainColor); //left curtain
    //window frame (for highlight)
    colorCube([-0.374,0.069,2.35],[0.016,0.25,0.28], curtainAccentColor); //window accent

    //**************
    //CURTAIN ROD
    //**************
    colorHorizHeptagon([-0.368,0.205,2.5],[0.0035,0.0035,0.3],lampPostColorData)
    colorCube([-0.375,0.21,2.8],[0.03,0.01,0.01],lampPostColorData);    //left rod support
    colorCube([-0.375,0.21,2.48],[0.03,0.01,0.01],lampPostColorData);    //right rod support

    //*************
    //LAMP POST
    //**************
    colorHeptagon([-0.31,-0.2,2.39],[0.0025,0.3,0.0025],lampPostColorData); //Lamp post
    colorHeptagon([-0.31,-0.185,2.37],[0.01,0.01,0.01],lampPostColorData); //lamp foot
    colorHeptagon([-0.308,0.1,2.39],[0.005,0.027,0.005],lampPostColorData); //lamp head attachment
    colorHeptagon([-0.306,0.13,2.384],[0.01,0.08,0.01],lampShadeColor);//lamp shade




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

//*************************************************
//General Object Creation Functions
//*************************************************

function colorCube(pos, scale, color){

    quad( 1, 0, 3, 2, pos, scale, color);
    quad( 2, 3, 7, 6, pos, scale, color);
    quad( 3, 0, 4, 7, pos, scale, color);
    quad( 6, 5, 1, 2, pos, scale, color);
    quad( 4, 5, 6, 7, pos, scale, color);
    quad( 5, 4, 0, 1, pos, scale, color);
}//colorCube()

function colorHeptagon(pos, scale, color){

    //one heptagonal plane
    heptQuad(0, 1, 7, 6, pos, scale, color);
    heptQuad(0, 1, 2, 7, pos, scale, color);
    heptQuad(2,3,4,7, pos, scale, color);
    heptQuad(4, 5, 6, 7, pos, scale, color);
    //quares on outside of hept prism
    heptQuad(0, 1, 9, 8, pos, scale, color);
    heptQuad(1, 2, 10, 9, pos, scale, color);
    heptQuad(2, 3, 11, 10, pos, scale, color);
    heptQuad(3, 4, 12, 11, pos, scale, color);
    heptQuad(4, 5, 13, 12, pos, scale, color);
    heptQuad(5, 6, 14, 13, pos, scale, color);
    heptQuad(6, 0, 15, 14, pos, scale, color);
    //second heptagonal plane
    heptQuad(8, 9, 15, 14, pos, scale, color);
    heptQuad(8, 9, 10, 15, pos, scale, color);
    heptQuad(10,11,12,15, pos, scale, color);
    heptQuad(12, 13, 14, 15, pos, scale, color);
}//colorHeptagon()

function colorHorizHeptagon(pos, scale, color){

    //one heptagonal plane
    horizontalHeptQuad(0, 1, 7, 6, pos, scale, color);
    horizontalHeptQuad(0, 1, 2, 7, pos, scale, color);
    horizontalHeptQuad(2,3,4,7, pos, scale, color);
    horizontalHeptQuad(4, 5, 6, 7, pos, scale, color);
    //squares on outside of hept prism
    horizontalHeptQuad(0, 1, 9, 8, pos, scale, color);
    horizontalHeptQuad(1, 2, 10, 9, pos, scale, color);
    horizontalHeptQuad(2, 3, 11, 10, pos, scale, color);
    horizontalHeptQuad(3, 4, 12, 11, pos, scale, color);
    horizontalHeptQuad(4, 5, 13, 12, pos, scale, color);
    horizontalHeptQuad(5, 6, 14, 13, pos, scale, color);
    horizontalHeptQuad(6, 0, 15, 14, pos, scale, color);
    //second heptagonal plane
    horizontalHeptQuad(8, 9, 15, 14, pos, scale, color);
    horizontalHeptQuad(8, 9, 10, 15, pos, scale, color);
    horizontalHeptQuad(10,11,12,15, pos, scale, color);
    horizontalHeptQuad(12, 13, 14, 15, pos, scale, color);

}//colorHorizHeptagon()


function quad(a, b, c, d, position, scale, color) {

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
        vertexColors.push(color[i]);
    }
}//quad()


function heptQuad(a, b, c, d, position, scale, color){

    var inds = [ a, b, c, a, c, d ];

    for ( var i = 0; i < inds.length; ++i ) {
        let currPoint = heptagonData[inds[i]];
        let u;

        // This portion applies the manual scaling done in the function call
        u = scalem(scale[0], scale[1], scale[2]);
        currPoint = mult(u,currPoint);

        // this portion applies the manual positioning done in the function call
        u = translate(position[0], position[1], position[2]);
        currPoint = mult(u,currPoint);

        //these lines push the points to their respective arrays is preparation to be rendered
        vertexPoints.push( currPoint );
        vertexColors.push(color[i]);
    }
}//heptQuad()


function horizontalHeptQuad(a, b, c, d, position, scale, color){

    var inds = [ a, b, c, a, c, d ];

    for ( var i = 0; i < inds.length; ++i ) {
        let currPoint = horizontalHeptagonData[inds[i]];
        let u;

        // This portion applies the manual scaling done in the function call
        u = scalem(scale[0], scale[1], scale[2]);
        currPoint = mult(u,currPoint);

        // this portion applies the manual positioning done in the function call
        u = translate(position[0], position[1], position[2]);
        currPoint = mult(u,currPoint);

        //these lines push the points to their respective arrays is preparation to be rendered
        vertexPoints.push( currPoint );
        vertexColors.push(color[i]);
    }
}//horizontalHeptQuad()

//-------------END--------------------