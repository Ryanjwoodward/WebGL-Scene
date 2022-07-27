/*           gemometry.js

    Simple geometry package using MV.js
    Supports:

            cube object
            cylinder object
            sphere object

            material object
            light object

            texture object
*/

"use strict";

function curtainMesh(c){
    var data = {};

    var color;
    if (!c) color = [0,0,0,1]; //Default to black
    else color = c;


    var meshTriangleVertices = [];
    var meshVertexColors = [];
    var normals = [];

    var nRows = 200;
    var nColumns = 200;

// data for radial hat function: sin(Pi*r)/(Pi*r)


    let tAngle = 0;
    let pAngle = 0;

    let x = 0;
    let y = 0;
    let z = 0;

    for (let i = 0; i < nRows; i++){
        pAngle = i / nRows * 2 * Math.PI;
        for (let j = 0; j < nColumns; j++){
            tAngle = j / nRows * 2 * Math.PI;
            x = Math.sin(pAngle) * Math.cos(tAngle);
            y = -Math.pow(pAngle, Math.pow(2, pAngle)) + 1;
            z = (Math.sin(pAngle) * Math.sin(tAngle));

            if (y > 0){
                meshTriangleVertices = meshTriangleVertices.concat([x,y,z,1.0]);

                meshVertexColors = meshVertexColors.concat(color);
            }/*
            else if (y > -0.8){
                y *= 1.1;
                meshTriangleVertices = meshTriangleVertices.concat([x,y,z,1.0]);

                meshVertexColors = meshVertexColors.concat(color);
            }*/
        }
    }
    /*
    // PLACEHOLDER NORMALS!! All are [1,0,0]. Must make loop find planes from TRIANGLE_FAN and get perpendicular vector
    // Then normalize it
    var vertLength = meshTriangleVertices.length/3;
    for (let k = 0; k < vertLength; k++) {
        normals = normals.concat([1,0,0]);
    }*/
    // Actual algorithm to find all normals
    for (let k = 0; k < meshTriangleVertices.length; k++){
        if (k % 8 == 0 && k != 0){
            var u = [(meshTriangleVertices[k-5])-(meshTriangleVertices[k-8]),(meshTriangleVertices[k-4])-(meshTriangleVertices[k-7]), (meshTriangleVertices[k-3])-(meshTriangleVertices[k-6])];
            var v = [(meshTriangleVertices[k-2])-(meshTriangleVertices[k-8]),(meshTriangleVertices[k-1])-(meshTriangleVertices[k-7]), (meshTriangleVertices[k])-(meshTriangleVertices[k-6])];
            //do cross product

            var normal = [
                u[1]*v[2] - u[2]*v[1],
                u[2]*v[0] - u[0]*v[2],
                u[0]*v[1] - u[1]*v[0]
            ];

            //find magnitude of resulting vector
            var mag = Math.sqrt(normal[0]*normal[0] + normal[1]*normal[1] + normal[2]*normal[2])
            //Normalize it
            normal = [normal[0]/mag, normal[1]/mag, normal[2]/mag]; //THINKS I'M DIVIDING BY 0


            //store it
            for (let z = 0; z < 1; z++) {
                normals.push(normal[0], normal[1], normal[2]);
            }
        }
    }
    console.log("COMPARE!" , normals.length, meshTriangleVertices.length);

    function translate(i, j, k){

        for(var l =0; l<meshTriangleVertices.length; l++) {
            if (l % 3 == 0){
                meshTriangleVertices[l] += i;
            }
            else if (l % 3 == 1){
                meshTriangleVertices[l] += j;
            }
            else {
                meshTriangleVertices[l] += k;
            }
        }
        };

    data.TriangleVertices = meshTriangleVertices;
    data.TriangleVertexColors = meshVertexColors;
    data.TriangleNormals = normals;
    data.translate = translate;
    return data;
}

