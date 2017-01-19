function showAll(objs, spacing) {
    var showPieces = [];
    var dx = 0;
    spacing = spacing == undefined ? 10 : spacing;
    for (var i = 0; i < objs.length; i++) {
        // console.log(objs[i].getBounds());
        var bounds = objs[i].getBounds();
        dx += bounds[1]._x - bounds[0]._x + spacing;
        showPieces.push(objs[i].translate([dx, 0, 0]));
    }
    return showPieces;
}
