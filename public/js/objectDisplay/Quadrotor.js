function Quadrotor() {
  this.mass = .6; //kg
  this.g = 9.8; //m/s^2
  this.sparLength = 5;
  this.kF = Math.pow(10, -5);
  this.kM = Math.pow(10, -6);
  this.J1 = 4015.665/1000000;
  this.J2 = 4015.665/1000000;
  this.J3 = 8000.665/1000000;

  this.euler1 = 0;
  this.euler2 = 0;
  this.euler3 = 0;

  this.w1dot = 0;
  this.w2dot = 0;
  this.w3dot = 0;

  this.w1 = 0;
  this.w2 = 0;
  this.w3 = 0;

  this.v1dot = 0;
  this.v2dot = 0;
  this.v3dot = 0;

  this.v1 = 0;
  this.v2 = 0;
  this.v3 = 0;

  this.u1 = 0;
  this.u2 = 0;
  this.u3 = 0;
  this.u4 = this.mass*this.g;

  this.k1outer = [-0.03,-0.09];
  this.k2outer = [0.03,0.09];
  this.k3outer = [4.3, 4.3];

  this.k1inner = [.24,.24];
  this.k2inner = [.24,.24];
  this.k3inner = [.09,.05];

  this.WMatrix = this.buildWMatrix();

  this.computeRotorSpeedsAndForces();

  this.model = this.buildCopter();

  this.loopCounter = 0;
  this.thetaDes = [0,0,0];
}

Quadrotor.prototype.buildCopter = function() {
  var sl = this.sparLength;
  var quadrotor = new THREE.Object3D();
  var body = new THREE.Mesh(new THREE.CylinderGeometry(.7*sl, .7*sl, .1*sl, 32), new THREE.MeshNormalMaterial);
  quadrotor.add(body);
  body.rotation.x = Math.PI/2;
  var rotor1 = new THREE.Mesh(new THREE.CylinderGeometry(.3*sl, .3*sl, .06*sl, 32), new THREE.MeshNormalMaterial);
  quadrotor.add(rotor1);
  rotor1.position.x = this.sparLength;
  rotor1.rotation.x = Math.PI/2;
  var rotor2 = new THREE.Mesh(new THREE.CylinderGeometry(.3*sl, .3*sl, .06*sl, 32), new THREE.MeshNormalMaterial);
  quadrotor.add(rotor2);
  rotor2.position.y = this.sparLength;
  rotor2.rotation.x = Math.PI/2;
  var rotor3 = new THREE.Mesh(new THREE.CylinderGeometry(.3*sl, .3*sl, .06*sl, 32), new THREE.MeshNormalMaterial);
  quadrotor.add(rotor3);
  rotor3.position.x = -this.sparLength;
  rotor3.rotation.x = Math.PI/2;
  var rotor4 = new THREE.Mesh(new THREE.CylinderGeometry(.3*sl, .3*sl, .06*sl, 32), new THREE.MeshNormalMaterial);
  quadrotor.add(rotor4);
  rotor4.position.y = -this.sparLength;
  rotor4.rotation.x = Math.PI/2;

  return quadrotor;
}

Quadrotor.prototype.buildWMatrix = function() {
  var kF = this.kF;
  var kM = this.kM;
  var l = this.sparLength;
  var W = new THREE.Matrix4(0, -kF*l, 0, kF*l,
                            kF*l, 0, -kF*l, 0,
                            -kM, kM, -kM, kM,
                            kF, kF, kF, kF);
  return W;
}

