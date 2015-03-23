DisplayLibrary.prototype.buildAxes = function(length) {
  var axes = new THREE.Object3D();
  // var axis = new THREE.Line( new Three.Geometry(), new THREE.LineBasicMaterial({}))
  arrowLength = length - length/100;
  arrowHeight = length/100;
  //Build the axes, with dashed line for the negative axes
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(length, 0, 0), new THREE.Vector3(arrowLength, arrowHeight, 0), new THREE.Vector3(arrowLength, -arrowHeight, 0), 0x000000, false, length) );
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(-length, 0, 0), new THREE.Vector3(-arrowLength, arrowHeight, 0), new THREE.Vector3(-arrowLength, -arrowHeight, 0), 0x000000, true, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0, length, 0), new THREE.Vector3(0, arrowLength, arrowHeight), new THREE.Vector3(0, arrowLength, -arrowHeight), 0x000000, false, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0, -length, 0), new THREE.Vector3(0, -arrowLength, arrowHeight), new THREE.Vector3(0, -arrowLength, arrowHeight), 0x000000, true, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0, length), new THREE.Vector3(arrowHeight, 0, arrowLength), new THREE.Vector3(-arrowHeight, 0, arrowLength), 0x000000, false, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0, -length), new THREE.Vector3(arrowHeight, 0, -arrowLength), new THREE.Vector3(-arrowHeight, 0, -arrowLength), 0x000000, true, length));

  //Build the end arrows, seperately from the axes in order to make them all solid
  axes.add( buildArrow(new THREE.Vector3(length, 0, 0), new THREE.Vector3(arrowLength, 0, arrowHeight), new THREE.Vector3(arrowLength, 0, -arrowHeight), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(-length, 0, 0), new THREE.Vector3(-arrowLength, 0, arrowHeight), new THREE.Vector3(-arrowLength, 0, -arrowHeight), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0, length, 0), new THREE.Vector3(0, arrowLength, arrowHeight), new THREE.Vector3(0, arrowLength, -arrowHeight), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0, -length, 0), new THREE.Vector3(0, -arrowLength, arrowHeight), new THREE.Vector3(0, -arrowLength, -arrowHeight), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0,0, length), new THREE.Vector3(arrowHeight, 0, arrowLength), new THREE.Vector3(-arrowHeight, 0, arrowLength), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0,0, -length), new THREE.Vector3(arrowHeight, 0, -arrowLength), new THREE.Vector3(-arrowHeight, 0, -arrowLength), 0x000000));

  axes.add(label('x', length));
  axes.add(label('y', length));
  axes.add(label('z', length));

  this.scene.add(axes);
  this.axes = axes;

  /* -------------------------- Utility Methods for build axis function ------------------------ */
  function buildAxis(origin, end, arrowPoint1, arrowPoint2, color, dashed, length) {
    var geom = new THREE.Geometry();
    var mat;

    if(dashed) {
        mat = new THREE.LineDashedMaterial({ linewidth: 3, color: color, dashSize: length/100, gapSize: length/100});
    } else {
        mat = new THREE.LineBasicMaterial({ linewidth: 3, color: color});
    }
    

    geom.vertices.push(origin.clone());
    geom.vertices.push(end.clone());

    geom.computeLineDistances();
    

    axis = new THREE.Line(geom, mat, THREE.LinePieces);

    return axis;
  }

  function buildArrow(end, arrowPoint1, arrowPoint2, color) {
    var arrowGeom = new THREE.Geometry();
    var arrowMat = new THREE.LineBasicMaterial({ linewidth: 3, color: color});

    arrowGeom.vertices.push(end.clone());
    arrowGeom.vertices.push(arrowPoint1.clone());
    arrowGeom.vertices.push(end.clone());
    arrowGeom.vertices.push(arrowPoint2.clone());

    arrowGeom.computeLineDistances();

    arrow = new THREE.Line(arrowGeom, arrowMat, THREE.LinePieces);

    return arrow;
  }

  function label(text, length) {
    var textGeo = new THREE.TextGeometry( text, {

      size: .3,
      height: .05,
      curveSegments: 4,

      font: 'gentilis',
      weight: 'bold',
      style: 'normal',

      bevelThickness: 0,
      bevelSize: 0,
      bevelEnabled: false
    });
    var textMat = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    var mesh = new THREE.Mesh(textGeo, textMat);
    if(text === 'x') {mesh.position.x = length;}
    if(text === 'y') {mesh.position.y = length;}
    if(text === 'z') {mesh.position.z = length;}
    
    return mesh;
  }
}

