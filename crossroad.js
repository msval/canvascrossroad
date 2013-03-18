// canvas setup
var canvas = document.createElement('canvas');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// basic constants
var carRadius = 10; //px
var safteyDistance = carRadius + 5; //px
var semaphoreIntervals = 400; //animFrames
var carSpeed = 3; //px
var pushCarEveryNFrames = 30; //animFrames

// car
var Car = function (startPoint) {
	this.x = startPoint.x;
	this.y = startPoint.y;
	this.dx = startPoint.dx;
	this.dy = startPoint.dy;
	this.memdx = this.dx;
	this.memdy = this.dy;
	this.radius = carRadius;

	var r = Math.floor((Math.random() * 255));
	var g = Math.floor((Math.random() * 255));
	var b = Math.floor((Math.random() * 255));

	this.fill = 'rgb(' + r + ', ' + g + ',' + b + ')';
};
Car.prototype.stop = function () {
	this.dx = 0;
	this.dy = 0;
};
Car.prototype.start = function () {
	this.dx = this.memdx;
	this.dy = this.memdy;
};
Car.prototype.move = function () {
	ctx.clearRect (this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
	this.x += this.dx;
	this.y += this.dy;
};
Car.prototype.draw = function() {
	ctx.save();
	ctx.fillStyle = this.fill;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius - 1, 0, Math.PI * 2, true);
	ctx.fill();
	ctx.restore();
};
// car end

// Semaphore
var Semaphore = function (loc) {
	this.loc = loc;
	if (loc.greenOn) {
		this.light = 2;
		this.counter = semaphoreIntervals;
		this.counterdir = -1;
	} else {
		this.light = 0;
		this.counter = 0;
		this.counterdir = 1;
	}
};

Semaphore.prototype.draw = function () {
	ctx.save();
	var anchorx = this.loc.x;
	var anchory = this.loc.y;

	if (this.loc.dy < 0) {
		anchorx = this.loc.x;
		anchory = this.loc.y - (2 * this.loc.dy);
	} else if (this.loc.dx < 0) {
		anchorx = this.loc.x - (2 * this.loc.dx);
		anchory = this.loc.y;
	}

	ctx.fillStyle = 'black';
	ctx.fillRect (this.loc.x, this.loc.y, this.loc.width, this.loc.height);
	ctx.beginPath();
	ctx.fillStyle = 'gray';
	if (this.light === 0) {
		ctx.fillStyle = 'red';
	}
	var x = anchorx + (0 * this.loc.dx + 15);
	var y = anchory + (0 * this.loc.dy + 15);
	ctx.arc(x,y, 10, 0, Math.PI * 2, true);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = 'gray';
	if (this.light == 1) {
		ctx.fillStyle = 'orange';
	}
	x = anchorx + (1 * this.loc.dx + 15);
	y = anchory + (1 * this.loc.dy + 15);
	ctx.arc(x, y, 10, 0, Math.PI * 2, true);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = 'gray';
	if (this.light == 2) {
		ctx.fillStyle = 'green';
	}
	x = anchorx + (2 * this.loc.dx + 15);
	y = anchory + (2 * this.loc.dy + 15);
	ctx.arc(x, y, 10, 0, Math.PI * 2, true);
		ctx.fill();

		ctx.restore();	
};
Semaphore.prototype.check = function () {
	this.counter = (this.counter + this.counterdir);
	if (this.counter > semaphoreIntervals) {
		this.counterdir = -1;
	}
	if (this.counter <= 0) {
		this.counterdir = 1;
	}
	if (this.counter < semaphoreIntervals * 0.6) {
		this.light = 0;
	}
	if (this.counter >= semaphoreIntervals * 0.6 && this.counter < semaphoreIntervals * 0.65) {
		this.light = 1;
	}
	if (this.counter >= semaphoreIntervals * 0.65) {
		this.light = 2;
	}
};

// lane *****

