
/*
Simple 2D JavaScript Vector Class
Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js
*/

function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

/* INSTANCE METHODS */

Vector.prototype = {
	negative: function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	},
	add: function(v) {
		if (v instanceof Vector) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += v;
		}
		return this;
	},
	subtract: function(v) {
		if (v instanceof Vector) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= v;
		}
		return this;
	},
	multiply: function(v) {
		if (v instanceof Vector) {
			this.x *= v.x;
			this.y *= v.y;
		} else {
			this.x *= v;
			this.y *= v;
		}
		return this;
	},
	divide: function(v) {
		if (v instanceof Vector) {
			if(v.x != 0) this.x /= v.x;
			if(v.y != 0) this.y /= v.y;
		} else {
			if(v != 0) {
				this.x /= v;
				this.y /= v;
			}
		}
		return this;
	},
	equals: function(v) {
		return this.x == v.x && this.y == v.y;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	cross: function(v) {
		return this.x * v.y - this.y * v.x
	},
	length: function() {
		return Math.sqrt(this.dot(this));
	},
	normalize: function() {
		return this.divide(this.length());
	},
	min: function() {
		return Math.min(this.x, this.y);
	},
	max: function() {
		return Math.max(this.x, this.y);
	},
	toAngles: function() {
		return -Math.atan2(-this.y, this.x);
	},
	angleTo: function(a) {
		return Math.acos(this.dot(a) / (this.length() * a.length()));
	},
	toArray: function(n) {
		return [this.x, this.y].slice(0, n || 2);
	},
	clone: function() {
		return new Vector(this.x, this.y);
	},
	set: function(x, y) {
		this.x = x; this.y = y;
		return this;
	}
};

/* STATIC METHODS */
Vector.negative = function(v) {
	return new Vector(-v.x, -v.y);
};
Vector.add = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
	else return new Vector(a.x + b, a.y + b);
};
Vector.subtract = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
	else return new Vector(a.x - b, a.y - b);
};
Vector.multiply = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
	else return new Vector(a.x * b, a.y * b);
};
Vector.divide = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
	else return new Vector(a.x / b, a.y / b);
};
Vector.equals = function(a, b) {
	return a.x == b.x && a.y == b.y;
};
Vector.dot = function(a, b) {
	return a.x * b.x + a.y * b.y;
};
Vector.cross = function(a, b) {
	return a.x * b.y - a.y * b.x;
};










var ballsArray = new Array();
var numberOfBalls = 10;
var radius = 10;
var radiusX2 = radius * 2;
var locationOk = false;
var newEl = null;
var myTimer = null;
var canvas = null;
var ctx = null; //context
var timeFrame = 50;
var fallingSped = 10;






// Usual function
function distance(p1,p2){
	var dx = p2.position.x-p1.position.x;
	var dy = p2.position.y-p1.position.y;
	return Math.sqrt(dx*dx + dy*dy);
}
// Faster approximation
function distanceApprox(p1,p2){
	// Approximation by using octagons approach
	var x = p2.x-p1.x;
	var y = p2.y-p1.y;
	return 1.426776695*Math.min(0.7071067812*(Math.abs(x)+Math.abs(y)), Math.max (Math.abs(x), Math.abs(y)));	
}

function fromDegreesToRadians (angle) {
  return angle * (Math.PI / 180);
}

function normalize(point, scale) {
  var norm = Math.sqrt(point.direction.x * point.direction.x + point.direction.y * point.direction.y);
  if (norm != 0) { // as3 return 0,0 for a point of zero length
    point.direction.x = scale * point.direction.x / norm;
    point.direction.y = scale * point.direction.y / norm;
  }
}


function drawBg()
{
	for (var i = 0; i < 3; i++) 
	{
		ctx.beginPath();
		ctx.moveTo(0, (i+1)*100);
		ctx.lineTo(400,(i+1)*100);
		ctx.strokeStyle = 'red';
		ctx.stroke();
		
		ctx.font = "10px Comic Sans MS";
		ctx.fillStyle = "red";
		ctx.textAlign = "left";
		ctx.fillText((i+1)*100, 0,(i+1)*100);
		
		ctx.beginPath();
		ctx.moveTo((i+1)*100, 0);
		ctx.lineTo((i+1)*100,400);
		ctx.strokeStyle = 'blue';
		ctx.stroke();
		
		ctx.font = "10px Comic Sans MS";
		ctx.fillStyle = "blue";
		ctx.textAlign = "left";
		ctx.fillText((i+1)*100, (i+1)*100,10);

	}
	

	ctx.font = "10px Comic Sans MS";
	ctx.fillStyle = "red";
	ctx.textAlign = "left";
	ctx.fillText('y', 0,20);

	
	ctx.font = "10px Comic Sans MS";
	ctx.fillStyle = "blue";
	ctx.textAlign = "left";
	ctx.fillText('x', 20,5);
		
}

