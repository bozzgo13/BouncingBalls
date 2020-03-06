
//implementation of pseudocode from
//https://math.stackexchange.com/questions/1743995/determine-whether-a-polygon-is-convex-based-on-its-vertices/3571439#3571439
function isconvex(vertexlist)
{
	if(vertexlist.length < 3)
	{
		return false;
	}
	
	var  wSign = 0        // First nonzero orientation (positive or negative)

    var  xSign = 0
    var  xFirstSign = 0   // Sign of first nonzero edge vector x
    var  xFlips = 0       // Number of sign changes in x

    var  ySign = 0
    var  yFirstSign = 0   // Sign of first nonzero edge vector y
    var  yFlips = 0       // Number of sign changes in y

	var N = vertexlist.length-1;
    var  curr = vertexlist[N-1]   // Second-to-last vertex
    var  next = vertexlist[N]     // Last vertex
	
	for (var i = 0; i < vertexlist.length; i++) //Each vertex, in order
	{
		var v = vertexlist[i];
       
        var  prev = curr     // Previous vertex
        curr = next          //Current vertex
        next = v             //Next vertex

        //Previous edge vector ("before"):
        var  bx = curr.x - prev.x
        var  by = curr.y - prev.y

        // Next edge vector ("after"):
        var  ax = next.x - curr.x
        var  ay = next.y - curr.y

        // Calculate sign flips using the next edge vector ("after"),
        // recording the first sign.
        if(ax > 0)
		{
			if(xSign == 0)
			{
				xFirstSign = 1;
			}
			else if(xSign < 0)
			{
				xFlips +=  1;
			}
			xSign = 1;
        }
		else if(ax < 0)
		{
			if(xSign == 0)
			{
				xFirstSign = -1;
			}
			else if(xSign > 0)
			{
				xFlips +=  1;
			}
			xSign = -1;	
		}
		
		if(xFlips > 2)
		{
			return false;
		}
		
		if(ay>0)
		{
			if(ySign == 0)
			{
				yFirstSign = 1;
			}
			else if(ySign < 0)
			{
				yFlips += 1;
			}
			ySign = +1
		}
		else if(ay<0)
		{
			if(ySign == 0)
			{
				yFirstSign = -1;
			}
			else if(ySign > 0)
			{
				yFlips += 1;
			}
			ySign = -1
		}

		if(yFlips > 2)
		{
			return false;
		}


        // Find out the orientation of this pair of edges,
        // and ensure it does not differ from previous ones.
        var w = bx*ay - ax*by;
        if ((wSign == 0) && (w != 0))
		{
			wSign = w;
		}
        else if((wSign > 0) && (w < 0))
		{
			return false;
		}
		else if((wSign < 0) && (w > 0))
		{
			return false;
		}

	}
	
	
	//Final/wraparound sign flips:
    if ((xSign != 0) && (xFirstSign != 0) && (xSign != xFirstSign))
	{
		xFlips = xFlips + 1;
	}
        
    
    if ((ySign != 0) && (yFirstSign != 0) && (ySign != yFirstSign))
	{
        yFlips = yFlips + 1
    }

    //Concave polygons have two sign flips along each axis.
    if ((xFlips != 2) || (yFlips != 2)){
        return false;
    }

    //This is a convex polygon.
    return true;

}