// car starting points
var leftStart = {
	x : 0 + carRadius,
	y : canvas.height / 2 + safteyDistance,
	dx : carSpeed,
	dy : 0
};
var rightStart = {
	x : canvas.width - carRadius,
	y : canvas.height / 2 - safteyDistance,
	dx: -1 * carSpeed,
	dy: 0
};
var topStart = {
	x : canvas.width / 2 - safteyDistance,
	y : 0 + 2 * carRadius,
	dx : 0,
	dy : carSpeed
};
var bottomStart = {
	x : canvas.width / 2 + safteyDistance,
	y : canvas.height - 2 * carRadius,
	dx: 0,
	dy: -1 * carSpeed
};

// semaphore positions
var semLeft = {
	x: topStart.x - safteyDistance - carRadius / 2 - 75,
	y: leftStart.y + safteyDistance + carRadius / 2,
	width: 75,
	height: 30,
	dx: -22,
	dy: 0,
	greenOn : false,
	horizontal: true
};
var semRight = {
	x: bottomStart.x + safteyDistance + carRadius / 2,
	y: rightStart.y - carRadius / 2 - safteyDistance - 30,
	width: 75,
	height: 30,
	dx: 22,
	dy: 0,
	greenOn : false,
	horizontal: true
};
var semUp = {
	x: topStart.x - safteyDistance - carRadius / 2 - 30,
	y: rightStart.y - carRadius / 2 - safteyDistance - 75,
	width: 30,
	height: 75,
	dx: 0,
	dy: -22,
	greenOn : true
};
var semBottom = {
	x: bottomStart.x + safteyDistance + carRadius / 2,
	y: leftStart.y + safteyDistance + carRadius / 2,
	width: 30,
	height: 75,
	dx: 0,
	dy: 22,
	greenOn : true
};

//lane
var Lane = function (type) {
	this.type = type;

	// "up" line fence
	if (type === 'vertical') {
		this.upLineStart = {
			x: topStart.x - safteyDistance - carRadius / 2,
			y: 0
		};
	} else {
		this.upLineStart = {
			x: canvas.width,
			y: rightStart.y - carRadius / 2 - safteyDistance
		};
	}
	if (type === 'vertical') {
		this.upLineBreak = {
			x: topStart.x - safteyDistance - carRadius / 2,
			y: rightStart.y - carRadius / 2 - safteyDistance
		};
	} else {
		this.upLineBreak = {
			x: bottomStart.x + safteyDistance + carRadius / 2,
			y: rightStart.y - carRadius / 2 - safteyDistance
		};
	}
	if (type === 'vertical') {
		this.upLineBreakStart = {
			x: topStart.x - safteyDistance - carRadius / 2,
			y: leftStart.y + safteyDistance + carRadius / 2
		};
	} else {
		this.upLineBreakStart = {
			x: topStart.x - safteyDistance - carRadius / 2,
			y: rightStart.y - carRadius / 2 - safteyDistance
		};
	}
	if (type === 'vertical') {
		this.upLineBreakEnd = {
			x: topStart.x - safteyDistance - carRadius / 2,
			y: canvas.height
		};					
	} else {
		this.upLineBreakEnd = {
			x: 0,
			y: rightStart.y - carRadius / 2 - safteyDistance
		};
	}
	// "up" line fence end

	// "down" line fence
	if (type === 'vertical') {
		this.downLineStart = {
			x: bottomStart.x + safteyDistance + carRadius / 2,
			y: canvas.height
		};
	} else {
		this.downLineStart = {
			x: 0,
			y: leftStart.y + safteyDistance + carRadius / 2
		};
	}
	if (type === 'vertical') {
		this.downLineBreak = {
			x: bottomStart.x + safteyDistance + carRadius / 2,
			y: leftStart.y + safteyDistance + carRadius / 2
		};
	} else {
		this.downLineBreak = {
			x: topStart.x - safteyDistance - carRadius / 2,
			y: leftStart.y + safteyDistance + carRadius / 2
		};
	}
	if (type === 'vertical') {
		this.downLineBreakStart = {
			x: bottomStart.x + safteyDistance + carRadius / 2,
			y: rightStart.y - carRadius / 2 - safteyDistance
		};
	} else {
		this.downLineBreakStart = {
			x: bottomStart.x + safteyDistance + carRadius / 2,
			y: leftStart.y + safteyDistance + carRadius / 2
		};
	}
	if (type === 'vertical') {
		this.downLineBreakEnd = {
			x: bottomStart.x + safteyDistance + carRadius / 2,
			y: 0
		};
	} else {
		this.downLineBreakEnd = {
			x: canvas.width,
			y: leftStart.y + safteyDistance + carRadius / 2
		};
	}
	// "down" lane fence end

	// init lane logic
	if (type === 'vertical') {
		this.upSem = new Semaphore(semUp);
		this.downSem = new Semaphore(semBottom);
		this.upLaneStart = topStart;
		this.downLaneStart = bottomStart;
		this.upStop = rightStart.y - 2 * carRadius - safteyDistance;
		this.downStop = leftStart.y + safteyDistance + 2 * carRadius;
	} else {
		this.upSem = new Semaphore(semRight);
		this.downSem = new Semaphore(semLeft);
		this.upLaneStart = rightStart;
		this.downLaneStart = leftStart;
		this.upStop = bottomStart.x + safteyDistance + 2 * carRadius;
		this.downStop = topStart.x - safteyDistance - 2 * carRadius;
	}

	// add new cars, start the car addition counter
	this.upLaneCars = [new Car(this.upLaneStart)];
	this.downLaneCars = [new Car(this.downLaneStart)];
	this.counter = 0;
};