Quadrotor.prototype.computeRotorSpeedsAndForces = function() {
  var W = this.WMatrix,
      u1 = this.u1,
      u2 = this.u2,
      u3 = this.u3,
      u4 = this.u4,
      inputs = new THREE.Vector4(u1,u2,u3,u4);

  var inverse = new THREE.Matrix4();
  inverse.getInverse(W);
  var rotorSpeedsSquared = inputs.applyMatrix4(inverse);

  this.rotor1Speed = Math.sqrt(rotorSpeedsSquared.x); //rad/s
  this.rotor1Rotation = new THREE.Matrix4();
  this.rotor1Rotation.makeRotationY(this.rotor1Speed/60);//Rotates clockwise viewed from above (+)
  this.rotor2Speed = Math.sqrt(rotorSpeedsSquared.y); //rad/s
  this.rotor2Rotation = new THREE.Matrix4();
  this.rotor2Rotation.makeRotationY(-this.rotor2Speed/60);//Rotates counterclockwise viewed from above (-)
  this.rotor3Speed = Math.sqrt(rotorSpeedsSquared.z); //rad/s
  this.rotor3Rotation = new THREE.Matrix4();
  this.rotor3Rotation.makeRotationY(this.rotor3Speed/60);//Rotates clockwise viewed from above (+)
  this.rotor4Speed = Math.sqrt(rotorSpeedsSquared.w); //rad/s
  this.rotor4Rotation = new THREE.Matrix4();
  this.rotor4Rotation.makeRotationY(-this.rotor4Speed/60);//Rotates counterclockwise viewed from above (-)

  this.forceRotor1 = Math.pow(this.rotor1Speed, 2)*this.kF;
  this.forceRotor2 = Math.pow(this.rotor2Speed, 2)*this.kF;
  this.forceRotor3 = Math.pow(this.rotor3Speed, 2)*this.kF;
  this.forceRotor4 = Math.pow(this.rotor4Speed, 2)*this.kF;

  this.forces = [this.forceRotor1, this.forceRotor2, this.forceRotor3, this.forceRotor4];
}

Quadrotor.prototype.setForces = function(forces) {
  this.forces = forces;
  this.forceRotor1 = forces[0];
  this.forceRotor2 = forces[1];
  this.forceRotor3 = forces[2];
  this.forceRotor4 = forces[3];

  this.setRotor1speed(Math.sqrt(forces[0]/this.kF));
  this.setRotor2speed(Math.sqrt(forces[1]/this.kF));
  this.setRotor3speed(Math.sqrt(forces[2]/this.kF));
  this.setRotor4speed(Math.sqrt(forces[3]/this.kF));

  this.setInputs();
}

Quadrotor.prototype.setRotorSpeedsAndInputs = function() {
  this.forces = [this.forceRotor1, this.forceRotor2, this.forceRotor3, this.forceRotor4];

  this.setRotor1speed(Math.sqrt(this.forces[0]/this.kF));
  this.setRotor2speed(Math.sqrt(this.forces[1]/this.kF));
  this.setRotor3speed(Math.sqrt(this.forces[2]/this.kF));
  this.setRotor4speed(Math.sqrt(this.forces[3]/this.kF));

  this.setInputs();
}

Quadrotor.prototype.setInputs = function() {
  var W = this.WMatrix,
      r1 = this.rotor1Speed,
      r2 = this.rotor2Speed,
      r3 = this.rotor3Speed,
      r4 = this.rotor4Speed,
      rotorSpeedsSquared = new THREE.Vector4(Math.pow(r1,2),Math.pow(r2,2),Math.pow(r3,2),Math.pow(r4,2));
  var inputs = rotorSpeedsSquared.applyMatrix4(W);

  this.u1 = inputs.x;
  this.u2 = inputs.y;
  this.u3 = inputs.z;
  this.u4 = inputs.w;
}

Quadrotor.prototype.setRotor1speed = function(val) {
  this.rotor1Speed = val;
  this.rotor1Rotation.makeRotationY(this.rotor1Speed/60); //The speed is given in rad/s. There are ~60 frames per second
}

Quadrotor.prototype.setRotor2speed = function(val) {
  this.rotor2Speed = val;
  this.rotor2Rotation.makeRotationY(this.rotor2Speed/60); //The speed is given in rad/s. There are ~60 frames per second
}

Quadrotor.prototype.setRotor3speed = function(val) {
  this.rotor3Speed = val;
  this.rotor3Rotation.makeRotationY(this.rotor3Speed/60); //The speed is given in rad/s. There are ~60 frames per second
}

Quadrotor.prototype.setRotor4speed = function(val) {
  this.rotor4Speed = val;
  this.rotor4Rotation.makeRotationY(this.rotor4Speed/60); //The speed is given in rad/s. There are ~60 frames per second
}

Quadrotor.prototype.rotateBody = function(rot, axis) {
  if(axis.toLowerCase() === 'euler1') {
    this.euler1 += rot;
  } else if(axis.toLowerCase() === 'euler2') {
    this.euler2 += rot;
  } else if(axis.toLowerCase() === 'euler3') {
    this.euler3 += rot;
  } else {
    console.log('Body Rotation error, axis not specified');
  }
  e1 = this.euler1;
  e2 = this.euler2;
  e3 = this.euler3;
  
  var rotMat = this.getRotationMatrix(e1,e2,e3);
  this.model.rotation.setFromRotationMatrix(rotMat);
}

