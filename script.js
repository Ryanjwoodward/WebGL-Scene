// Rule 1: F
// Rule 2: F+F
// Rule 3: ?

let inputString = "F";
//n = number of iterations
n = 3;

let rules = {
    "F": "F+X",
    "X": "F+F"
}

for (let i = 0; i < n; i++ ) {
  console.log(inputString);
  inputString = makeString(inputString);
}
console.log(inputString);
const go = inputString;

function makeString(str){

    let newString = "";
  
  for(let i =0; i < str.length; i ++){
    let subStr = str[i];
    
    if(subStr in rules) {
       newString += rules[subStr];
       }
       else{
         newString += subStr;
       } 
  }
  return newString;
}

for (let i = 0; i < go.length; i++) {

  let subGo = go[i];
  
switch(subGo) {
  case 'F':
    console.log("move forward 10");
    console.log("create child branches at 45 deg")
    break;
  case 'X':
    console.log("move forward 10");
    console.log("create child branches at 40 deg")
}

}
