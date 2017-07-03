var rot_y = 0;
var rot_x = 90;
function degToRad(degrees) {
  return degrees * Math.PI / 180.0;
};

function draw(vertices) {
	 /*================Creating a canvas=================*/
	 var canvas = document.getElementById('galaxy');
	 gl = canvas.getContext('experimental-webgl'); 

	 /*==========Defining and storing the geometry=======*/

	 // Create an empty buffer object to store the vertex buffer
	 var vertex_buffer = gl.createBuffer();

	 //Bind appropriate array buffer to it
	 gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  
	 // Pass the vertex data to the buffer
	 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	 // Unbind the buffer
	 gl.bindBuffer(gl.ARRAY_BUFFER, null);


	 /*=========================Shaders========================*/
  
	 // vertex shader source code
	 var vertCode =
		'attribute vec3 coordinates;' +
		'attribute vec3 rgb;' +
		'uniform mat4 u_xformMatrix;' +
		'varying vec3 v_rgb;' +
		'void main(void) {' +
		   'gl_Position = u_xformMatrix * vec4(coordinates, 1.0);' +
		   'gl_PointSize = 1.0;'+
		   'v_rgb = rgb;'+
		'}';
	 
	 // Create a vertex shader object
	 var vertShader = gl.createShader(gl.VERTEX_SHADER);

	 // Attach vertex shader source code
	 gl.shaderSource(vertShader, vertCode);

	 // Compile the vertex shader
	 gl.compileShader(vertShader);

	 // fragment shader source code
	 var fragCode =
		'precision mediump float;' +
		'varying vec3 v_rgb;' +
		'void main(void) {' +
		   'gl_FragColor = vec4(v_rgb, 1.0);' +
		'}';
	 
	 // Create fragment shader object
	 var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

	 // Attach fragment shader source code
	 gl.shaderSource(fragShader, fragCode);
  
	 // Compile the fragmentt shader
	 gl.compileShader(fragShader);

	 // Create a shader program object to store
	 // the combined shader program
	 var shaderProgram = gl.createProgram();

	 // Attach a vertex shader
	 gl.attachShader(shaderProgram, vertShader); 

	 // Attach a fragment shader
	 gl.attachShader(shaderProgram, fragShader);

	 // Link both programs
	 gl.linkProgram(shaderProgram);

	 // Use the combined shader program object
	 gl.useProgram(shaderProgram);

	 /*======== Associating shaders to buffer objects ========*/

	 // Bind vertex buffer object
	 gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

	 // Get the attribute location
	 var coord = gl.getAttribLocation(shaderProgram, "coordinates");

	 // Point an attribute to the currently bound VBO
	 gl.vertexAttribPointer(coord, 3, gl.FLOAT, true, 28, 0);

	 // Enable the attribute
	 gl.enableVertexAttribArray(coord);

	 // Get the attribute location
	 var color = gl.getAttribLocation(shaderProgram, "rgb");

	 // Point an attribute to the currently bound VBO
	 gl.vertexAttribPointer(color, 3, gl.FLOAT, true, 28, 16);

	 // Enable the attribute
	 gl.enableVertexAttribArray(color);

	 function frame() {	  

		gl.canvas.width  = window.innerHeight;
		gl.canvas.height = window.innerHeight;

		var rot = mat4.create();
		mat4.fromRotation(rot, degToRad(rot_x), [1, 0, 0]);

		var rot2 = mat4.create();
		mat4.rotate(rot2, rot, degToRad(rot_y), [0, 1, 0]);

		var view = mat4.create();
		mat4.scale(view, rot2, [0.02, 0.02, 0.02]);
   
		 var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
		 gl.uniformMatrix4fv(u_xformMatrix, false, view);

		 // Clear the canvas
		 gl.clearColor(0, 0, 0, 1.0);

		 // Enable the depth test
		 gl.enable(gl.DEPTH_TEST);
 
		 // Clear the color buffer bit
		 gl.clear(gl.COLOR_BUFFER_BIT);

		 // Set the view port
		 gl.viewport(0,0,canvas.width,canvas.height);

		 // Draw the triangle
		 gl.drawArrays(gl.POINTS, 0, vertices.length / 7);

		 rot_y += 0.1;
		 rot_x += 0.1;

		 requestAnimationFrame(frame);
	 }
	 requestAnimationFrame(frame);
};

fetch("map.json")
.then((res) => res.json())
.then(draw);