Quadrotor.prototype.getRotationMatrix = function(e1,e2,e3) {
  var cos = Math.cos;
  var sin = Math.sin;
  var rotMat = new THREE.Matrix4(cos(e1)*cos(e2), cos(e1)*sin(e2)*sin(e3)-sin(e1)*cos(e3), cos(e1)*sin(e2)*cos(e3)+sin(e1)*sin(e3), 0,
                                sin(e1)*cos(e2), sin(e1)*sin(e2)*sin(e3)+cos(e1)*cos(e3), sin(e1)*sin(e2)*cos(e3)-cos(e1)*sin(e3), 0,
                                -sin(e2), cos(e2)*sin(e3), cos(e2)*cos(e3), 0,
                                0, 0, 0, 1);
  return rotMat;
}

Quadrotor.prototype.applyEulerAngles = function() {
  e1 = this.euler1;
  e2 = this.euler2;
  e3 = this.euler3;

  var rotMat = this.getRotationMatrix(e1,e2,e3);
  this.model.rotation.setFromRotationMatrix(rotMat);
}

//Takes in a hash that contains (possibly) xpos, ypos, zpos
Quadrotor.prototype.positionBody = function(positionHash) {
  if(positionHash.xpos !== null) { this.model.position.x = positionHash.xpos; }
  if(positionHash.ypos !== null) { this.model.position.y = positionHash.ypos; }
  if(positionHash.zpos !== null) { this.model.position.z = positionHash.zpos; }
}

//Takes in a hash that contains (possibly) xpos, ypos, zpos
Quadrotor.prototype.moveBody = function(positionHash) {
  if(positionHash.xpos !== null) { this.model.position.x += positionHash.xpos; }
  if(positionHash.ypos !== null) { this.model.position.y += positionHash.ypos; }
  if(positionHash.zpos !== null) { this.model.position.z += positionHash.zpos; }
}

Quadrotor.prototype.rotateRotors = function() {
  var rotation = new THREE.Matrix4();
  rotation.makeRotationFromEuler(this.model.children[1].rotation);
  rotation.multiply(this.rotor1Rotation);
  this.model.children[1].rotation.setFromRotationMatrix(rotation);
  rotation.makeRotationFromEuler(this.model.children[2].rotation);
  rotation.multiply(this.rotor2Rotation);
  this.model.children[2].rotation.setFromRotationMatrix(rotation);
  rotation.makeRotationFromEuler(this.model.children[3].rotation);
  rotation.multiply(this.rotor3Rotation);
  this.model.children[3].rotation.setFromRotationMatrix(rotation);
  rotation.makeRotationFromEuler(this.model.children[4].rotation);
  rotation.multiply(this.rotor4Rotation);
  this.model.children[4].rotation.setFromRotationMatrix(rotation);
}

Quadrotor.prototype.showForces = function() {
  var model = this.model;
  var body = model.children[0];
  var dir = new THREE.Vector3( 0, -1, 0 ); //Because cylinders are drawn along the y axis, and had to be rotated
  var hex = 0x0000ff;
  for(var i = 0; i < this.forces.length; i++) {
    var rotor = model.children[i+1];
    if(i%2 === 0) {
      var origin = new THREE.Vector3( rotor.position.x, 0, 0 );
    } else {
      var origin = new THREE.Vector3( 0, 0, rotor.position.y );
    }
    
    var length = this.forces[i]*8;

    if(body.getObjectByName('rotor' + i + 'force') !== undefined) {
      body.remove(body.getObjectByName('rotor' + i + 'force'));
    }

    var forceArrow = new THREE.ArrowHelper( dir, origin, length, hex );
    forceArrow.name = 'rotor' + i + 'force';
    body.add(forceArrow);
  }
}

