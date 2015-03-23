DisplayLibrary.prototype.createGameTarget = function(radius) {

  var geo = new THREE.SphereGeometry(radius, 32, 32);
  var mat = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true});

  var functionObject = new THREE.Mesh(geo, mat);
  return functionObject;
}

DisplayLibrary.prototype.createMultipleGameTargets = function(num, minRadius, boundingBox) {
  var gameTargets = [];

  for(var i = 0; i < num; i++) {
    var radius = minRadius + (minRadius/2)*Math.random();
    var positionx = boundingBox*2*(Math.random() - 0.5);
    var positiony = boundingBox*2*(Math.random() - 0.5);
    var positionz = boundingBox*2*(Math.random() - 0.5);
    var gameTarget = this.createGameTarget(radius);
    gameTarget.position.x = positionx;
    gameTarget.position.y = positiony;
    gameTarget.position.z = positionz;
    gameTargets.push(gameTarget);
  }
  this.targets = gameTargets;
  return gameTargets;
}

DisplayLibrary.prototype.disturbGameTargets = function() {
  if(this.targets === undefined) { return; }
  var gameTargets = this.targets;
  for(var i = 0; i < gameTargets.length; i++) {
    var radius = gameTargets[i].geometry.parameters.radius;
    gameTargets[i].position.x += radius*0.05*(Math.random() - 0.5);
    gameTargets[i].position.y += radius*0.05*(Math.random() - 0.5);
    gameTargets[i].position.z += radius*0.05*(Math.random() - 0.5);
  }
}