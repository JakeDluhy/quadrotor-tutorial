$(document).ready(function() {
  var container = $('#quadrotor-container');
  var javaContainer = document.getElementById('quadrotor-container');
  var applyQs = $('.applyQs');
  var reset = $('.reset-button');
  var start = $('.start-button');
  var stop = $('.stop-button');

  var display = new DisplayLibrary(container, javaContainer, true, false, true);

  var quadrotor = new Quadrotor();
  var invCoor = display.invertedCoordinates();
  
  display.scene.add(invCoor);
  invCoor.add(quadrotor.model);
  invCoor.add(display.axes);
  display.maxTargets = 5;
  var gameTargets = display.createMultipleGameTargets(display.maxTargets, 6, 50);
  for(var i = 0; i < gameTargets.length; i++) {
    invCoor.add(gameTargets[i]);
  }
  gameTargets[0].material.color = new THREE.Color( 0xd52424 );
  display.currentTarget = 0;
  display.gameTargets = gameTargets;
  display.counterTime = 0;
  display.timeDisplay = 0;
  if(docCookies.getItem('bestTime') !== undefined) {
    display.bestTime = docCookies.getItem('bestTime');
    $('.best-time-display').html(roundIt(display.bestTime, 2));
  } else {
    display.bestTime = 0.00;
  }
  var set = false;

  display.setWithinRender(function() {
    if(display.start === true) {
      var target = display.currentTarget;
      if(target < display.maxTargets) {
        display.timeDisplay += 0.02;
        $('.time-display').html(roundIt(display.timeDisplay, 2));
        var thetades = quadrotor.outerLoopStateFeedback(gameTargets[target].position.x,0,gameTargets[target].position.y,0,gameTargets[target].position.z,0);
        quadrotor.thetades = thetades;

        quadrotor.innerLoopStateFeedback(quadrotor.thetades[0], quadrotor.thetades[1], quadrotor.thetades[2], 0, 0, 0);
        quadrotor.simulateOneTimeStep();

        if(quadrotor.withinGameTarget(display.gameTargets[target])) {
          display.gameTargets[target].material.color = new THREE.Color( 0x009933 );
          display.counterTime += 0.02;
          if(display.counterTime >= 5) {
            display.counterTime = 0;
            display.gameTargets[target].material.color = new THREE.Color( 0x000000 );
            display.currentTarget++;
            if(display.currentTarget !== display.maxTargets) {
              display.gameTargets[target+1].material.color = new THREE.Color( 0xd52424 );
            }
          }
        } else {
          display.counterTime = 0;
          display.gameTargets[target].material.color = new THREE.Color( 0xd52424 );
        }

        quadrotor.rotateRotors();
        
        quadrotor.applyEulerAngles();
      }
    }
    if(display.currentTarget === display.maxTargets && set === false) {
      display.bestTime = display.timeDisplay;
      display.timeDisplay = 0;
      $('.time-display').html(roundIt(display.timeDisplay, 2));
      $('.best-time-display').html(roundIt(display.bestTime, 2));
      docCookies.setItem('bestTime', display.bestTime, Infinity);
      set = true;
    }
  });

  applyQs.click(function(event) {
    if($('.xdir-q11').val() !== "") {
      var xdirQ11 = Number($('.xdir-q11').val());
      var xdirQ12 = Number($('.xdir-q12').val());
      var xdirQ21 = Number($('.xdir-q21').val());
      var xdirQ22 = Number($('.xdir-q22').val());
      var xdirR = Number($('.xdir-r').val());

      var Q = [[xdirQ11,xdirQ12],[xdirQ21,xdirQ22]];
      var R = [xdirR];
      quadrotor.xDirOptimalControl(Q,R);
    }
    if($('.ydir-q11').val() !== "") {
      var ydirQ11 = Number($('.ydir-q11').val());
      var ydirQ12 = Number($('.ydir-q12').val());
      var ydirQ21 = Number($('.ydir-q21').val());
      var ydirQ22 = Number($('.ydir-q22').val());
      var ydirR = Number($('.ydir-r').val());

      var Q = [[ydirQ11,ydirQ12],[ydirQ21,ydirQ22]];
      var R = [ydirR];
      quadrotor.yDirOptimalControl(Q,R);
    }
    if($('.zdir-q11').val() !== "") {
      var zdirQ11 = Number($('.zdir-q11').val());
      var zdirQ12 = Number($('.zdir-q12').val());
      var zdirQ21 = Number($('.zdir-q21').val());
      var zdirQ22 = Number($('.zdir-q22').val());
      var zdirR = Number($('.zdir-r').val());

      var Q = [[zdirQ11,zdirQ12],[zdirQ21,zdirQ22]];
      var R = [zdirR];
      quadrotor.zDirOptimalControl(Q,R);
    }
    if($('.euler1-q11').val() !== "") {
      var euler1Q11 = Number($('.euler1-q11').val());
      var euler1Q12 = Number($('.euler1-q12').val());
      var euler1Q21 = Number($('.euler1-q21').val());
      var euler1Q22 = Number($('.euler1-q22').val());
      var euler1R = Number($('.euler1-r').val());

      var Q = [[euler1Q11,euler1Q12],[euler1Q21,euler1Q22]];
      var R = [euler1R];
      quadrotor.euler1OptimalControl(Q,R);
    }
    if($('.euler2-q11').val() !== "") {
      var euler2Q11 = Number($('.euler2-q11').val());
      var euler2Q12 = Number($('.euler2-q12').val());
      var euler2Q21 = Number($('.euler2-q21').val());
      var euler2Q22 = Number($('.euler2-q22').val());
      var euler2R = Number($('.euler2-r').val());

      var Q = [[euler2Q11,euler2Q12],[euler2Q21,euler2Q22]];
      var R = [euler2R];
      quadrotor.euler2OptimalControl(Q,R);
    }
    if($('.euler3-q11').val() !== "") {
      var euler3Q11 = Number($('.euler3-q11').val());
      var euler3Q12 = Number($('.euler3-q12').val());
      var euler3Q21 = Number($('.euler3-q21').val());
      var euler3Q22 = Number($('.euler3-q22').val());
      var euler3R = Number($('.euler3-r').val());

      var Q = [[euler3Q11,euler3Q12],[euler3Q21,euler3Q22]];
      var R = [euler3R];
      quadrotor.euler3OptimalControl(Q,R);
    }
  });

  reset.click(function() {
    quadrotor.resetPositionAngles();
    display.timeDisplay = 0;
    $('.time-display').html(display.timeDisplay);
    display.currentTarget = 0;
    set = false;
    display.start = false;
    for(var i = 0; i < gameTargets.length; i++) {
      gameTargets[i].material.color = new THREE.Color( 0x000000 );
    }
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