DisplayLibrary.prototype.build2DAxes = function(length) {
  var axes = new THREE.Object3D();
  // var axis = new THREE.Line( new Three.Geometry(), new THREE.LineBasicMaterial({}))
  var arrowLength = length - length/100;
  var arrowHeight = length/100;

  //Build the axes, with dashed line for the negative axes
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(length, 0, 0), new THREE.Vector3(arrowLength, arrowHeight, 0), new THREE.Vector3(arrowLength, -arrowHeight, 0), 0x000000, false, length) );
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(-length, 0, 0), new THREE.Vector3(-arrowLength, arrowHeight, 0), new THREE.Vector3(-arrowLength, -arrowHeight, 0), 0x000000, true, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0, length, 0), new THREE.Vector3(0, arrowLength, arrowHeight), new THREE.Vector3(0, arrowLength, -arrowHeight), 0x000000, false, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0, -length, 0), new THREE.Vector3(0, -arrowLength, arrowHeight), new THREE.Vector3(0, -arrowLength, arrowHeight), 0x000000, true, length));

  buildTicks(-length, length, 'x', axes);
  buildTicks(-length, length, 'y', axes);

  //Build the end arrows, seperately from the axes in order to make them all solid
  axes.add( buildArrow(new THREE.Vector3(length, 0, 0), new THREE.Vector3(arrowLength, 0, arrowHeight), new THREE.Vector3(arrowLength, 0, -arrowHeight), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(-length, 0, 0), new THREE.Vector3(-arrowLength, 0, arrowHeight), new THREE.Vector3(-arrowLength, 0, -arrowHeight), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0, length, 0), new THREE.Vector3(0, arrowLength, arrowHeight), new THREE.Vector3(0, arrowLength, -arrowHeight), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0, -length, 0), new THREE.Vector3(0, -arrowLength, arrowHeight), new THREE.Vector3(0, -arrowLength, -arrowHeight), 0x000000));

  axes.add(label('x', length));
  axes.add(label('y', length));

  this.scene.add(axes);
  this.axes = axes;

  /* -------------------------- Utility Methods for build axis function ------------------------ */
  function buildAxis(origin, end, arrowPoint1, arrowPoint2, color, dashed, length) {
    var geom = new THREE.Geometry();
    var mat;

    if(dashed) {
        mat = new THREE.LineDashedMaterial({ linewidth: 3, color: color, dashSize: length/100, gapSize: length/100});
    } else {
        mat = new THREE.LineBasicMaterial({ linewidth: 3, color: color});
    }
    

    geom.vertices.push(origin.clone());
    geom.vertices.push(end.clone());

    geom.computeLineDistances();
    

    axis = new THREE.Line(geom, mat, THREE.LinePieces);

    return axis;
  }

  function buildArrow(end, arrowPoint1, arrowPoint2, color) {
    var arrowGeom = new THREE.Geometry();
    var arrowMat = new THREE.LineBasicMaterial({ linewidth: 3, color: color});

    arrowGeom.vertices.push(end.clone());
    arrowGeom.vertices.push(arrowPoint1.clone());
    arrowGeom.vertices.push(end.clone());
    arrowGeom.vertices.push(arrowPoint2.clone());

    arrowGeom.computeLineDistances();

    arrow = new THREE.Line(arrowGeom, arrowMat, THREE.LinePieces);

    return arrow;
  }

  function buildTicks(start, end, axis) {
    var tickGeom = new THREE.Geometry();
    var tickMat = new THREE.LineBasicMaterial({ linewidth: 3, color: 0x000000});
    var textMat = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    var interval = parseInt((end - start)/20);
    if(axis === 'x') {
      if(interval > 0) {
        for(var i = start; i < end; i += interval) {
          tickGeom.vertices.push(new THREE.Vector3(i, -0.1, 0));
          tickGeom.vertices.push(new THREE.Vector3(i, 0.1, 0));
          var textGeo = new THREE.TextGeometry( i, {

            size: .25,
            height: .05,
            curveSegments: 4,

            font: 'gentilis',
            weight: 'bold',
            style: 'normal',

            bevelThickness: 0,
            bevelSize: 0,
            bevelEnabled: false
          });
          var mesh = new THREE.Mesh(textGeo, textMat);
          mesh.position.x = i;
          mesh.position.y = -.2;
          axes.add(mesh);
        }
      }
    } else if(axis === 'y') {
      if(interval > 0) {
        for(var i = start; i < end; i += interval) {
          tickGeom.vertices.push(new THREE.Vector3(-0.1, i, 0));
          tickGeom.vertices.push(new THREE.Vector3(0.1, i, 0));
          var textGeo = new THREE.TextGeometry( i, {

            size: .25,
            height: .05,
            curveSegments: 4,

            font: 'gentilis',
            weight: 'bold',
            style: 'normal',

            bevelThickness: 0,
            bevelSize: 0,
            bevelEnabled: false
          });
          var mesh = new THREE.Mesh(textGeo, textMat);
          mesh.position.x = -.2;
          mesh.position.y = i;
          axes.add(mesh);
        }
      }
    }
    var ticks = new THREE.Line(tickGeom, tickMat, THREE.LinePieces);
    axes.add(ticks);
  }

  function label(text, length) {
    var textGeo = new THREE.TextGeometry( text, {

      size: .3,
      height: .05,
      curveSegments: 4,

      font: 'gentilis',
      weight: 'bold',
      style: 'normal',

      bevelThickness: 0,
      bevelSize: 0,
      bevelEnabled: false
    });
    var textMat = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    var mesh = new THREE.Mesh(textGeo, textMat);
    if(text === 'x') {
      mesh.position.x = length;
      mesh.position.y = -.2
    }
    if(text === 'y') {
      mesh.position.y = length;
      mesh.position.x = -.2
    }
    if(text === 'z') {
      mesh.position.z = length;
    }
    
    return mesh;
  }
}

