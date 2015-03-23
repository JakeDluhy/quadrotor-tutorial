$(document).ready(function() {
  var container = $('#quadrotor-container');
  var container2 = $('#quadrotor-container2');
  var javaContainer = document.getElementById('quadrotor-container');
  var javaContainer2 = document.getElementById('quadrotor-container2');

  var display = new DisplayLibrary(container, javaContainer, true, false, true);
  var display2 = new DisplayLibrary(container2, javaContainer2, true, false, true);

  var invCoor = display.invertedCoordinates();
  var invCoor2 = display2.invertedCoordinates();

  display.scene.add(invCoor);
  display2.scene.add(invCoor2);

  var quadrotor = new Quadrotor();
  var quadrotor2 = new Quadrotor();
  invCoor.add(quadrotor.model);
  invCoor2.add(quadrotor2.model);
  invCoor.add(display.axes);
  invCoor2.add(display2.axes);
  display.setWithinRender(function() {
    quadrotor.rotateRotors();
  });
  var room = display2.scene.getObjectByName('room');
  console.log(room);

  //Handle translations and rotations
  $(document).keydown(function(event){
    var breakit = false;
    if(event.keyCode === 65){ //A
      quadrotor.model.position.y -= 2; //Move Left
      room.position.y -= 2;
    } else if(event.keyCode === 87) { //D
      quadrotor.model.position.x += 2; //Move Forward
      room.position.x -= 2;
    } else if(event.keyCode === 68) { //W
      quadrotor.model.position.y += 2; //Move Right
      room.position.y += 2;
    } else if(event.keyCode === 83) { //S
      quadrotor.model.position.x -= 2; //Move Backward
      room.position.x += 2;
    } else if(event.keyCode === 81) { //Q
      quadrotor.model.position.z -= 2; //Move Up
      room.position.z -= 2;
    } else if(event.keyCode === 69) { //E
      quadrotor.model.position.z += 2; //Move Down
      room.position.z += 2;
    } else if(event.keyCode === 89) { //Y
      quadrotor.rotateBody(1/(Math.PI*2), 'euler3'); //Rotate about x - positive
      display2.rotateRoom(-1/(Math.PI*2), 'euler3');
    } else if(event.keyCode === 72) { //H
      quadrotor.rotateBody(-1/(Math.PI*2), 'euler3'); //Rotate about x - negative
      display2.rotateRoom(1/(Math.PI*2), 'euler3');
    } else if(event.keyCode === 84) { //T
      quadrotor.rotateBody(1/(Math.PI*2), 'euler2'); //Rotate about y - positive
      display2.rotateRoom(1/(Math.PI*2), 'euler2');
    } else if(event.keyCode === 71) { //G
      quadrotor.rotateBody(-1/(Math.PI*2), 'euler2'); //Rotate about y - negative
      display2.rotateRoom(-1/(Math.PI*2), 'euler2');
    } else if(event.keyCode === 82) { //R
      quadrotor.rotateBody(1/(Math.PI*2), 'euler1'); //Rotate about z - positive
      display2.rotateRoom(1/(Math.PI*2), 'euler1');
    } else if(event.keyCode === 70) { //F
      quadrotor.rotateBody(-1/(Math.PI*2), 'euler1'); //Rotate about z - negative
      display2.rotateRoom(-1/(Math.PI*2), 'euler1');
    }
    display.drawXYZDistances(quadrotor.model.position.x, quadrotor.model.position.y, quadrotor.model.position.z);
    display2.drawXYZDistances(quadrotor2.model.position.x, quadrotor2.model.position.y, quadrotor2.model.position.z);
    // display.drawZYXEulerAngles(quadrotor.model.rotation.z, quadrotor.model.rotation.y, quadrotor.model.rotation.x);
    linkTranslationsAndRotations(quadrotor);
  });

  function linkTranslationsAndRotations(quad) {
    $('.xpos').html(roundIt(quad.model.position.x, 3));
    $('.ypos').html(roundIt(quad.model.position.y, 3));
    $('.zpos').html(roundIt(quad.model.position.z, 3));

    $('.zrot').html(roundIt(quad.euler1, 3));
    $('.yrot').html(roundIt(quad.euler2, 3));
    $('.xrot').html(roundIt(quad.euler3, 3));    
  }

  function roundIt(num, decimal) {
    return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }
});