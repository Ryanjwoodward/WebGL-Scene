/****************************************************************************************
 Author: Asher Shores, Cameron Verini, & Ryan Woodward
 Date:  6/26/2022
 Description: Project 8 assignment "demo scene" We are to create a 3D scene that demo's the skills
    we have garnered thus far in the class
 File: demoScene_310.js
 Dependencies: demoScene_310.html, webgl-utils.js, initShaders.js, MV.js
 *****************************************************************************************/

"use strict";

var gl;

var nRows = 100;
var nColumns = 100;
var x, y, z;

let myScale = 1;

let theScale;

let thetaSpeed = 0.01;
let phiSpeed = 0.01;
let xSpeed = 0.01;
let ySpeed = 0.01;
//let rSpeed = 0.01;




var pointsArray = [];

//This array/matrix thing is where the mesh is calculated, which is a giant 50 x 50 array:
var data = new Array(nRows);
var r = 1; //r is the radius

var fColor;

var near = -10;
var far = 10;
var radius = 6.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

let cv = 0.0, cv2 =0.0, cv3 = 0.0;

let color =  vec4(cv,cv2,cv3,1.0);
let rainbow = vec4(1.0, 0.0, 0.0, 1.0);

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var left = -4.0;
var right = 4.0;
var ytop = 2.0;
var bottom = -2.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var arrayOfColors =[
    vec4(1.0,0.0,0.0,1.0), //red
    vec4(0.0,1.0,0.0,1.0), //green
    vec4(0.0,0.0,1.0,1.0), //blue
    vec4(1.0,0.0,1.0,1.0), //purple
    vec4(0.0,1.0,1.0,1.0), //cyan
];

let cr = 0.01, colorCounter = 0;

function createObjs() {

    for (var i = 0; i < nRows; ++i) {

        var lon = i / nRows; //linear value representing the longitude in the range [0,1]
        lon = (lon * 2.0 - 1.0) * Math.PI; //Map this value from [0,1] tp [-Pi, pi]
        data[i] = new Array(nColumns);
        for (var j = 0; j < nColumns; ++j) {
            var lat = j / nColumns; //Calculate linear value representing latitude in range [0,1]
            lat = (lat * 2.0 - 1.0) * Math.PI; //Now, map [0,1] to [-PI/2, PI/2]

            //CRAZY DONUT
            x = (r * Math.cos(lat) + Math.cos(lon));
            y = (r * Math.sin(lat) + Math.sin(lon));
            z = r * Math.cos(lat);

            pointsArray.push(vec4(x, y, z, 1.0));
        }
    }
}

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    createObjs();

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.2, 0.2, 0.2, 1.0 ); //canvas background color
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(2.0, 2.0);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    fColor = gl.getUniformLocation(program, "fColor");
    theScale = gl.getUniformLocation(program, "myScale");

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    //Adding listeners for buttons for each type of movement
    //Changing theta speed
    document.getElementById( "posThetaSpeed" ).onclick = function () {
        thetaSpeed += 0.01;
    };
    document.getElementById( "negThetaSpeed" ).onclick = function () {
        thetaSpeed -= 0.01;
    };

    //Changing Phi speed
    document.getElementById( "posPhiSpeed" ).onclick = function () {
        phiSpeed += 0.01;
    };
    document.getElementById( "negPhiSpeed" ).onclick = function () {
        phiSpeed -= 0.01;
    };

    //changing X speed
    document.getElementById( "posXSpeed" ).onclick = function () {
        xSpeed += 0.01;
    };
    document.getElementById( "negXSpeed" ).onclick = function () {
        xSpeed -= 0.01;
    };

    //changing Y speed
    document.getElementById( "posYSpeed" ).onclick = function () {
        ySpeed += 0.01;
    };
    document.getElementById( "negYSpeed" ).onclick = function () {
        ySpeed -= 0.01;
    };

    document.getElementById("slider").onchange = function(event) {
        myScale = event.target.value;
        console.log(myScale);
    };

    render();
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta += thetaSpeed;
   phi += phiSpeed;

    ytop += ySpeed;
    bottom += ySpeed;
    right += xSpeed;
    left += xSpeed;
    radius += (cr)*2

    //causes part of the donut to disappear
    if(radius >= 9){
        cr *= 0.01;
    }else{
        cr *= -0.01;
    }

    //causes the donut to go up and down
    if(ytop > 2.8){
        ySpeed *= -1;
    }else if(ytop < 1.5){
        ySpeed *= -1;
    }

    //causes the donut to move left and right
    if(right > 6.8){
        xSpeed *= -1;
    }else if(right < 1.0){
        xSpeed *= -1;
    }

    gl.uniform1f(theScale, myScale/(Math.sin(phi)/2+0.6));

    rainbow = vec4(Math.sin(theta)/2+0.5, Math.sin(theta+Math.PI*2/3)/2+0.5, Math.sin(theta+Math.PI*4/3)/2+0.5, 1.0);

    var eye = vec3( radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi),
        radius*Math.cos(theta));

    var modelViewMatrix = lookAt( eye, at, up );
    var projectionMatrix = ortho( left, right, bottom, ytop, near, far );

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    //assigns a new color vector to each column
    for(var i=0; i<pointsArray.length; i+=4) {
        colorCounter++;
        if(colorCounter == 5){colorCounter = 0;}

        gl.uniform4fv(fColor, arrayOfColors[colorCounter]);
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 ); //originally trianges
        gl.uniform4fv(fColor, (rainbow));
        gl.drawArrays( gl.LINE_LOOP, i, 4 );
    }

    requestAnimFrame(render);
}