DisplayLibrary.prototype.buildConstraintBox = function(sideLength, height) {
  var halfSide = sideLength/2;

  var corner1 = new THREE.Vector3(halfSide, halfSide, halfSide);
  var corner2 = new THREE.Vector3(halfSide, halfSide, -halfSide);
  var corner3 = new THREE.Vector3(halfSide, -halfSide, -halfSide);
  var corner4 = new THREE.Vector3(halfSide, -halfSide, halfSide);
  var corner5 = new THREE.Vector3(-halfSide, halfSide, halfSide);
  var corner6 = new THREE.Vector3(-halfSide, halfSide, -halfSide);
  var corner7 = new THREE.Vector3(-halfSide, -halfSide, -halfSide);
  var corner8 = new THREE.Vector3(-halfSide, -halfSide, halfSide);

  var cboxGeom = new THREE.Geometry();
  var cboxMat = new THREE.LineBasicMaterial({ linewidth: 3, color: 0x000000});

  cboxGeom.vertices.push(corner1);
  cboxGeom.vertices.push(corner2);

  cboxGeom.vertices.push(corner2);
  cboxGeom.vertices.push(corner3);

  cboxGeom.vertices.push(corner3);
  cboxGeom.vertices.push(corner4);

  cboxGeom.vertices.push(corner4);
  cboxGeom.vertices.push(corner1);

  cboxGeom.vertices.push(corner1);
  cboxGeom.vertices.push(corner5);

  cboxGeom.vertices.push(corner2);
  cboxGeom.vertices.push(corner6);

  cboxGeom.vertices.push(corner3);
  cboxGeom.vertices.push(corner7);

  cboxGeom.vertices.push(corner4);
  cboxGeom.vertices.push(corner8);

  cboxGeom.vertices.push(corner5);
  cboxGeom.vertices.push(corner6);

  cboxGeom.vertices.push(corner6);
  cboxGeom.vertices.push(corner7);

  cboxGeom.vertices.push(corner7);
  cboxGeom.vertices.push(corner8);

  cboxGeom.vertices.push(corner8);
  cboxGeom.vertices.push(corner5);

  var cbox = new THREE.Line(cboxGeom, cboxMat, THREE.LinePieces);

  this.scene.add(cbox);
  this.cbox = cbox;
}