Quadrotor.prototype.withinGameTarget = function(target) {
  var targetPosition = target.position;
  var targetRadius = target.geometry.boundingSphere.radius;
  var quadPosition = this.model.position;
  var rotMat = this.getRotationMatrix(this.euler1, this.euler2, this.euler3);
  rotMat.transpose();
  
  var p = new THREE.Vector3(5,0,0);
  var p1 = p.applyMatrix4(rotMat);
  p1.add(quadPosition);
  var p = new THREE.Vector3(-5,0,0);
  var p2 = p.applyMatrix4(rotMat);
  p2.add(quadPosition);
  var p = new THREE.Vector3(0,5,0);
  var p3 = p.applyMatrix4(rotMat);
  p3.add(quadPosition);
  var p = new THREE.Vector3(0,-5,0);
  var p4 = p.applyMatrix4(rotMat);
  p4.add(quadPosition);

  var p1Dist = getDistance(p1, targetPosition);
  var p2Dist = getDistance(p2, targetPosition);
  var p3Dist = getDistance(p3, targetPosition);
  var p4Dist = getDistance(p4, targetPosition);

  if(p1Dist > targetRadius) {
    return false;
  }
  if(p2Dist > targetRadius) {
    return false;
  }
  if(p3Dist > targetRadius) {
    return false;
  }
  if(p4Dist > targetRadius) {
    return false;
  }
  return true;

  function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2) + Math.pow(p1.z-p2.z,2))
  }
}

Quadrotor.prototype.applyOneTimeStepFullEOM = function() {
  var w1 = this.w1,
      w2 = this.w2,
      w3 = this.w3,
      v1 = this.v1,
      v2 = this.v2,
      v3 = this.v3,
      u1 = this.u1,
      u2 = this.u2,
      u3 = this.u3,
      u4 = this.u4,
      m = this.mass,
      g = this.g,
      J1 = this.J1,
      J2 = this.J2,
      J3 = this.J3,
      e1 = this.euler1,
      e2 = this.euler2,
      e3 = this.euler3,
      cos = Math.cos,
      sin = Math.sin,
      model = this.model,
      dt = 1/60;

  //Apply equations of motion and kinematic equations for the discrete time step dt
  var v1dot = -u4/m*(cos(e1)*sin(e2)*cos(e3) + sin(e1)*sin(e3));
  var v2dot = -u4/m*(sin(e1)*sin(e2)*cos(e3) - cos(e1)*sin(e3));
  var v3dot = -u4/m*(cos(e2)*cos(e3)) + g;

  var w1dot = (u1 - w2*w3*(J3-J2))/J1;
  var w2dot = (u2 - w1*w3*(J1-J3))/J2;
  var w3dot = (u3 - w1*w2*(J2-J1))/J3;

  var w1new = w1 + w1dot*dt;
  var w2new = w2 + w2dot*dt;
  var w3new = w3 + w3dot*dt;

  var v1new = v1 + v1dot*dt;
  var v2new = v2 + v2dot*dt;
  var v3new = v3 + v3dot*dt;

  var e1dot = sin(e3)*w2/cos(e2) + cos(e3)*w3/cos(e2);
  var e2dot = cos(e3)*w2 - sin(e3)*w3;
  var e3dot = w1 + sin(e2)*sin(e3)*w2/cos(e2) + sin(e2)*cos(e3)*w3/cos(e2);

  this.rotateBody(e1dot*dt, 'euler1');
  this.rotateBody(e2dot*dt, 'euler2');
  this.rotateBody(e3dot*dt, 'euler3');

  model.position.x += v1*dt + 0.5*v1dot*Math.pow(dt, 2);
  model.position.y += v2*dt + 0.5*v2dot*Math.pow(dt, 2);
  model.position.z += v3*dt + 0.5*v3dot*Math.pow(dt, 2);

  this.w1dot = w1dot;
  this.w2dot = w2dot;
  this.w3dot = w3dot;

  this.w1 = w1new;
  this.w2 = w2new;
  this.w3 = w3new;

  this.v1dot = v1dot;
  this.v2dot = v2dot;
  this.v3dot = v3dot;

  this.v1 = v1new;
  this.v2 = v2new;
  this.v3 = v3new;
}

Quadrotor.prototype.resetPositionAngles = function() {
  var model = this.model;
  model.position.x = 0;
  model.position.y = 0;
  model.position.z = 0;
  this.euler1 = 0;
  this.euler2 = 0;
  this.euler3 = 0;

  this.w1dot = 0;
  this.w2dot = 0;
  this.w3dot = 0;

  this.w1 = 0;
  this.w2 = 0;
  this.w3 = 0;

  this.v1dot = 0;
  this.v2dot = 0;
  this.v3dot = 0;

  this.v1 = 0;
  this.v2 = 0;
  this.v3 = 0;

  this.u1 = 0;
  this.u2 = 0;
  this.u3 = 0;
  this.u4 = this.mass*this.g;
  this.applyEulerAngles();
}

Quadrotor.prototype.xDirOptimalControl = function(Q,R) {
  var dt = 1/60,
      g = this.g
      m = this.mass;

  var Adx = [[1,dt], [0,1]];
  var Bdx = [0, -g*dt];
  k1outer = this.computeKSteadyState(Q, R, Adx, Bdx);
  this.k1outer = k1outer.elements[0];
  console.log(this.k1outer);
}

