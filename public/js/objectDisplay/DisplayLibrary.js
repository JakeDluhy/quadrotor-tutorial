function DisplayLibrary(container, javaContainer, buildAxes, buildConstraintBox, buildRoom) {

  this.inverted = false;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, container.width() / container.height(), 0.1, 1000);
  var renderer = new THREE.WebGLRenderer();
  this.scene = scene;
  this.camera = camera;
  this.renderer = renderer;

  renderer.setSize(container.width(), container.height());
  renderer.setClearColor( 0xffffff, 1 );
  container.append(renderer.domElement);
  var controls = new THREE.TrackballControls(camera, javaContainer);

  if(buildAxes) {
    this.buildAxes(40);
  }
  if(buildConstraintBox) {
    this.buildConstraintBox(6, 6);
  }
  if(buildRoom) {
    var room = this.buildRoom(100);
    scene.add(room);
  }

  camera.position.x = 80;
  camera.position.y = 80;
  camera.position.z = 80;
  var quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2);
  camera.up.applyQuaternion(quaternion);

  var self = this;

  render();


  function render() {
    self.withinRender();
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);

  }


  
}

DisplayLibrary.prototype.invertedCoordinates = function() {
  var invCoor = new THREE.Object3D();
  invCoor.rotation.x = Math.PI;
  this.invCoor = invCoor;
  this.inverted = true;
  return invCoor;
}

DisplayLibrary.prototype.withinRender = function() {
}

DisplayLibrary.prototype.setWithinRender = function(func) {
  this.withinRender = func;
}

DisplayLibrary.prototype.roundIt = function(val, decimal) {
  return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
}