DisplayLibrary.prototype.buildRoom = function(size) {
  var room = new THREE.Object3D();
  var geo1 = new THREE.Geometry();
  var geo2 = new THREE.Geometry();
  var geo3 = new THREE.Geometry();
  var mat1 = new THREE.PointCloudMaterial({color: 0x0000ff, size: 4});
  var mat2 = new THREE.PointCloudMaterial({color: 0x00ff00, size: 4});
  var mat3 = new THREE.PointCloudMaterial({color: 0xff0000, size: 4});

  //Create the walls of the room
  for(var i = 0; i < size; i+=(size/10)) {
    for(var j = 0; j < size; j+=(size/10)) {
      geo1.vertices.push(new THREE.Vector3(-i,-j,size));
      geo1.vertices.push(new THREE.Vector3(i,j,size));
      geo1.vertices.push(new THREE.Vector3(-i,j,size));
      geo1.vertices.push(new THREE.Vector3(i,-j,size));

      geo1.vertices.push(new THREE.Vector3(-i,-j,-size));
      geo1.vertices.push(new THREE.Vector3(i,j,-size));
      geo1.vertices.push(new THREE.Vector3(-i,j,-size));
      geo1.vertices.push(new THREE.Vector3(i,-j,-size));

      geo2.vertices.push(new THREE.Vector3(-i,size,-j));
      geo2.vertices.push(new THREE.Vector3(i,size,j));
      geo2.vertices.push(new THREE.Vector3(-i,size,j));
      geo2.vertices.push(new THREE.Vector3(i,size,-j));

      geo2.vertices.push(new THREE.Vector3(-i,-size,-j));
      geo2.vertices.push(new THREE.Vector3(i,-size,j));
      geo2.vertices.push(new THREE.Vector3(-i,-size,j));
      geo2.vertices.push(new THREE.Vector3(i,-size,-j));

      geo3.vertices.push(new THREE.Vector3(size,-i,-j));
      geo3.vertices.push(new THREE.Vector3(size,i,j));
      geo3.vertices.push(new THREE.Vector3(size,-i,j));
      geo3.vertices.push(new THREE.Vector3(size,i,-j));

      geo3.vertices.push(new THREE.Vector3(-size,-i,-j));
      geo3.vertices.push(new THREE.Vector3(-size,i,j));
      geo3.vertices.push(new THREE.Vector3(-size,-i,j));
      geo3.vertices.push(new THREE.Vector3(-size,i,-j));
    }
  }
  room.add(new THREE.PointCloud(geo1, mat1));
  room.add(new THREE.PointCloud(geo2, mat2));
  room.add(new THREE.PointCloud(geo3, mat3));
  room.name = 'room';
  room.userData.euler1 = 0;
  room.userData.euler2 = 0;
  room.userData.euler3 = 0;
  return room;
}

DisplayLibrary.prototype.rotateRoom = function(rot, axis) {
  var room = this.scene.getObjectByName('room');
  if(axis.toLowerCase() === 'euler1') {
    room.userData.euler1 += rot;
  } else if(axis.toLowerCase() === 'euler2') {
    room.userData.euler2 += rot;
  } else if(axis.toLowerCase() === 'euler3') {
    room.userData.euler3 += rot;
  } else {
    console.log('Body Rotation error, axis not specified');
  }
  e1 = room.userData.euler1;
  e2 = room.userData.euler2;
  e3 = room.userData.euler3;
  var cos = Math.cos;
  var sin = Math.sin;
  var rotMat = new THREE.Matrix4(cos(e1)*cos(e2), cos(e1)*sin(e2)*sin(e3)-sin(e1)*cos(e3), cos(e1)*sin(e2)*cos(e3)+sin(e1)*sin(e3), 0,
                                sin(e1)*cos(e2), sin(e1)*sin(e2)*sin(e3)+cos(e1)*cos(e3), sin(e1)*sin(e2)*cos(e3)-cos(e1)*sin(e3), 0,
                                -sin(e2), cos(e2)*sin(e3), cos(e2)*cos(e3), 0,
                                0, 0, 0, 1);
  room.rotation.setFromRotationMatrix(rotMat);
}

