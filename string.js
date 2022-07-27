//I want to die

//making da colors
let black = [0,0,0,1];
let red = [1,0,0,1];
let green = [0,1,0,1];
let brown = [107/256, 60/256, 26/256, 1];
let sphereBrown = [90/256, 50/256, 26/256, 1];
let darkGreen = [39/256, 110/256, 60/256, 1]
let blu = [54/256, 217/256, 219/256, 1];
let brown2 = [101/256, 68/256, 32/256, 1];
let sunYellow = [230/256, 210/256, 60/256, 1];
let treeGreen = [32/256, 118/256, 65/256, 1]


//creating the scenery
polycylinder(darkGreen, 2.5, -1, -2.5, 5, 0, 0, 90, darkGreen);

polycylinder(blu, 2.5, 1, -3, 6, 0, 0, 90, blu);

// Sun
polycylinder(blu, -1.4, 1.3, 0, 0.4, 110, 30, 0, sunYellow);



//abomination numba one
let createString1 = function(i, string, degrees, x, y, z, scale) {

    let len = string.length;
    let newString = string;
    let s = scale;
    let start = '';
    let end = '';

    let stupidString = '[&F$F/F%F]F[&F]$';
    let evenStupiderString = '[&F][&F&]';

    for (let i = 0; i < len; i++) {
        if (newString[i] === 'F') {
            start = newString.substring(0, i+1);
            end = newString.substring(i+1, len);
            newString = start + stupidString + end;
            let hell = stupidString.length;
            len += hell; // add the length of stupidString
            i += hell; // add the length of stupidString
        }
        if (newString[i] === '&') {
            start = newString.substring(0, i+1);
            end = newString.substring(i+1, len);
            newString = start + evenStupiderString + end;
            let hell = evenStupiderString.length;
            len += hell; // add the length of stupidString
            i += hell; // add the length of stupidString
        }
    }

    i--;
    if (i > 0) createString1(i, newString, degrees, x, y, z, s);
    else readString(newString, degrees, x, y, z, s, 0, 0, 0, brown, treeGreen);

}

//abomination numba two
let createString2 = function(i, string, degrees, x, y, z, scale) {
let len = string.length;
let newString = string;
let s = scale;
let start = '';
let end = '';

    let stupidString = 'F-[-F+F]+[+F-F]';
    let evenStupiderString = '[//F&F]';

for (let i = 0; i < len; i++) {
    if (newString[i] === 'F') {
        start = newString.substring(0, i+1);
        end = newString.substring(i+1, len);
        newString = start + stupidString + end;
        let hell = stupidString.length;
        len += hell; // add the length of stupidString
        i += hell; // add the length of stupidString
    }
    if (newString[i] === '&') {
        start = newString.substring(0, i+1);
        end = newString.substring(i+1, len);
        newString = start + evenStupiderString + end;
        let hell = evenStupiderString.length;
        len += hell; // add the length of stupidString
        i += hell; // add the length of stupidString
    }
}

i--;
if (i > 0) createString2(i, newString, degrees, x, y, z, s);
else readString(newString, degrees, x, y, z, s, 0, 0, 0, brown2, treeGreen);

}


//abomination numba three
let createString3 = function(i, string, degrees, x, y, z, scale) {
    let len = string.length;
    let newString = string;
    let s = scale;
    let start = '';
    let end = '';

    let stupidString = '[&F$F/F%/F]F[&F]$';
    let evenStupiderString = '[/&F][&F&]';

    for (let i = 0; i < len; i++) {
        if (newString[i] === 'F') {
            start = newString.substring(0, i+1);
            end = newString.substring(i+1, len);
            newString = start + stupidString + end;
            let hell = stupidString.length;
            len += hell; // add the length of stupidString
            i += hell; // add the length of stupidString
        }
        if (newString[i] === '/') {
            start = newString.substring(0, i+1);
            end = newString.substring(i+1, len);
            newString = start + evenStupiderString + end;
            let hell = evenStupiderString.length;
            len += hell; // add the length of stupidString
            i += hell; // add the length of stupidString
        }
    }

    i--;
    if (i > 0) createString3(i, newString, degrees, x, y, z, s);
    else readString(newString, degrees, x, y, z, s, 0, 0, 0, brown2, treeGreen);

}




let readString = function(string, degrees, x,y,z, scale, rx, ry, rz, color, sphereColor) {
    console.log(string);
    let T = [];
    let stacks = 0;

    for (let i=0; i<string.length; i++) {

        switch (string[i]) {
            case 'F':
                //for F in string, move forward
                let p = polycylinder(color, x, y, z, scale, rx, ry, rz, sphereColor);

                x = p.tc[0];
                y = p.tc[1];
                z = p.tc[2];


                scale *= 0.9;

                break;
            case 'f':
                //move forward for all 'f' without drawing
                x = x+x;
                y = y+y;
                z = z+z;
                break;

            case '+':
                //positive x rot
                rx += degrees;
                break;
            case '-':
                //negative x rot
                rx -= degrees;
                break;
            case '$':
                //positive y rot
                ry += degrees;
                break;
            case '^':
                //negative y rot
                ry -= degrees;
                break;
            case '&':
                //positive z rot
                rz += degrees;
                break;
            case '/':
                //negative z rot
                rz -= degrees;
                break;
            case '[':
                T[stacks] = [x, y, z, scale, rx, ry, rz];
                stacks++;
                break;
            case ']':
                stacks--;
                x = T[stacks][0];
                y = T[stacks][1];
                z = T[stacks][2];
                scale = T[stacks][3];
                rx = T[stacks][4];
                ry = T[stacks][5];
                rz = T[stacks][6];
                break;

        }
    }
}