Lane.prototype.check = function () {
	this.upSem.check();
	this.downSem.check();

	// check add new car cycle
	this.counter += 1;
	if ((this.counter % pushCarEveryNFrames) === 0) {
		var lastUpCar = this.upLaneCars[this.upLaneCars.length - 1];
		var lastDownCar = this.downLaneCars[this.downLaneCars.length - 1];

		var newUpCar = new Car(this.upLaneStart);
		var newDownCar = new Car(this.downLaneStart);

		if (lastUpCar) {
			if (Math.abs(lastUpCar.x - newUpCar.x) > (carRadius + safteyDistance) || 
				Math.abs(lastUpCar.y - newUpCar.y) > (carRadius + safteyDistance)) {
				this.upLaneCars.push(newUpCar);
			}
		} else {
			this.upLaneCars.push(newUpCar);
		}

		if (lastDownCar) {
			if (Math.abs(lastDownCar.x - newDownCar.x) > (carRadius + safteyDistance) ||
				Math.abs(lastDownCar.y - newDownCar.y) > (carRadius + safteyDistance)) {
				this.downLaneCars.push(newDownCar);
			}
		} else {
			this.downLaneCars.push(newDownCar);
		}
	}
	// check add new car cycle end

	// check "up" lane cars
	for (var i = 0; i < this.upLaneCars.length; i++) {
		if (this.upSem.light === 0 || this.upSem.light == 1) {
			if (this.type === 'vertical') {
				if (this.upLaneCars[i].y <= this.upStop) {
					if ((this.upLaneCars[i].y + this.upLaneCars[i].dy) > this.upStop) {
						this.upLaneCars[i].stop();
					}
				}					
			} else {
				if (this.upLaneCars[i].x >= this.upStop) {
					if ((this.upLaneCars[i].x + this.upLaneCars[i].dx) < this.upStop) {
						this.upLaneCars[i].stop();
					}
				}
			}
		} else {
			this.upLaneCars[i].start();
		}

		// check for cars in front
		if (i > 0) {
			if (this.type === 'vertical') {
				if ((this.upLaneCars[i-1].y - this.upLaneCars[i].y + this.upLaneCars[i].dy) < (2 * carRadius + safteyDistance)) {
					this.upLaneCars[i].stop();		
				}
			} else {
				if ((this.upLaneCars[i].x + this.upLaneCars[i].dx - this.upLaneCars[i-1].x) < (2 * carRadius + safteyDistance)) {
					this.upLaneCars[i].stop();
				}
			}
		}

		this.upLaneCars[i].move();
	}

	// remove cars from the queue if they move off the canvas
	if (this.upLaneCars.length > 0) {
		if (this.upLaneCars[0].x < 0 ||
			this.upLaneCars[0].x > canvas.width ||
			this.upLaneCars[0].y < 0 ||
			this.upLaneCars[0].y > canvas.height) {

			this.upLaneCars.splice(0, 1);
		}
	}
	// check "up" lane cars end

	// check "down" lane cars
	for (i = 0; i < this.downLaneCars.length; i++) {
		if (this.downSem.light === 0 || this.downSem.light == 1) {
			if (this.type === 'vertical') {
				if (this.downLaneCars[i].y >= this.downStop) {
					if ((this.downLaneCars[i].y + this.downLaneCars[i].dy) < this.downStop) {
						this.downLaneCars[i].stop();
					}
				}
			} else {
				if (this.downLaneCars[i].x <= this.downStop) {
					if ((this.downLaneCars[i].x + this.downLaneCars[i].dx) > this.downStop) {
						this.downLaneCars[i].stop();
					}
				}
			}
		} else {
			this.downLaneCars[i].start();
		}

		// check for cars in front
		if (i > 0) {
			if (this.type === 'vertical') {
				if ((this.downLaneCars[i].y + this.downLaneCars[i].dy - this.downLaneCars[i-1].y) < (2 * carRadius + safteyDistance)) {
					this.downLaneCars[i].stop();
				}
			} else {
				if ((this.downLaneCars[i-1].x - this.downLaneCars[i].x + this.downLaneCars[i].dx) < (2 * carRadius + safteyDistance)) {
					this.downLaneCars[i].stop();
				}
			}
		}

		this.downLaneCars[i].move();
	}

	// remove cars from the queue if they move off the canvas
	if (this.downLaneCars.length > 0) {
		if (this.downLaneCars[0].x < 0 ||
			this.downLaneCars[0].x > canvas.width ||
			this.downLaneCars[0].y < 0 ||
			this.downLaneCars[0].y > canvas.height) {

			this.downLaneCars.splice(0, 1);
		}
	}
	// check "down" lane cars end
};