function cube(s,c) {

    var data = {};

    var size;
    if (!s) size = 0.5;
    else size = s/2;

    var color;
    if (!c) color = [0,0,0,1]; //Default to black
    else color = c;



    var cubeVertices = [
        [ -size, -size,  size, 1.0 ],
        [ -size,  size,  size, 1.0 ],
        [  size, size, size, 1.0 ],
        [  size, -size,  size, 1.0 ],
        [ -size, -size, -size, 1.0 ],
        [ -size,  size, -size, 1.0 ],
        [ size,  size, -size, 1.0  ],
        [ size, -size, -size, 1.0 ]
    ];

    var cubeFaceNormals = [
        [ 0, 0, 1],
        [ 1, 0, 0],
        [ 0, -1, 0],
        [ 0, 1, 0],
        [ 0, 0, -1],
        [ -1 , 0, 0]
    ];

    var cubeIndices = [

        [ 1, 0, 3, 2],
        [ 2, 3, 7, 6],
        [ 3, 0, 4, 7],
        [ 6, 5, 1, 2],
        [ 4, 5, 6, 7],
        [ 5, 4, 0, 1]
    ];

    //Condensed code because all sides are the same color
    var cubeVertexColors = [];
    for (i = 0; i < 8; i++){
        cubeVertexColors = cubeVertexColors.concat([color]);
    }


    var cubeElements = [ //Storing the order in which triangles are built using gl.TRIANGLES
        1, 0, 3,
        3, 2, 1,

        2, 3, 7,
        7, 6, 2,

        3, 0, 4,
        4, 7, 3,

        6, 5, 1,
        1, 2, 6,

        4, 5, 6,
        6, 7, 4,

        5, 4, 0,
        0, 1, 5
    ];

    var cubeTexElements = [
        1, 0, 3,
        3, 2, 1,

        1, 0, 3,
        3, 2, 1,

        0, 1, 2,
        2, 3, 0,

        2, 1, 0,
        0, 3, 2,

        3, 2, 1,
        1, 0, 3,

        2, 3, 0,
        0, 1, 2
    ];

    var cubeNormalElements = [  //6 SETS OF SOMETHING! Cube has 6 faces. Correlation? This is needed to make TriangleNormals
        0, 0, 0,
        0, 0, 0,
        1, 1, 1,
        1, 1, 1,
        2, 2, 2,
        2, 2, 2,
        3, 3, 3,
        3, 3, 3,
        4, 4, 4,
        4, 4, 4,
        5, 5, 5,
        5, 5, 5

    ];

    var faceTexCoord = [
        [ 0, 0],
        [ 0, 1],
        [ 1, 1],
        [ 1, 0]
    ];

    var cubeTriangleVertices = [];
    var cubeTriangleVertexColors = [];
    var cubeTriangleFaceColors = [];
    var cubeTextureCoordinates = [];
    var cubeTriangleNormals = [];

    for ( var i = 0; i < cubeElements.length; i++ ) {
        cubeTriangleVertices.push( cubeVertices[cubeElements[i]] );
        cubeTriangleVertexColors.push( cubeVertexColors[cubeElements[i]] );
        cubeTextureCoordinates.push( faceTexCoord[cubeTexElements[i]]);
        cubeTriangleNormals.push(cubeFaceNormals[cubeNormalElements[i]]); //WHAT IS THIS DOING?

    }
    //alert(cubeTriangleNormals.length);

    for ( var i = 0; i < cubeElements.length; i++ ) {
        cubeTriangleFaceColors[i] = cubeVertexColors[1+Math.floor((i/6))];
    }


    function translate(x, y, z){

        for(i=0; i<cubeVertices.length; i++) {
            cubeVertices[i][0] += x;
            cubeVertices[i][1] += y;
            cubeVertices[i][2] += z;
        };
        /*
        for(i=0; i<cubeTriangleVertices.length; i++) {
          cubeTriangleVertices[i][0] += x;
          cubeTriangleVertices[i][1] += y;
          cubeTriangleVertices[i][2] += z;
        };
     */
        //console.log(cubeVertices.length);
        //console.log(cubeTriangleVertices.length);
    }

    function scale(sx, sy, sz){

        for(i=0; i<cubeVertices.length; i++) {
            cubeVertices[i][0] *= sx;
            cubeVertices[i][1] *= sy;
            cubeVertices[i][2] *= sz;
        };
        for(i=0; i<cubeFaceNormals.length; i++) {
            cubeFaceNormals[i][0] /= sx;
            cubeFaceNormals[i][1] /= sy;
            cubeFaceNormals[i][2] /= sz;
        };

        /*
            for(i=0; i<cubeTriangleVertices.length; i++) {
                cubeTriangleVertices[i][0] *= sx;
                cubeTriangleVertices[i][1] *= sy;
                cubeTriangleVertices[i][2] *= sz;
                cubeTriangleNormals[i][0] /= sx;
                cubeTriangleNormals[i][1] /= sy;
                cubeTriangleNormals[i][2] /= sz;
            };
        */
    }

    function radians( degrees ) {
        return degrees * Math.PI / 180.0;
    }

    function rotate( angle, axis) {

        var d = Math.sqrt(axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2]);

        var x = axis[0]/d;
        var y = axis[1]/d;
        var z = axis[2]/d;

        var c = Math.cos( radians(angle) );
        var omc = 1.0 - c;
        var s = Math.sin( radians(angle) );

        var mat = [
            [ x*x*omc + c,   x*y*omc - z*s, x*z*omc + y*s ],
            [ x*y*omc + z*s, y*y*omc + c,   y*z*omc - x*s ],
            [ x*z*omc - y*s, y*z*omc + x*s, z*z*omc + c ]
        ];

        for(i=0; i<cubeVertices.length; i++) {
            var t = [0, 0, 0];
            for( var j =0; j<3; j++)
                for( var k =0 ; k<3; k++)
                    t[j] += mat[j][k]*cubeVertices[i][k];
            for( var j =0; j<3; j++) cubeVertices[i][j] = t[j];
        };


        for(i=0; i<cubeFaceNormals.length; i++) {
            var t = [0, 0, 0];
            for( var j =0; j<3; j++)
                for( var k =0 ; k<3; k++)
                    t[j] += mat[j][k]*cubeFaceNormals[i][k];
            for( var j =0; j<3; j++) cubeFaceNormals[i][j] = t[j];
        };

    }


    data.Indices = cubeIndices;
    data.VertexColors = cubeVertexColors;
    data.Vertices = cubeVertices;
    data.Elements = cubeElements;
    data.FaceNormals = cubeFaceNormals;
    data.TextureCoordinates = cubeTextureCoordinates;
    data.TriangleVertices = cubeTriangleVertices;
    data.TriangleVertexColors = cubeTriangleVertexColors;
    data.TriangleFaceColors = cubeTriangleFaceColors;
    data.TriangleNormals = cubeTriangleNormals;
    data.translate = translate;
    data.scale = scale;
    data.rotate = rotate;

    return data;

}