Quadrotor.prototype.yDirOptimalControl = function(Q,R) {
  var dt = 1/60,
      g = this.g
      m = this.mass;

  var Ady = [[1,dt], [0,1]];
  var Bdy = [0, g*dt];
  k2outer = this.computeKSteadyState(Q, R, Ady, Bdy);
  this.k2outer = k2outer.elements[0];
}

Quadrotor.prototype.zDirOptimalControl = function(Q,R) {
  var dt = 1/60,
      g = this.g
      m = this.mass;

  var Adz = [[1,dt], [0,1]];
  var Bdz = [0, -dt*1/m];
  k3outer = this.computeKSteadyState(Q, R, Adz, Bdz);
  this.k3outer = k3outer.elements[0];
  //Hack to make it behave properly - check this out later
  this.k3outer[0] = -this.k3outer[0];
  this.k3outer[1] = -this.k3outer[1];
}

Quadrotor.prototype.euler1OptimalControl = function(Q,R) {
  var J1 = this.J1,
      J2 = this.J2,
      J3 = this.J3,
      dt = 1/60;

  var Adtheta1 = [[1,dt], [0,1]];
  var Bdtheta1 = [0, dt*1/J3];
  k1inner = this.computeKSteadyState(Q, R, Adtheta1, Bdtheta1);
  this.k1inner = k1inner.elements[0];
}

Quadrotor.prototype.euler2OptimalControl = function(Q,R) {
  var J1 = this.J1,
      J2 = this.J2,
      J3 = this.J3,
      dt = 1/60;

  var Adtheta2 = [[1,dt], [0,1]];
  var Bdtheta2 = [0, dt*1/J2];
  k2inner = this.computeKSteadyState(Q, R, Adtheta2, Bdtheta2);
  this.k2inner = k2inner.elements[0]; 
}

Quadrotor.prototype.euler3OptimalControl = function(Q,R) {
  var J1 = this.J1,
      J2 = this.J2,
      J3 = this.J3,
      dt = 1/60;

  var Adtheta3 = [[1,dt], [0,1]];
  var Bdtheta3 = [0, dt*1/J1];
  k3inner = this.computeKSteadyState(Q, R, Adtheta3, Bdtheta3);
  this.k3inner = k3inner.elements[0];
}

Quadrotor.prototype.computeKSteadyState = function(Q2, R2, Ad2, Bd2) {
  // P{i} = Q + Ad'*P{i+1}*Ad - Ad'*P{i+1}*Bd*inv(R+Bd'*P{i+1}*Bd)*Bd'*P{i+1}*Ad;
  // K(i,:) = inv(R+Bd'*P{i+1}*Bd)*Bd'*P{i+1}*Ad;


  var Q = $M(Q2);
  var R = $M(R2);
  var Ad = $M(Ad2);
  var Adtran = Ad.transpose();

  var Bd = $M(Bd2);
  var Bdtran = Bd.transpose();
  var Qfinal = Q;
  var n = 5000;
  var P = new Array(n);
  var K = new Array(n);
  P[n-1] = Qfinal;
  var i = n-2;
  for(var i = n-2; i >= 0; i--) {
    var step1 = P[i+1].x(Ad);
    var step2 = Bdtran.x(step1);

    var step3 = P[i+1].x(Bd);
    var step4 = Bdtran.x(step3);
    var step5 = R.add(step4);
    step5 = $M([1/step5.elements[0][0]]);

    var step6 = step5.x(step2);
    var step7 = Bd.x(step6);
    var step8 = P[i+1].x(step7);
    var step9 = Adtran.x(step8);

    var step10 = P[i+1].x(Ad);
    var step11 = Adtran.x(step10);
    var step12 = step11.subtract(step9);

    P[i] = Q.add(step12);

    var step13 = P[i+1].x(Ad);
    var step14 = Bdtran.x(step13);

    var step15 = P[i+1].x(Bd);
    var step16 = Bdtran.x(step15);
    var step17 = R.add(step16);
    var step18 = $M([1/step17.elements[0][0]]);

    K[i] = step18.x(step14);
  }
  return K[0];
}