Lane.prototype.draw = function () {
	ctx.save();

	ctx.beginPath();
    ctx.moveTo(this.upLineStart.x, this.upLineStart.y);
    ctx.lineTo(this.upLineBreak.x, this.upLineBreak.y);
    ctx.moveTo(this.upLineBreakStart.x, this.upLineBreakStart.y);
    ctx.lineTo(this.upLineBreakEnd.x, this.upLineBreakEnd.y);
    ctx.closePath();
    ctx.stroke();

	ctx.beginPath();
    ctx.moveTo(this.downLineStart.x, this.downLineStart.y);
    ctx.lineTo(this.downLineBreak.x, this.downLineBreak.y);
    ctx.moveTo(this.downLineBreakStart.x, this.downLineBreakStart.y);
    ctx.lineTo(this.downLineBreakEnd.x, this.downLineBreakEnd.y);
    ctx.closePath();
    ctx.stroke();

	ctx.restore();

	this.upSem.draw();
	this.downSem.draw();

	for (var i = 0; i < this.upLaneCars.length; i++) {
		this.upLaneCars[i].draw();
	}

	for (i = 0; i < this.downLaneCars.length; i++) {
		this.downLaneCars[i].draw();
	}
};

// lane end *****

var laneh = new Lane('horizontal');
var lanev = new Lane('vertical');

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function animloop(){
	requestAnimFrame(animloop);

	laneh.check();
	lanev.check();

	laneh.draw();
	lanev.draw();

})();