//________________________________________________________
// Pyramid object
function pyramid(s, c){
    var data = {};

    var size;
    if (!s) size = 0.5;
    else size = s/2;

    var color;
    if (!c) color = [0,0,0,1]; //Default to black
    else color = c;

    var pyramidVertices = [
        //4 vertices of bottom square
        [ -size, -size, -size, 1.0 ],
        [ -size,  -size, size, 1.0 ],
        [ size,  -size, size, 1.0  ],
        [ size, -size, -size, 1.0 ],
        //tip of pyramid
        [ 0, size, 0, 1.0],
    ];

    var pyramidFaceNormals = [
        [ 0, 0, 1],


        [ Math.sqrt(2), Math.sqrt(2), 0], //Up to the right
        [ -Math.sqrt(2), Math.sqrt(2), 0], //Up to the left
        [ 0, Math.sqrt(2), Math.sqrt(2)], //Up forward
        [ 0, Math.sqrt(2), -Math.sqrt(2)], //Up back
      //  [ -1 , 0, 0]
    ];


    //Condensed code because all sides are the same color
    var pyramidVertexColors = [];
    for (i = 0; i < 5; i++){
        pyramidVertexColors = pyramidVertexColors.concat([color]);
    }


    //Instructing webgl how to form the triangles in the draw.Arrays! ORDER MATTERS
    var pyramidElements = [
        //First two construct bottom of pyramid
        0, 1, 2,
        2, 3, 0,

        //Triangles connecting from base to the pyramid's tip
        0, 4, 1,

        1, 4, 2,

        2, 4, 3,

        3, 4, 0,
    ];

    var pyramidNormalElements = [
        0, 0, 0,
        0, 0, 0,
        1, 1, 1,
        1, 1, 1,
        2, 2, 2,
        2, 2, 2,
        3, 3, 3,
        3, 3, 3,
        4, 4, 4,
        4, 4, 4,
      //  5, 5, 5,
      //  5, 5, 5

    ];

    var pyramidTriangleVertices = [];
    var pyramidTriangleVertexColors = [];
    var pyramidTriangleNormals = [];


    for (var i = 0; i < pyramidElements.length; i++){
        pyramidTriangleVertices.push( pyramidVertices[pyramidElements[i]] );
        pyramidTriangleVertexColors.push( pyramidVertexColors[pyramidElements[i]] );
        pyramidTriangleNormals.push(pyramidFaceNormals[pyramidNormalElements[i]]);
    };


    function translate(x,y,z){
        for (i = 0; i < pyramidVertices.length; i++){
            pyramidVertices[i][0] += x;
            pyramidVertices[i][1] += y;
            pyramidVertices[i][2] += z;
        };
    }

    data.VertexColors = pyramidVertexColors;
    data.Vertices = pyramidVertices;
    data.Elements = pyramidElements;
    data.TriangleVertices = pyramidTriangleVertices;
    data.TriangleVertexColors = pyramidTriangleVertexColors;
    data.FaceNormals = pyramidFaceNormals;
    data.TriangleNormals = pyramidTriangleNormals;
    data.translate = translate;
    return data;
}

