var vertexShaderText =
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
' fragColor = vertColor;',
' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText = 
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
' gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var InitDemo = function(event) {
console.log('This is working');

var canvas = document.getElementById('canvasgl');
var gl = canvas.getContext('webgl');
	if(!gl) {
		var gl = canvas.getContext('experimental-webgl');
	}
	if(!gl) {
		alert('Browser does not support Web GL');
	}

	gl.clearColor(0.1, 0.7, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);
	var vertexShader   = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('Error in compling vertex shader', gl.getShaderInfoLog(vertexShader));
		return;
	}
	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('Error in compilng fragment shader', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('Error in linking program', gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('Error Validating Program', gl.getProgramInfoLog(program));
		return;
	}

	//Create Buffer
	var c = [0, 0, 0];
	var dx = 2;
	var dy = 2;
	var dz = 2;

	var boxVertices = 
		[ // X, Y, Z           R, G, B
		// Top
		c[0]-dx/2, c[1]+dy/2, c[2]-dz/2,   0.5, 0.5, 0.5,
		c[0]-dx/2, c[1]+dy/2, c[2]+dz/2,   0.5, 0.5, 0.5,
		c[0]+dx/2, c[1]+dy/2, c[2]+dz/2,   0.5, 0.5, 0.5,
		c[0]+dx/2, c[1]+dy/2, c[2]-dz/2,   0.5, 0.5, 0.5,

		// Left
		c[0]-dx/2, c[1]+dy/2, c[2]+dz/2,   0.70, 0.25, 0.5,
		c[0]-dx/2, c[1]-dy/2, c[2]+dz/2,   0.70, 0.25, 0.5,
		c[0]-dx/2, c[1]-dy/2, c[2]-dz/2,   0.70, 0.25, 0.5,
		c[0]-dx/2, c[1]+dy/2, c[2]-dz/2,   0.70, 0.25, 0.5,

		// Right
		c[0]+dx/2, c[1]+dy/2, c[2]+dz/2,   0.25, 0.25, 0.75,
		c[0]+dx/2, c[1]-dy/2, c[2]+dz/2,   0.25, 0.25, 0.75,
		c[0]+dx/2, c[1]-dy/2, c[2]-dz/2,   0.25, 0.25, 0.75,
		c[0]+dx/2, c[1]+dy/2, c[2]-dz/2,   0.25, 0.25, 0.75,

		// Front
		c[0]+dx/2, c[1]+dy/2, c[2]+dz/2,   1.0, 0.0, 0.15,
		c[0]+dx/2, c[1]-dy/2, c[2]+dz/2,   1.0, 0.0, 0.15,
		c[0]-dx/2, c[1]-dy/2, c[2]+dz/2,   1.0, 0.0, 0.15,
		c[0]-dx/2, c[1]+dy/2, c[2]+dz/2,   1.0, 0.0, 0.15,

		// Back
		c[0]+dx/2, c[1]+dy/2, c[2]-dz/2,   0.0, 1.0, 0.15,
		c[0]+dx/2, c[1]-dy/2, c[2]-dz/2,   0.0, 1.0, 0.15,
		c[0]-dx/2, c[1]-dy/2, c[2]-dz/2,   0.0, 1.0, 0.15,
		c[0]-dx/2, c[1]+dy/2, c[2]-dz/2,   0.0, 1.0, 0.15,

		// Bottom
		c[0]-dx/2, c[1]-dy/2, c[2]-dz/2,   0.35, 0.5, 1.0,
		c[0]-dx/2, c[1]-dy/2, c[2]+dz/2,   0.35, 0.5, 1.0,
		c[0]+dx/2, c[1]-dy/2, c[2]+dz/2,   0.35, 0.5, 1.0,
		c[0]+dx/2, c[1]-dy/2, c[2]-dz/2,   0.35, 0.5, 1.0,
	];


	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

	gl.vertexAttribPointer(
		positionAttribLocation, //attribute location
		3, //Number of elements per attribute
		gl.FLOAT, //type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual Vertex
		0// Offset from the beginning of a single vertex to this attribute
		);

	gl.vertexAttribPointer(
		colorAttribLocation, //attribute location
		3, //Number of elements per attribute
		gl.FLOAT, //type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual Vertex
		3 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
		);

		gl.enableVertexAttribArray(positionAttribLocation);
		gl.enableVertexAttribArray(colorAttribLocation);

 		gl.useProgram(program);

 		var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
 		var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
 		var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

 		var projMatrix = new Float32Array(16);
 		var worldMatrix = new Float32Array(16);
 		var viewMatrix = new Float32Array(16);
 		mat4.identity(worldMatrix);
 		mat4.lookAt(viewMatrix, [0, 0, -15], [0, 0, 0], [0, 1, 0]);
 		mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);

 		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
 		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
 		gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


//Get Normal Vector