Quadrotor.prototype.outerLoopStateFeedback = function(xdes, v1des, ydes, v2des, zdes, v3des) {
  var k1 = this.k1outer,
      k2 = this.k2outer,
      k3 = this.k3outer,
      model = this.model,
      xpos = model.position.x,
      ypos = model.position.y,
      zpos = model.position.z,
      v1 = this.v1,
      v2 = this.v2,
      v3 = this.v3;

  var theta1des = 0;
  var theta2des = -(k1[0]*(xpos - xdes) + k1[1]*(v1 - v1des)); //This is theta2 desired
  var theta3des = -(k2[0]*(ypos - ydes) + k2[1]*(v2 - v2des)); //This is theta3 desired
  var uz = -(k3[0]*(zpos - zdes) + k3[1]*(v3 - v3des)); //This is u4

  // theta2des = Math.min(Math.PI/4, theta2des);
  // theta2des = Math.max(-Math.PI/4, theta2des);
  
  // theta3des = Math.min(Math.PI/4, theta3des);
  // theta3des = Math.max(-Math.PI/4, theta3des);


  this.u4 = -uz + this.mass*this.g;
  return [theta1des, theta2des, theta3des];
}

Quadrotor.prototype.innerLoopStateFeedback = function(theta1des, theta2des, theta3des, w1des, w2des, w3des) {
  var k1 = this.k1inner,
      k2 = this.k2inner,
      k3 = this.k3inner,
      theta1 = this.euler1,
      theta2 = this.euler2,
      theta3 = this.euler3,
      w1 = this.w1,
      w2 = this.w2,
      w3 = this.w3;


  var u3 = -(k3[0]*(theta1 - theta1des) + k3[1]*(w3 - w3des));
  var u2 = -(k2[0]*(theta2 - theta2des) + k2[1]*(w2 - w2des));
  var u1 = -(k1[0]*(theta3 - theta3des) + k1[1]*(w1 - w1des));

  this.u1 = u1;
  this.u2 = u2;
  this.u3 = u3;
}

Quadrotor.prototype.simulateOneTimeStep = function() {
  var model = this.model,

      q1 = model.position.x,
      q2 = model.position.y,
      q3 = model.position.z,
      v1 = this.v1,
      v2 = this.v2,
      v3 = this.v3,
      e1 = this.euler1,
      e2 = this.euler2,
      e3 = this.euler3,
      w1 = this.w1,
      w2 = this.w2,
      w3 = this.w3,

      u1 = this.u1,
      u2 = this.u2,
      u3 = this.u3,
      u4 = this.u4,


      m = this.mass,
      g = this.g,
      J1 = this.J1,
      J2 = this.J2,
      J3 = this.J3,
      dt = 1/60;


  //Approximate discretization
  var Ad = $M([
      [1,0,0,dt,0,0,0,0,0,0,0,0],
      [0,1,0,0,dt,0,0,0,0,0,0,0],
      [0,0,1,0,0,dt,0,0,0,0,0,0],
      [0,0,0,1,0,0,0,-g*dt,0,0,0,0],
      [0,0,0,0,1,0,0,0,g*dt,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,0,0,0,0,dt],
      [0,0,0,0,0,0,0,1,0,0,dt,0],
      [0,0,0,0,0,0,0,0,1,dt,0,0],
      [0,0,0,0,0,0,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,1]
  ]);

  var Bd = $M([
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,-dt*1/m],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [dt*1/J1,0,0,0],
      [0,dt*1/J2,0,0],
      [0,0,dt*1/J3,0]
  ]);

  var currentState = $M([
    [q1],
    [q2],
    [q3],
    [v1],
    [v2],
    [v3],
    [e1],
    [e2],
    [e3],
    [w1],
    [w2],
    [w3]
  ]);

  var inputs = $M([
    [u1],
    [u2],
    [u3],
    [u4]
  ]);

  
  var firstPart = Ad.x(currentState);
  
  var secondPart = Bd.x(inputs);

  var newState = firstPart.add(secondPart);

  model.position.x = newState.elements[0][0];
  model.position.y = newState.elements[1][0];
  model.position.z = newState.elements[2][0];
  this.v1 = newState.elements[3][0];
  this.v2 = newState.elements[4][0];
  this.v3 = newState.elements[5][0] + dt*g;
  this.euler1 = newState.elements[6][0];
  this.euler2 = newState.elements[7][0];
  this.euler3 = newState.elements[8][0];
  this.w1 = newState.elements[9][0];
  this.w2 = newState.elements[10][0];
  this.w3 = newState.elements[11][0];


  // this.computeRotorSpeedsAndForces();
}

