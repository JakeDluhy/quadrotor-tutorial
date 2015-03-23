$(document).ready(function() {
  var container = $('#quadrotor-container');
  var javaContainer = document.getElementById('quadrotor-container');
  var reset = $('.reset-button');
  var start = $('.start-button');
  var stop = $('.stop-button');

  var applyKs = $('.applyKs');

  var display = new DisplayLibrary(container, javaContainer, true, false, true);

  var quadrotor = new Quadrotor();
  var invCoor = display.invertedCoordinates();
  
  display.scene.add(invCoor);
  invCoor.add(quadrotor.model);
  invCoor.add(display.axes);
  var desiredPositionObject = display.createDesiredObject();
  invCoor.add(desiredPositionObject);
  desiredPositionObject.position.x = 20;
  desiredPositionObject.position.y = 20;
  desiredPositionObject.position.z = -20;

  display.setWithinRender(function() {
    if(display.start === true) {
      var thetades = quadrotor.outerLoopStateFeedback(desiredPositionObject.position.x,0,desiredPositionObject.position.y,0,desiredPositionObject.position.z,0);
      quadrotor.thetades = thetades;

      quadrotor.innerLoopStateFeedback(thetades[0], thetades[1], thetades[2], 0, 0, 0);
      quadrotor.simulateOneTimeStep();


      quadrotor.rotateRotors();
      quadrotor.showForces();
      quadrotor.applyEulerAngles();
    }
  });
  
  $('.xdir-k1').val(quadrotor.k1outer[0]);
  $('.xdir-k2').val(quadrotor.k1outer[1]);

  $('.ydir-k1').val(quadrotor.k2outer[0]);
  $('.ydir-k2').val(quadrotor.k2outer[1]);

  $('.zdir-k1').val(quadrotor.k3outer[0]);
  $('.zdir-k2').val(quadrotor.k3outer[1]);

  $('.euler1-k1').val(quadrotor.k1inner[0]);
  $('.euler1-k2').val(quadrotor.k1inner[1]);

  $('.euler2-k1').val(quadrotor.k2inner[0]);
  $('.euler2-k2').val(quadrotor.k2inner[1]);

  $('.euler3-k1').val(quadrotor.k3inner[0]);
  $('.euler3-k2').val(quadrotor.k3inner[1]);

  //Handle translations and rotations
  applyKs.click(function(event) {
    var xdirk1 = -Number($('.xdir-k1').val());
    var xdirk2 = -Number($('.xdir-k2').val());

    var ydirk1 = Number($('.ydir-k1').val());
    var ydirk2 = Number($('.ydir-k2').val());

    var zdirk1 = Number($('.zdir-k1').val());
    var zdirk2 = Number($('.zdir-k2').val());

    var euler1k1 = Number($('.euler1-k1').val());
    var euler1k2 = Number($('.euler1-k2').val());

    var euler2k1 = Number($('.euler2-k1').val());
    var euler2k2 = Number($('.euler2-k2').val());

    var euler3k1 = Number($('.euler3-k1').val());
    var euler3k2 = Number($('.euler3-k2').val());

    var abs = Math.abs;

    if(abs(xdirk1) !== 0) { quadrotor.k1outer[0] = xdirk1; }
    if(abs(xdirk2) !== 0) { quadrotor.k1outer[1] = xdirk2; }
    if(abs(ydirk1) !== 0) { quadrotor.k2outer[0] = ydirk1; }
    if(abs(ydirk2) !== 0) { quadrotor.k2outer[1] = ydirk2; }
    if(abs(zdirk1) !== 0) { quadrotor.k3outer[0] = zdirk1; }
    if(abs(zdirk2) !== 0) { quadrotor.k3outer[1] = zdirk2; }

    if(abs(euler1k1) !== 0) { quadrotor.k1inner[0] = euler3k1; }
    if(abs(euler1k2) !== 0) { quadrotor.k1inner[1] = euler3k2; }
    if(abs(euler2k1) !== 0) { quadrotor.k2inner[0] = euler2k1; }
    if(abs(euler2k2) !== 0) { quadrotor.k2inner[1] = euler2k2; }
    if(abs(euler3k1) !== 0) { quadrotor.k3inner[0] = euler1k1; }
    if(abs(euler3k2) !== 0) { quadrotor.k3inner[1] = euler1k2; }
  });

  $(document).keydown(function(event){
    var breakit = false;
    if(event.keyCode === 65){ //A
      desiredPositionObject.position.y += 2; //Move Left
    } else if(event.keyCode === 87) { //W
      desiredPositionObject.position.x += 2; //Move Forward
    } else if(event.keyCode === 68) { //D
      desiredPositionObject.position.y -= 2; //Move Right
    } else if(event.keyCode === 83) { //S
      desiredPositionObject.position.x -= 2; //Move Backward
    } else if(event.keyCode === 81) { //Q
      desiredPositionObject.position.z -= 2; //Move Up
    } else if(event.keyCode === 69) { //E
      desiredPositionObject.position.z += 2; //Move Down
    }
  });

  reset.click(function() {
    quadrotor.resetPositionAngles();
  });

  start.click(function() {
    display.start = true;
  });

  stop.click(function() {
    display.start = false;
  });

  function roundIt(num, decimal) {
    return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }
});