//_________________________________________________________

/*     Cylinder Object

      Usage: var myCylinder = cylinder(numSlices, numStacks, caps);

      Cylinder aligned with y-axis with base on plane y = 0

      slices = divisions around cylinder
      stacks = divisions along y
      caps = true then generate top and bottom caps

      default: cylinder(36, 1, true)

      Attributes:  The following each have  values for rendering the triangles
                    comprising the cylinder

                  TextureCoordinates
                  TriangleVertices
                  TriangleVertexColors
                  TriangleFaceColors
                  TriangleNormals

      Methods:

                  translate(dx, dy, dz)
                  scale(sz, sy, sz)
                  rotate(angle, [axisx, axisy, axisz])


*/

function cylinder(numSlices, numStacks, caps,c) {

    var slices = 36;
    if(numSlices) slices = numSlices;
    var stacks = 1;
    if(numStacks) stacks = numStacks;
    var capsFlag = true;
    if(caps==false) capsFlag = caps;

    var data = {};

    var top = 2;
    var bottom = 0;
    var radius = 0.5;
    var topCenter = [0.0, top, 0.0];
    var bottomCenter = [0.0, bottom, 0.0];

    var color;
    if (!c) color = [0,0,0,1]; //Default to black
    else color = c;


    var sideColor = color;
    var topColor = color;
    var bottomColor = color;


    var cylinderVertexCoordinates = [];
    var cylinderNormals = [];
    var cylinderVertexColors = [];
    var cylinderTextureCoordinates = [];

// side

    for(var j=0; j<stacks; j++) {
        var stop = bottom + (j+1)*(top-bottom)/stacks;
        var sbottom = bottom + j*(top-bottom)/stacks;
        var topPoints = [];
        var bottomPoints = [];
        var topST = [];
        var bottomST = [];
        for(var i =0; i<slices; i++) {
            var theta = 2.0*i*Math.PI/slices;
            topPoints.push([radius*Math.sin(theta), stop, radius*Math.cos(theta), 1.0]);
            bottomPoints.push([radius*Math.sin(theta), sbottom, radius*Math.cos(theta), 1.0]);
        };

        topPoints.push([0.0, stop, radius, 1.0]);
        bottomPoints.push([0.0,  sbottom, radius, 1.0]);


        for(var i=0; i<slices; i++) {
            var a = topPoints[i];
            var d = topPoints[i+1];
            var b = bottomPoints[i];
            var c = bottomPoints[i+1];
            var u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]]; //Getting distance from top to bottom
            var v = [c[0]-b[0], c[1]-b[1], c[2]-b[2]];

            var normal = [ //One normal vector
                u[1]*v[2] - u[2]*v[1],
                u[2]*v[0] - u[0]*v[2],
                u[0]*v[1] - u[1]*v[0]
            ];

            //turn it in to a unit vector
            var mag = Math.sqrt(normal[0]*normal[0] + normal[1]*normal[1] + normal[2]*normal[2])
            normal = [normal[0]/mag, normal[1]/mag, normal[2]/mag];
            cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
            cylinderVertexColors.push(sideColor);
            cylinderNormals.push([normal[0], normal[1], normal[2]]);
            cylinderTextureCoordinates.push([(i+1)/slices, j*(top-bottom)/stacks]);

            cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
            cylinderVertexColors.push(sideColor);
            cylinderNormals.push([normal[0], normal[1], normal[2]]);
            cylinderTextureCoordinates.push([i/slices, (j-1)*(top-bottom)/stacks]);

            cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
            cylinderVertexColors.push(sideColor);
            cylinderNormals.push([normal[0], normal[1], normal[2]]);
            cylinderTextureCoordinates.push([(i+1)/slices, (j-1)*(top-bottom)/stacks]);

            cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
            cylinderVertexColors.push(sideColor);
            cylinderNormals.push([normal[0], normal[1], normal[2]]);
            cylinderTextureCoordinates.push([(i+1)/slices, j*(top-bottom)/stacks]);

            cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
            cylinderVertexColors.push(sideColor);
            cylinderNormals.push([normal[0], normal[1], normal[2]]);
            cylinderTextureCoordinates.push([(i+1)/slices, (j-1)*(top-bottom)/stacks]);

            cylinderVertexCoordinates.push([d[0], d[1], d[2], 1.0]);
            cylinderVertexColors.push(sideColor);
            cylinderNormals.push([normal[0], normal[1], normal[2]]);
            cylinderTextureCoordinates.push([(i+1)/slices, j*(top-bottom)/stacks]);
        };
    };

    var topPoints = [];
    var bottomPoints = [];
    for(var i =0; i<slices; i++) {
        var theta = 2.0*i*Math.PI/slices;
        topPoints.push([radius*Math.sin(theta), top, radius*Math.cos(theta), 1.0]);
        bottomPoints.push([radius*Math.sin(theta), bottom, radius*Math.cos(theta), 1.0]);
    };
    topPoints.push([0.0, top, radius, 1.0]);
    bottomPoints.push([0.0,  bottom, radius, 1.0]);

    if(capsFlag) {

//top

        for(i=0; i<slices; i++) {
            normal = [0.0, 1.0, 0.0];
            var a = [0.0, top, 0.0, 1.0];
            var b = topPoints[i];
            var c = topPoints[i+1];
            cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
            cylinderVertexColors.push(topColor);
            cylinderNormals.push(normal);
            cylinderTextureCoordinates.push([0, 1]);

            cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
            cylinderVertexColors.push(topColor);
            cylinderNormals.push(normal);
            cylinderTextureCoordinates.push([0, 1]);

            cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
            cylinderVertexColors.push(topColor);
            cylinderNormals.push(normal);
            cylinderTextureCoordinates.push([0, 1]);
        };

//bottom

        for(i=0; i<slices; i++) {
            normal = [0.0, -1.0, 0.0];
            var a = [0.0, bottom, 0.0, 1.0];
            var b = bottomPoints[i];
            var c = bottomPoints[i+1];
            cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
            cylinderVertexColors.push(bottomColor);
            cylinderNormals.push(normal);
            cylinderTextureCoordinates.push([0, 1]);

            cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
            cylinderVertexColors.push(bottomColor);
            cylinderNormals.push(normal);
            cylinderTextureCoordinates.push([0, 1]);

            cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
            cylinderVertexColors.push(bottomColor);
            cylinderNormals.push(normal);
            cylinderTextureCoordinates.push([0, 1]);
        };

    };
    function translate(x, y, z){
        topCenter[0] += x;
        topCenter[1] += y;
        topCenter[2] += z;

        bottomCenter[0] += x;
        bottomCenter[1] += y;
        bottomCenter[2] += z;
        for(var i=0; i<cylinderVertexCoordinates.length; i++) {
            cylinderVertexCoordinates[i][0] += x;
            cylinderVertexCoordinates[i][1] += y;
            cylinderVertexCoordinates[i][2] += z;
        };
    }

    function scale(sx, sy, sz){
        topCenter[0] *= sx;
        topCenter[1] *= sy;
        topCenter[2] *= sz;

        bottomCenter[0] *= sx;
        bottomCenter[1] *= sy;
        bottomCenter[2] *= sz;
        for(var i=0; i<cylinderVertexCoordinates.length; i++) {
            cylinderVertexCoordinates[i][0] *= sx;
            cylinderVertexCoordinates[i][1] *= sy;
            cylinderVertexCoordinates[i][2] *= sz;
            cylinderNormals[i][0] /= sx;
            cylinderNormals[i][1] /= sy;
            cylinderNormals[i][2] /= sz;
        };
    }

    function radians( degrees ) {
        return degrees * Math.PI / 180.0;
    }

    function rotate( angle, axis) {

        var d = Math.sqrt(axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2]);

        var x = axis[0]/d;
        var y = axis[1]/d;
        var z = axis[2]/d;

        var c = Math.cos( radians(angle) );
        var omc = 1.0 - c;
        var s = Math.sin( radians(angle) );

        var mat = [
            [ x*x*omc + c,   x*y*omc - z*s, x*z*omc + y*s ],
            [ x*y*omc + z*s, y*y*omc + c,   y*z*omc - x*s ],
            [ x*z*omc - y*s, y*z*omc + x*s, z*z*omc + c ]
        ];

        for(var i=0; i<cylinderVertexCoordinates.length; i++) {
            var u = [0, 0, 0];
            var v = [0, 0, 0];
            for( var j =0; j<3; j++)
                for( var k =0 ; k<3; k++) {
                    u[j] += mat[j][k]*cylinderVertexCoordinates[i][k];
                    v[j] += mat[j][k]*cylinderNormals[i][k];
                };
            for( var j =0; j<3; j++) {
                cylinderVertexCoordinates[i][j] = u[j];
                cylinderNormals[i][j] = v[j];
            };
        };

        var reference = [topCenter, bottomCenter];
        for(var i=0; i<reference.length; i++) {
            var u = [0, 0, 0];
            var v = [0, 0, 0];
            for( var j =0; j<3; j++)
                for( var k =0 ; k<3; k++) {
                    u[j] += mat[j][k]*reference[i][k];
                    //v[j] += mat[j][k]*cylinderNormals[i][k];
                };
            for( var j =0; j<3; j++) {
                reference[i][j] = u[j];
                //cylinderNormals[i][j] = v[j];
            };
        };
        topCenter = reference[0];
        bottomCenter = reference[1];
    }


    data.top = topCenter;
    data.bottom = bottomCenter;
    data.TriangleVertices = cylinderVertexCoordinates;
    data.TriangleNormals = cylinderNormals;
    data.TriangleVertexColors = cylinderVertexColors;
    data.TextureCoordinates = cylinderTextureCoordinates;
    data.rotate = rotate;
    data.translate = translate;
    data.scale = scale;

    return data;

}

