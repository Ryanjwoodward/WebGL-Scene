function store(name){
    colors = colors.concat(name.TriangleVertexColors);
    normals = normals.concat(name.TriangleNormals);
    points = points.concat(name.TriangleVertices);
}

function polycylinder(color, X_pos, Y_pos, Z_pos, scale, Xrotation, Yrotation, Zrotation, sp){

    // let black = [0,0,0,1];

    let data = {};
    let base = cylinder(36, 1, true, color); //Right arm rest
    base.scale(scale, scale, scale);
    base.rotate(Xrotation, [1, 0, 0]); //X rot
    base.rotate(Yrotation, [0, 1, 0]); //Y rot
    base.rotate(Zrotation, [0, 0, 1]); //Z rot
    // Spawn cylinder's center at old top
    base.translate(X_pos, Y_pos, Z_pos);
    // //Shift cylinder so bottom touches old top
    // base.translate(vertex[0]-base.bottom[0], vertex[1]-base.bottom[1], vertex[2]-base.bottom[2]);

    // Update the current vertex to be the top of this cylinder for the next polycylinder!
    console.log("TOP: "+base.top+ " BOTTOM: "+base.bottom);
    store(base);
    let connect = sphere(4, sp);
    connect.scale(scale/2, scale/2, scale/2);
    connect.translate(base.top[0], base.top[1], base.top[2]); //Spawn sphere at top of cylinder

    data.tc = base.top;

    store(connect);

    return data;
}