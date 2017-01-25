var XAC = XAC || {};
var EPS = 1e-6;

//
//  get a copy of an object
//
XAC.copy = function(object) {
    return union(object);
}

//
//  get the center of an object
//
XAC.getCenter = function(object) {
    var centerX = (object.getBounds()[1].x + object.getBounds()[0].x) / 2;
    var centerY = (object.getBounds()[1].y + object.getBounds()[0].y) / 2;
    var centerZ = (object.getBounds()[1].z + object.getBounds()[0].z) / 2;
    return [centerX, centerY, centerZ];
}

//
//  make geometry of a string of text with given dimensions
//  - text: strng of text
//  - strokeWidth: stroke width of the characters
//  - thickness: the thickness (or depth) of the characters
//  - w: width of generated text geometry
//  - h: height of generated text geometry
//
XAC.makeText = function(text, strokeWidth, thickness, w, h) {
    var vectorText = vector_text(0, 0, text);

    var textShape = undefined;
    vectorText.forEach(function(pl) {
        var stroke = rectangular_extrude(pl, {
            w: strokeWidth,
            h: thickness,
            fn: 32
        });
        if (textShape == undefined) {
            textShape = stroke;
        } else {
            textShape = union(textShape, stroke);
        }
    });

    return scaleTo(textShape, w, h, undefined).center();
}

XAC.scaleCentric = function(object, scaleFactor) {
    var center = XAC.getCenter(object);
    var objectCopy = object.center();
    objectCopy = objectCopy.scale(scaleFactor);
    return objectCopy.translate(center);
}

//
//  scale an object to match the dimensions without preserving original dimensional ratio
//  - object: the object
//  - x, y, z: the target dimensions on x, y and z
//
XAC.scaleTo = function(object, x, y, z) {
    var boundX = object.getBounds()[1].x - object.getBounds()[0].x;
    var boundY = object.getBounds()[1].y - object.getBounds()[0].y;
    var boundZ = object.getBounds()[1].z - object.getBounds()[0].z;
    var scaleX = (x == undefined) ? 1 : x / boundX;
    var scaleY = (y == undefined) ? scaleX : y / boundY;
    var scaleZ = (z == undefined) ? scaleX : z / boundZ;

    return object.scale([scaleX, scaleY, scaleZ]).center();
}

//
//  align a set of objects linearly for visual debugging
//  - objects: an array of objects
//  - (optional) spacing: how much space between each objects
//
XAC.showAll = function(objects, spacing) {
    var showPieces = [];
    var dx = 0;
    spacing = spacing == undefined ? 10 : spacing;
    for (var i = 0; i < objects.length; i++) {
        // console.log(objects[i].getBounds());
        var bounds = objects[i].getBounds();
        dx += bounds[1]._x - bounds[0]._x + spacing;
        showPieces.push(objects[i].translate([dx, 0, 0]));
    }
    return showPieces;
}

XAC.makeRoundedPlatform = function(x, y, z, r) {
    // var roundedCube = CSG.roundedCube({size:[x, y, z+r*2]})
    var roundedCube = CSG.roundedCube({ // rounded cube
        center: [0, 0, 0],
        radius: 1,
        roundradius: [r * y / x, r, r],
        resolution: 32,
    });
    roundedCube = scaleTo(roundedCube, x, y, z * (1 + r * 2));
    var gCube = cube({
        size: [x, y, z * r],
        center: true
    });
    roundedCube = roundedCube.subtract(gCube.translate([0, 0, z * (1 + r) / 2]));
    roundedCube = roundedCube.subtract(gCube.translate([0, 0, -z * (1 + r) / 2]));
    return roundedCube.center();
}


//
//  create a trapezoid extruded along a 3rd dimension
//  - w1 & w2: the parallel edges of the trapezoid
//  - h: the distance between w1 & w2
//  - l: the extruding length
//
XAC.trapezoidPrism = function(w1, w2, h, l) {
    var object = linear_extrude({
            height: l
        },
        polygon({
            points: [
                [0, 0],
                [w1, 0],
                [(w1 + w2) / 2, h],
                [(w1 - w2) / 2, h]
            ]
        })).translate([-w1 / 2, -h / 2, -l / 2]);

    return object;
}