//_____________________________________________________________


/*    Sphere object

      Usage: var mySphere = sphere(numSubdivisions);

      Sphere of radius 0.5 generated by recursive subdivision of tetrahedron
        producing 4**(numsubdivisions+1) triangles

     default: sphere(3)

      Attributes:  The following each have  values for rendering the triangles
              apporoximating the sphere

            TextureCoordinates
            TriangleVertices
            TriangleVertexColors
            TriangleFaceColors
            TriangleNormals

Methods:

            translate(dx, dy, dz)
            scale(sz, sy, sz)
            rotate(angle, [axisx, axisy, axisz])


*/

function sphere(numSubdivisions, c) {

    var subdivisions = 3;
    if(numSubdivisions) subdivisions = numSubdivisions;


    var data = {};


    var color;
    if (!c) color = [0,0,0,1]; //Default to black
    else color = c;

//var radius = 0.5;

    var sphereVertexCoordinates = [];
    var sphereVertexCoordinatesNormals = [];
    var sphereVertexColors = [];
    var sphereTextureCoordinates = [];
    var sphereNormals = [];

    var va = vec4(0.0, 0.0, -1.0,1);
    var vb = vec4(0.0, 0.942809, 0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4(0.816497, -0.471405, 0.333333,1);

    function triangle(a, b, c) {

        sphereVertexCoordinates.push([a[0],a[1], a[2], 1]);
        sphereVertexCoordinates.push([b[0],b[1], b[2], 1]);
        sphereVertexCoordinates.push([c[0],c[1], c[2], 1]);

        // normals are vectors

        sphereNormals.push([a[0],a[1], a[2]]);
        sphereNormals.push([b[0],b[1], b[2]]);
        sphereNormals.push([c[0],c[1], c[2]]);

        sphereVertexColors.push(color);
        sphereVertexColors.push(color);
        sphereVertexColors.push(color);

        sphereTextureCoordinates.push([0.5*Math.acos(a[0])/Math.PI, 0.5*Math.asin(a[1]/Math.sqrt(1.0-a[0]*a[0]))/Math.PI]);
        sphereTextureCoordinates.push([0.5*Math.acos(b[0])/Math.PI, 0.5*Math.asin(b[1]/Math.sqrt(1.0-b[0]*b[0]))/Math.PI]);
        sphereTextureCoordinates.push([0.5*Math.acos(c[0])/Math.PI, 0.5*Math.asin(c[1]/Math.sqrt(1.0-c[0]*c[0]))/Math.PI]);

        //sphereTextureCoordinates.push([0.5+Math.asin(a[0])/Math.PI, 0.5+Math.asin(a[1])/Math.PI]);
        //sphereTextureCoordinates.push([0.5+Math.asin(b[0])/Math.PI, 0.5+Math.asin(b[1])/Math.PI]);
        //sphereTextureCoordinates.push([0.5+Math.asin(c[0])/Math.PI, 0.5+Math.asin(c[1])/Math.PI]);

    }



    function divideTriangle(a, b, c, count) {
        if ( count > 0 ) {

            var ab = mix( a, b, 0.5);
            var ac = mix( a, c, 0.5);
            var bc = mix( b, c, 0.5);

            ab = normalize(ab, true);
            ac = normalize(ac, true);
            bc = normalize(bc, true);

            divideTriangle( a, ab, ac, count - 1 );
            divideTriangle( ab, b, bc, count - 1 );
            divideTriangle( bc, c, ac, count - 1 );
            divideTriangle( ab, bc, ac, count - 1 );
        }
        else {
            triangle( a, b, c );
        }
    }


    function tetrahedron(a, b, c, d, n) {
        divideTriangle(a, b, c, n);
        divideTriangle(d, c, b, n);
        divideTriangle(a, d, b, n);
        divideTriangle(a, c, d, n);
    }

    tetrahedron(va, vb, vc, vd, subdivisions);


    function translate(x, y, z){
        for(var i=0; i<sphereVertexCoordinates.length; i++) {
            sphereVertexCoordinates[i][0] += x;
            sphereVertexCoordinates[i][1] += y;
            sphereVertexCoordinates[i][2] += z;
        };
    }

    function scale(sx, sy, sz){
        for(var i=0; i<sphereVertexCoordinates.length; i++) {
            sphereVertexCoordinates[i][0] *= sx;
            sphereVertexCoordinates[i][1] *= sy;
            sphereVertexCoordinates[i][2] *= sz;
            sphereNormals[i][0] /= sx;
            sphereNormals[i][1] /= sy;
            sphereNormals[i][2] /= sz;
        };
    }

    function radians( degrees ) {
        return degrees * Math.PI / 180.0;
    }

    function rotate( angle, axis) {

        var d = Math.sqrt(axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2]);

        var x = axis[0]/d;
        var y = axis[1]/d;
        var z = axis[2]/d;

        var c = Math.cos( radians(angle) );
        var omc = 1.0 - c;
        var s = Math.sin( radians(angle) );

        var mat = [
            [ x*x*omc + c,   x*y*omc - z*s, x*z*omc + y*s ],
            [ x*y*omc + z*s, y*y*omc + c,   y*z*omc - x*s ],
            [ x*z*omc - y*s, y*z*omc + x*s, z*z*omc + c ]
        ];

        for(var i=0; i<sphereVertexCoordinates.length; i++) {
            var u = [0, 0, 0];
            var v = [0, 0, 0];
            for( var j =0; j<3; j++)
                for( var k =0 ; k<3; k++) {
                    u[j] += mat[j][k]*sphereVertexCoordinates[i][k];
                    v[j] += mat[j][k]*sphereNormals[i][k];
                };
            for( var j =0; j<3; j++) {
                sphereVertexCoordinates[i][j] = u[j];
                sphereNormals[i][j] = v[j];
            };
        };
    }
//for(var i =0; i<sphereVertexCoordinates.length; i++) console.log(sphereTextureCoordinates[i]);

    data.TriangleVertices = sphereVertexCoordinates;
    data.TriangleNormals = sphereNormals;
    data.TriangleVertexColors = sphereVertexColors;
    data.TextureCoordinates = sphereTextureCoordinates;
    data.rotate = rotate;
    data.translate = translate;
    data.scale = scale;
    return data;

}

