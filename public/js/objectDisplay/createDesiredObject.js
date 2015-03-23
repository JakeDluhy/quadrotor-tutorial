DisplayLibrary.prototype.createDesiredObject = function() {

  var geo = new THREE.SphereGeometry(1, 32, 32);
  var mat = new THREE.MeshBasicMaterial({color: 0x000000, })

  //Reset the surface
  if(!(currentObject === null)) {
    var currentObject = this.scene.getObjectByName('currentDesiredObject');
    this.scene.remove(currentObject);
  }

  var functionObject = new THREE.Mesh(geo, mat);
  functionObject.name = 'currentDesiredObject';
  return functionObject;
}