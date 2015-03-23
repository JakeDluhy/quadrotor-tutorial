$(document).ready(function() {
  var container = $('#quadrotor-container');
  var javaContainer = document.getElementById('quadrotor-container');

  var display = new DisplayLibrary(container, javaContainer, true, false, true);

  var quadrotor = new Quadrotor();
  display.scene.add(quadrotor.model);

  var invCoor = display.invertedCoordinates();
  invCoor.add(quadrotor.model);
  display.scene.add(invCoor);
  invCoor.add(display.axes);
  linkForces(quadrotor);


  display.setWithinRender(function() {
    quadrotor.rotateRotors();
    quadrotor.showForces();
  });
  
  

  //Handle translations and rotations
  $(document).keydown(function(event){
    if(event.keyCode === 81) { //Q
      quadrotor.forceRotor1 += 0.01;
    } else if(event.keyCode === 65){ //A
      quadrotor.forceRotor1 -= 0.01;
    } else if(event.keyCode === 87) { //W
      quadrotor.forceRotor2 += 0.01;
    } else if(event.keyCode === 83) { //S
      quadrotor.forceRotor2 -= 0.01;
    } else if(event.keyCode === 69) { //E
      quadrotor.forceRotor3 += 0.01;
    } else if(event.keyCode === 68) { //D
      quadrotor.forceRotor3 -= 0.01;
    } else if(event.keyCode === 82) { //R
      quadrotor.forceRotor4 += 0.01;
    } else if(event.keyCode === 70) { //F
      quadrotor.forceRotor4 -= 0.01;
    } else if(event.keyCode === 13) { //T
      quadrotor.applyOneTimeStepFullEOM();
    }
    display.drawXYZDistances(quadrotor.model.position.x, quadrotor.model.position.y, quadrotor.model.position.z);
    quadrotor.setRotorSpeedsAndInputs();
    linkForces(quadrotor);
  });

  function linkForces(quad) {
    $('.rotor1-force').html(roundIt(quad.forceRotor1, 3));
    $('.rotor2-force').html(roundIt(quad.forceRotor2, 3));
    $('.rotor3-force').html(roundIt(quad.forceRotor3, 3));
    $('.rotor4-force').html(roundIt(quad.forceRotor4, 3)); 
  }

  function roundIt(num, decimal) {
    return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }
});