DisplayLibrary.prototype.drawLine = function(start, end, width, color) {
  var line = new THREE.Geometry();
  var mat = new THREE.LineBasicMaterial({linewidth: width, color: color});
  line.vertices.push(start);
  line.vertices.push(end);
  return new THREE.Line(line, mat, THREE.LinePieces); //Return the line instead of drawing the scene, in order to draw it in multiple contexts
}

DisplayLibrary.prototype.drawArc = function(start, angle, axis, size, width, color) {
  var arc = new THREE.Geometry();
  var mat = new THREE.LineBasicMaterial({linewidth: width, color: color});
  arc.vertices.push(start);
  if(angle > 0) {
    for(var i = 0; i < angle; i+= .01) {
      pushPoints(i);
    }
  } else if(angle < 0) {
    for(var i = 0; i > angle; i-= .01) {
      pushPoints(i);
    }
  }
  return new THREE.Line(arc, mat);
  
  function pushPoints(i) {
    if(axis.toLowerCase() === 'x') {
      arc.vertices.push(new THREE.Vector3(start.x, start.y + size*(Math.cos(i) - 1), start.z + size*Math.sin(i)));
    } else if(axis.toLowerCase() === 'y') {
      arc.vertices.push(new THREE.Vector3(start.x - size*(Math.cos(i) - 1), start.y, start.z + size*Math.sin(i)));
    } else if(axis.toLowerCase() === 'z') {
      arc.vertices.push(new THREE.Vector3(start.x + size*Math.sin(i), start.y - size*(Math.cos(i) - 1), start.z));
    } else {
      console.log('Arc Rotation error, axis not specified');
    }
  }
}

DisplayLibrary.prototype.drawXYZDistances = function(x,y,z) {
  if(this.inverted === true) {
    var xline = this.invCoor.getObjectByName('xline');
    var yline = this.invCoor.getObjectByName('yline');
    var zline = this.invCoor.getObjectByName('zline');
    this.invCoor.remove(xline);
    this.invCoor.remove(yline);
    this.invCoor.remove(zline);
  } else {
    var xline = this.scene.getObjectByName('xline');
    var yline = this.scene.getObjectByName('yline');
    var zline = this.scene.getObjectByName('zline');
    this.scene.remove(xline);
    this.scene.remove(yline);
    this.scene.remove(zline);
  }
  xline = this.drawLine(new THREE.Vector3(0,0,0), new THREE.Vector3(x,0,0), 10, 0xff0000);
  xline.name = 'xline'
  yline = this.drawLine(new THREE.Vector3(x,0,0), new THREE.Vector3(x,y,0), 10, 0x00ff00);
  yline.name = 'yline'
  zline = this.drawLine(new THREE.Vector3(x,y,0), new THREE.Vector3(x,y,z), 10, 0x0000ff);
  zline.name = 'zline'
  if(this.inverted === true) {
    this.invCoor.add(xline);
    this.invCoor.add(yline);
    this.invCoor.add(zline);
  } else {
    this.scene.add(xline);
    this.scene.add(yline);
    this.scene.add(zline);
  }
}

DisplayLibrary.prototype.drawZYXEulerAngles = function(zrot,yrot,xrot) {
  var xline = this.scene.getObjectByName('zangle');
  this.scene.remove(zangle);
  var yline = this.scene.getObjectByName('yangle');
  this.scene.remove(yangle);
  var zline = this.scene.getObjectByName('xangle');
  this.scene.remove(xangle);

}