function UpdateBalls() {
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	drawBg();
	for (var i = 0; i < ballsArray.length; i++) 
	{	
		var el1 = ballsArray[i];
		//1. Check if there is a collision
		
		//1.1. Check collision with canvas edge
		if(el1.position.x > (canvas.width-radius) || el1.position.x < radius)
		{
			el1.direction.x *=-1;
		}
		if(el1.position.y > (canvas.height-radius) || el1.position.y < radius)
		{
			el1.direction.y *=-1;
		}
			
		//1.2. Check collision with other balls

		for (var j = i+1; j < ballsArray.length; j++) 
		{
			var el2 = ballsArray[j];
			if((Math.abs(el2.position.x - el1.position.x)<radiusX2)&&(Math.abs(el2.position.y - el1.position.y)<radiusX2))
			{
				//colision detected

				
				ctx.beginPath();
				ctx.arc(el1.position.x, el1.position.y, radius, 0, 2 * Math.PI);
				ctx.fillStyle = "blue";
				ctx.fill();
				
				ctx.beginPath();
				ctx.arc(el2.position.x, el2.position.y, radius, 0, 2 * Math.PI);
				ctx.fillStyle = "red";
				ctx.fill();
				
				ctx.beginPath();
				ctx.moveTo(el2.position.x, el2.position.y);
				ctx.lineTo(el2.position.x + (el2.direction.x*20), el2.position.y + (el2.direction.y*20));
				ctx.stroke();
				
				resolveCollision(el1, el2);
							
			}
		}

	
		//2. Update positions
		{
			el1.position.y +=fallingSped * el1.direction.y;
			el1.position.x +=fallingSped * el1.direction.x;
			DrawBall(i, el1);			
		}

	}
	
		
}

function resolveCollision(b1, b2) 
{
	
	var delta = Vector.subtract( b1.position, b2.position);;
    var d = delta.length();
    // minimum translation distance to push balls apart after intersecting
    var mtd = delta.multiply(((radius + radius)-d)/d); 


    // resolve intersection --
    // inverse mass quantities
    var im1 = 1; 
    var im2 = 1;

    // push-pull them apart based off their mass
    b1.position = b1.position.add(mtd.multiply(im1 / (im1 + im2)));
    b2.position = b2.position.subtract(mtd.multiply(im2 / (im1 + im2)));

    // impact speed
    var v = (b1.direction.subtract(b2.direction));
    var vn = v.dot(mtd.normalize());

    // sphere intersecting but moving away from each other already
    //if (vn > 0) return;

    // collision impulse
    //var i = (-(1) * vn) / (im1 + im2);
    var impulse = mtd.normalize();//.multiply(i);

    // change in momentum
    b1.direction = b1.direction.add(impulse).normalize();
    b2.direction = b2.direction.subtract(impulse).normalize();				
}

function DrawBall(i, el) 
{
	ctx.beginPath();
	ctx.arc(el.position.x, el.position.y, radius, 0, 2 * Math.PI);
	ctx.stroke();

	//for test: show direction
	ctx.beginPath();
	ctx.moveTo(el.position.x, el.position.y);
	ctx.lineTo(el.position.x + (el.direction.x*20), el.position.y + (el.direction.y*20));
	ctx.stroke();

	//for test: show index
	ctx.font = "20px Comic Sans MS";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText(i, el.position.x, el.position.y+radius);
}

$(document).ready(function() {
    console.log( "ready!" );
	canvas = $("#bord").get(0);
	ctx = canvas.getContext("2d");
		
	var i;
	for (i = 0; i < numberOfBalls; ++i) 
	{
		var directionDegree = Math.floor(Math.random() * 360);
		var directionRadians = fromDegreesToRadians(directionDegree);
		var directionX = Math.cos(directionRadians);
		var directionY = Math.sin(directionRadians);
		
		//use of do-while loop to prevent colision of the balls on init
		do 
		{
			locationOk = true;
			var x = (Math.random() * (400-radiusX2))+radius;
			var y = (Math.random() * (400-radiusX2))+radius;
			
			newEl = {position:new Vector(x,y), direction:new Vector(directionX,directionY)};
			
			jQuery.each( ballsArray, function(index, el)
			{
				var dist = distance(el,newEl);
			
				if(dist < radiusX2)
				{
					locationOk = false; 
					return false;
				}
			
			}); 
  
		} while (locationOk != true);

		
		ballsArray.push(newEl);		
		DrawBall(i,newEl);
	}
	


	myTimer = setInterval(UpdateBalls, timeFrame);	
	
});



$(document).keypress(function( event ) {
	//if tpye P.... pause
	if ( event.which == 112 ) 
	{
		if (myTimer === undefined || myTimer === null) 
		{
			myTimer = setInterval(UpdateBalls, timeFrame);
		}
		else
		{
			clearInterval(myTimer);
			myTimer = null;
		}
  }


});