function normal(p1, p2, p3) {
	var a = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
	var b = [p1[0] - p3[0], p1[1] - p3[1], p1[2] - p3[2]];
	var out = [];
	out[0] = a[1]*b[2] - a[2]*b[1];
	out[1] = a[0]*b[2] - a[2]*b[0];
	out[2] = a[0]*b[1] - a[1]*b[0];
	mag = Math.sqrt(Math.pow(out[0],2) + Math.pow(out[1], 2) + Math.pow(out[2], 2));
	out[0] = out[0]/mag;
	out[1] = out[1]/mag;
	out[2] = out[2]/mag;
	return out;
}



//Initialize Variables
mx = 0;
my = 0;
var angleX = 0;
var angleY = 0;
var scale = 1;
var transx = 0;
var transy = 0;
var transz = 0;
var old_transx = 0;
var old_transy = 0;
var hor = 0;
var ver = 0;
var harold = 0;
var varold = 0;
var angxold = 0;
var angyold = 0;
var center = [0,0,0];
var inCent = [0,0,0];
var outCent = [0,0,0];
var mouse_x = 0;
var mouse_y = 0;

var x_vec = 0;
var y_vec = 0;
var pixels = new Uint8Array(4);
var mousedown = false;
var o_dist = 0;

//Mouse Listeners
	canvas.addEventListener('mousedown', initMove, false);
    canvas.addEventListener('keydown', move, false);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mousemove', extendFace, false);
    canvas.addEventListener('mouseup', stopMove);

var identityMatrix = new Float32Array(16);
mat4.identity(identityMatrix);

//Main Move Functions

