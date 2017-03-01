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

var InitDemo = function() {
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

	var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
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
 		mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
 		mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);

 		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
 		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
 		gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


//Main Render Loop
var identityMatrix = new Float32Array(16);
mat4.identity(identityMatrix);

//Set up Mouse Listener

mx = 0;
my = 0;
angleX = 0;



p1 = [boxVertices[24], boxVertices[25], boxVertices[26]];
p2 = [boxVertices[30], boxVertices[31], boxVertices[32]];
p3 = [boxVertices[36], boxVertices[37], boxVertices[38]];
p4 = [boxVertices[42], boxVertices[43], boxVertices[44]];

//angleY = 0;

for (var i = 0; i < boxVertices.length/6; ++i) {
	x = boxVertices[6*i];
	y = boxVertices[6*i+1];
	z = boxVertices[6*i+2];
	if(x==p1[0] && y==p1[1] && z == p1[2]) {
		boxVertices[i*6] = boxVertices[i*6] - 1; 
	}
	else if(x==p2[0] && y==p2[1] && z == p2[2]) {
		boxVertices[i*6] = boxVertices[i*6] - 1; 
	}
	else if(x==p3[0] && y==p3[1] && z == p3[2]) {
		boxVertices[i*6] = boxVertices[i*6] - 1; 
	}
	else if(x==p4[0] && y==p4[1] && z == p4[2]) {
		boxVertices[i*6] = boxVertices[i*6] - 1; 
	}
}

    	var pixels = new Uint8Array(4);


gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
var loop = function () {
	canvas.addEventListener('mousedown', initMove, false);
    document.addEventListener('keydown', move, false);
    //document.addEventListener('keydown', extend, true);
    document.addEventListener('keypress', move, true);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', stopMove);
    
    
	var mx = 0;
	var my = 0;
	 function stopMove() {
        mousedown = false;
    }

    // Initialize the movement
    function initMove(event) {
        console.log('initmove');
        mousedown = true;
        mx = event.clientX;
        my = event.clientY;
    }

    function move(event) {
    	if(mousedown) {
			gl.readPixels(event.clientX, event.clientY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
			console.log(pixels); // Uint8Array
    	  	angleX = (event.clientX - mx)/100;//+ event.clientX;
    	  }
    }
    	//console.log();  
 
	mat4.rotate(worldMatrix, identityMatrix, angleX, [0,1,0]);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
	requestAnimationFrame(loop);	
};
requestAnimationFrame(loop);	
};