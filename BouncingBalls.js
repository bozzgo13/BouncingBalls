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
var fallingSped = 5;


function fromDegreesToRadians (angle) {
  return angle * (Math.PI / 180);
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
	
	//drawBg();
	for (var i = 0; i < ballsArray.length; i++) 
	{	
		var el1 = ballsArray[i];
		//1. Check if there is a collision		
		//1.1. Check collision with other balls

		for (var j = i+1; j < ballsArray.length; j++) 
		{
			var el2 = ballsArray[j];
			if((Math.abs(el2.position.x - el1.position.x)<radiusX2)&&(Math.abs(el2.position.y - el1.position.y)<radiusX2))
			{
				//colision detected

				var dist = Vector.distance(el1.position,el2.position);
			
				if(dist <= radiusX2)
				{
					/*
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
					*/
					resolveCollision(el1, el2);
				}
								
			}
		}

	
		//1.2. Check collision with canvas edge
		if(el1.position.x > (canvas.width-radius) && el1.direction.x>0)// || el1.position.x < radius)
		{
			el1.direction.x *=-1;
		}
		if(el1.position.x < radius && el1.direction.x<0)
		{
			el1.direction.x *=-1;
		}

		if(el1.position.y > (canvas.height-radius) &&  el1.direction.y>0)
		{
			el1.direction.y *=-1;
		}
		if(el1.position.y < radius &&  el1.direction.y<0 ){el1.direction.y *=-1;}
		
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

    var im1 = 1; 

    b1.position = b1.position.add(mtd.multiply(im1));
    b2.position = b2.position.subtract(mtd.multiply(im1));

	/*
	ctx.beginPath();
	ctx.arc(b1.position.x, b1.position.y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = "green";
	ctx.fill();

	ctx.beginPath();
	ctx.arc(b2.position.x, b2.position.y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = "#FF1493";
	ctx.fill();	
	*/
	
    var impulse = mtd.normalize();
	var impulse_negative = Vector.negative(impulse);
    
	// change in momentum
    b1.direction =  impulse;
    b2.direction = impulse_negative;				
}

function DrawBall(i, el) 
{
	ctx.beginPath();
	ctx.arc(el.position.x, el.position.y, radius, 0, 2 * Math.PI);
	ctx.stroke();

	//for test: show direction
	/*
	ctx.beginPath();
	ctx.moveTo(el.position.x, el.position.y);
	ctx.lineTo(el.position.x + (el.direction.x*20), el.position.y + (el.direction.y*20));
	ctx.stroke();
	*/
	//for test: show index
	/*
	ctx.font = "20px Comic Sans MS";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText(i, el.position.x, el.position.y+radius);
	*/
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
				var dist = Vector.distance(el.position,newEl.position);
			
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