//Stop Moving
	 function stopMove() {
        mousedown = false;
        harold = transx;
    	varold = transy;  
    	angxold = angleX;
    	angyold = angleY;
    }

    // Initialize the movement
    function initMove(event) {
        mousedown = true;
        mx = event.clientX;
        my = event.clientY;
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
		//if (my > 400) {
		//	o_dist = -2*(my-400);
		//}
		//else if (my < 400) {
		//	o_dist = 2 * (my-400);
		//}
        gl.readPixels(mx, my, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        console.log(mx + ' ' + my);
        console.log(pixels);
        console.log(canvas.offsetLeft);
        
    }

    function move(event) {
    	//rotate
    	if(mousedown && event.ctrlKey) {
    		//console.log("move");
    	  	angleX = -(event.clientX - mx)/100 + angxold;//+ event.clientX;
    	  	angleY = (event.clientY - my)/100 + angyold;

    	  }
    	  //translate

    	  if (mousedown && event.altKey) {
    	  	hor = mx - event.clientX;
            ver = my - event.clientY;
     	 
    	  	 transx = (hor)/125 + harold;
    	     transy = (ver)/125 + varold;   	     
    	   
    	  }
    	  //zoom
    	  if (mousedown && event.shiftKey) {
    	  	if(event.clientY-my < 0) {
    	  	scale = scale*1.1;
    	  	}
    	  	if(event.clientY-my > 0) {
    	  		scale = scale * 0.9;
    	  	}

    	  }
    	  //Transformation Matrices
    	  	//Translate
    	  		var translate = math.matrix( 
				 [[1,		0, 	0, 		0],
			  [	   0,  		1, 	0,   	0],
			  [	   0, 		0, 	1, 		0],
			  [	   transx,	 	transy, 	transz, 		1]]);

    	  		//Scale
			var scale_mat = math.matrix(
			[ [    scale,	0, 		0, 			0],
			  [	   0,  		scale, 	0,  	 	0],
			  [	   0, 		0, 		scale, 		0],
			  [	   0,	 	0, 		0, 			1]]);
			//Rotate in X
    	  	var rotatex = math.matrix(
			  [ [  1,		0, 					0, 						0],
			  [	   0,  		Math.cos(angleY),  -Math.sin(angleY),    	0],
			  [	   0, 		Math.sin(angleY), 	Math.cos(angleY), 		0],
			  [	   0,	 	0, 					0, 						1]]);

    	  	//Rotate in Y
			var rotatey = math.matrix(
			[ [  Math.cos(angleX),			0, 		Math.sin(angleX), 	0],
			  [	   0,  						1,   	0, 				   	0],
			  [	  -Math.sin(angleX), 		0, 		Math.cos(angleX), 	0],
			  [	   0,					 	0,		0, 					1]]);
			var temp = math.multiply(rotatex, rotatey);
       		temp = math.multiply(temp, scale_mat);
   			temp_worldMatrix = math.multiply(temp, translate);
   			k=0;
    for (var i = 0; i<4; i++){
    	for(var j = 0; j<4; j++){
    		worldMatrix[k] = temp_worldMatrix.get([i,j]);
    		k = k + 1;
    	}
    };
			gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	
    	  	gl.clearColor(0.75, 0.85, 0.8, 1.0);
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
			gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
    }

    //Extend Face
    function extendFace(event) {
if (mousedown && !event.ctrlKey && !event.shiftKey && !event.altKey) { 
	//get RGB
   		r = (pixels[0]/255).toFixed(2);
	   	g = (pixels[1]/255).toFixed(2);
		b = (pixels[2]/255).toFixed(2);

		//Search for RGB values
		var index = 0;
		for (var j = 0; j < boxVertices.length/6; j++) {
		r1 = boxVertices[6*j+3].toFixed(2);
		b1 = boxVertices[6*j+4].toFixed(2);
		g1 = boxVertices[6*j+5].toFixed(2);

			if(r1==r) {
				index = (j*6)+3;
				break;
			}
		}
		//Get Box Vertices
	  	p1 = [boxVertices[index - 3], boxVertices[index - 2], boxVertices[index - 1]];
		p2 = [boxVertices[index + 3], boxVertices[index + 4], boxVertices[index + 5]];
		p3 = [boxVertices[index + 9], boxVertices[index + 10], boxVertices[index + 11]];
		p4 = [boxVertices[index + 15], boxVertices[index + 16], boxVertices[index + 17]];

		//Get Center of Face
		center[0] = (p1[0] + p2[0] + p3[0] + p4[0])/4;
		center[1] = (p1[1] + p2[1] + p3[1] + p4[1])/4;
		center[2] = (p1[2] + p2[2] + p3[2] + p4[2])/4;

		//Compare Direction Magnitude
		var out = normal(p1, p2, p3);
		inCent[0] = center[0] + out[0];
		outCent[0] = center[0] - out[0];
		inCent[1] = center[1] + out[1];
		outCent[1] = center[1] - out[1];
		inCent[2] = center[2] + out[2];
		outCent[2] = center[2] - out[2];
		leng1 = Math.sqrt(Math.pow(inCent[0],2) + Math.pow(inCent[1],2) + Math.pow(inCent[2],2));
		leng2 = Math.sqrt(Math.pow(outCent[0],2) + Math.pow(outCent[1],2) + Math.pow(outCent[2],2));
		
		if(leng1 < leng2) {
			out[0] = out[0]*-1;
			out[1] = out[1]*-1;
			out[2] = out[2]*-1; 
		}

		//Check where mouse is moving to
		//mouse_x = event.clientX;
		//mouse_y = event.clientY;
		//dist1 = -center[0] + mx;
		//dist2 = -center[1] + my;
		//dist3 = mouse_x - center[0];
		//dist4 = mouse_y - center[1];
		//mag_dist1 = Math.sqrt(Math.pow(dist1,2) + Math.pow(dist2,2));
		//mag_dist2 = Math.sqrt(Math.pow(dist3,2) + Math.pow(dist4,2));
		//if(mag_dist1 > mag_dist2) {
		//	out[0] = out[0] * -1;
		//	out[1] = out[1] * -1;
		//	out[2] = out[2] * -1;
		//}

		//Extend vertices 
		for (var i = 0; i < boxVertices.length/6; ++i) {
		x = boxVertices[6*i];
		y = boxVertices[6*i+1];
		z = boxVertices[6*i+2];
		dist = Math.sqrt(Math.pow(event.clientX,2) + Math.pow(event.clientY,2));
	if(x==p1[0] && y==p1[1] && z == p1[2]) {
		boxVertices[i*6] = boxVertices[i*6] + out[0]*(dist)/2500; 
		boxVertices[i*6+1] = boxVertices[i*6+1] + out[1]*(dist)/2500; 
		boxVertices[i*6+2] = boxVertices[i*6+2] + out[2]*(dist)/2500; 
	} else if(x==p2[0] && y==p2[1] && z == p2[2]) {
		boxVertices[i*6] = boxVertices[i*6] + out[0]*(dist)/2500; 
		boxVertices[i*6+1] = boxVertices[i*6+1] + out[1]*(dist)/2500; 
		boxVertices[i*6+2] = boxVertices[i*6+2] + out[2]*(dist)/2500;  
	} else if(x==p3[0] && y==p3[1] && z == p3[2]) {
		boxVertices[i*6] = boxVertices[i*6] + out[0]*(dist)/2500; 
		boxVertices[i*6+1] = boxVertices[i*6+1] + out[1]*(dist)/2500; 
		boxVertices[i*6+2] = boxVertices[i*6+2] + out[2]*(dist)/2500;  
	} else if(x==p4[0] && y==p4[1] && z == p4[2]) {
		boxVertices[i*6] = boxVertices[i*6] + out[0]*(dist)/2500; 
		boxVertices[i*6+1] = boxVertices[i*6+1] + out[1]*(dist)/2500; 
		boxVertices[i*6+2] = boxVertices[i*6+2] + out[2]*(dist)/2500;  
	}
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
}
}};

//Draw
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
};