//______________________________________________________________________

/*
          Gold Colored materialAmbient

          Useage: myMaterial = goldMaterial();
*/

function goldMaterial() {
    var data  = {};
    data.materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
    data.materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
    data.materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
    data.materialShininess = 100.0;
    return data;
}

//_________________________________________________________________________________

/*
          Light Object

          Usage: var myLight = light0()

          Distant light with ambient, diffuse and specular components
*/
function light0() {
    var data = {};
    data.lightPosition = [0.0, 0.0, 10.0, 0.0 ];;
    data.lightAmbient = [0.2, 0.2, 0.2, 1.0 ];
    data.lightDiffuse = [ 1.0, 1.0, 1.0, 1.0 ];
    data.lightSpecular = [1.0, 1.0, 1.0, 1.0 ];
    data.lightShineness = 10;
    return data;
}

//_________________________________________________________________________________

/*
      Checkerboard texture

      Usage: var myTexture = checkerboardTexture(size, rows, columns)

      creates a size x size texture with a checkerboard of nrows x ncolumns

      default: checkerboard(128, 8 8)
*/


function checkerboardTexture(size, rows, columns)
{
    var texSize = 128;
    if(size)  texSize = size;

    var nrows = 8;
    if(rows) nrows = rows;
    var ncolumns = nrows;
    if(columns) ncolumns = columns;

    // Create a checkerboard pattern using floats

    var image = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ )
        for ( var j = 0; j < texSize; j++ ) {
            var patchx = Math.floor(i/(texSize/ncolumns));
            var patchy = Math.floor(j/(texSize/nrows));

            var c = (patchx%2 !== patchy%2 ? 255 : 0);

            image[4*i*texSize+4*j] = c;
            image[4*i*texSize+4*j+1] = c;
            image[4*i*texSize+4*j+2] = c;
            image[4*i*texSize+4*j+3] = 255;
        }

    var texture = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    return texture;
}