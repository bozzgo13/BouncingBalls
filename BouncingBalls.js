var ballsArray = new Array();
var numberOfBalls = 10;
var radius = 10;
var radiusX2 = radius * 2;
var locationOk = false;
var newEl = null;
var myTimer = null;
var canvas = null;
var ctx = null; //context
var timeFrame = 8;
var fallingSped = 1;
var newShape =[];

const states = {
    IDLE: 'idle',
    DRAW: 'drawing'
}

var myState = null;

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

function drawShapes()
{
	
	if(myState == states.DRAW)
	{
		ctx.strokeStyle = 'red';
	}
	else
	{
		ctx.fillStyle = "blue";
	}
	
	
	ctx.beginPath();
	
	if(newShape.length >=2)
	{
		ctx.moveTo(newShape[0].x, newShape[0].y);		
	}
	
	for (var i = 1; i < newShape.length; i++) 
	{
		var point2 = newShape[i];
		ctx.lineTo(point2.x, point2.y);
		
	}
	
/*
	if(myState == states.IDLE)
	{
		//add the last line
		//extra line that connects end end beginning
		//is only meaningful if we have at least 3 points
		if(newShape.length >=3)
		{
			var point2 = newShape[0];
			ctx.lineTo(point2.x, point2.y);
		}	
	}
*/
	ctx.closePath();

	
	if(myState == states.DRAW)
	{
		ctx.stroke();
	}
	else
	{
		ctx.fill();
	}

	
	
	ctx.strokeStyle = 'black';
}
function UpdateBalls() {
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	drawShapes();
	
	//drawBg();
	for (var i = 0; i < ballsArray.length; i++) 
	{	
		var ball1 = ballsArray[i];
		//1. Check if there is a collision		
		//1.1. Check collision with other balls

		var xball1 = {
			position:new Vector(
				ball1.position.x + (fallingSped * ball1.direction.x),
				ball1.position.y +  (fallingSped * ball1.direction.y)), 
			direction:new Vector(ball1.direction.x,ball1.direction.y)};


		for (var j = i+1; j < ballsArray.length; j++) 
		{
			var ball2 = ballsArray[j];
			//if going into same direction will result in colission
			
			var xball2 = {
				position:new Vector(
					ball2.position.x + (fallingSped * ball2.direction.x),
					ball2.position.y +  (fallingSped * ball2.direction.y)), 
				direction:new Vector(ball2.direction.x,ball2.direction.y)};

			if((Math.abs(xball2.position.x - xball1.position.x)<=(radiusX2) && (Math.abs(xball2.position.y - xball1.position.y)<=(radiusX2))))
			{

				//colision detected
				var dist = Vector.distance(ball1.position,ball2.position);
				ball1.dirty=true;
				ball2.dirty=true;
	
				resolveCollision(ball1, ball2, dist);
				if(dist <= radiusX2)
				{
					/*
					ctx.beginPath();
					ctx.arc(ball1.position.x, ball1.position.y, radius, 0, 2 * Math.PI);
					ctx.fillStyle = "blue";
					ctx.fill();
					
					ctx.beginPath();
					ctx.arc(ball2.position.x, ball2.position.y, radius, 0, 2 * Math.PI);
					ctx.fillStyle = "red";
					ctx.fill();
					
					ctx.beginPath();
					ctx.moveTo(ball2.position.x, ball2.position.y);
					ctx.lineTo(ball2.position.x + (ball2.direction.x*20), ball2.position.y + (ball2.direction.y*20));
					ctx.stroke();
					*/
					
				}
								
			}
		}

	
		//1.2. Check collision with canvas edge
		if(ball1.position.x > (canvas.width-radius) && ball1.direction.x>0)// || ball1.position.x < radius)
		{
			ball1.direction.x *=-1;
		}
		if(ball1.position.x < radius && ball1.direction.x<0)
		{
			ball1.direction.x *=-1;
		}

		if(ball1.position.y > (canvas.height-radius) &&  ball1.direction.y>0)
		{
			ball1.direction.y *=-1;
		}
		if(ball1.position.y < radius &&  ball1.direction.y<0 ){ball1.direction.y *=-1;}
		
		//2. Update positions
		{

			ball1.position.y +=fallingSped * ball1.direction.y;
			ball1.position.x +=fallingSped * ball1.direction.x;
			DrawBall(i, ball1,'black');				
		}

		
	}	
}

function resolveCollision(b1, b2, dist) 
{
	
	var delta = Vector.subtract( b1.position, b2.position);;
    var d = delta.length();
    // minimum translation distance to push balls apart after intersecting
    var mtd = delta.multiply(((radius + radius)-d)/d); 

    var im1 = 1; 

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
    b2.direction =  impulse;
    b1.direction = impulse_negative;				
}

function DrawBall(i, el, color) 
{
	ctx.beginPath();
	ctx.arc(el.position.x, el.position.y, radius, 0, 2 * Math.PI);
	ctx.strokeStyle = color;
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

function startDrawingShape()
{
	var drawButton = $("#drawbutton");
	if(myState == states.IDLE)
	{
		$( this ).html('Stop drawing');
		newShape =[];
		myState = states.DRAW;
	}
	else if(myState == states.DRAW)
	{
		$( this ).html('Start drawing');
		myState = states.IDLE	
	}
	
	


}

function onBordClick(e)
{
	//left mouse button click
	if(e.which===1 && myState == states.DRAW)
	{
		addPoint(e.clientX, e.clientY);
		
		console.log("pos. ("+e.clientX+", "+e.clientY+")");
	}	
     
}

function addPoint(X,Y)
{
	newShape.push(new Vector(X-10,Y-10));
}


$(document).ready(function() {
    //console.log( "ready!" );
	canvas = $("#bord").get(0);
	ctx = canvas.getContext("2d");
	myState = states.IDLE;	
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
				
			newEl = {position:new Vector(x,y), direction:new Vector(directionX,directionY), dirty:false};
			
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
		DrawBall(i,newEl,'black');
	}
	
	myTimer = setInterval(UpdateBalls, timeFrame);	
	
	//on mouse key pressed
	$("#bord").on("click", onBordClick);
	$("#drawbutton").on("click", startDrawingShape);
	
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