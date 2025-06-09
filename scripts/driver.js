
// noinspection JSVoidFunctionReturnValueUsed

MySample.main = (function() {
    'use strict';

    const canvas = document.getElementById('canvas-main');
    const gl = canvas.getContext('webgl2');

    let vertices = {};
    let indices = {};
    let vertexNormals = {};
    let center = {};

    let shaderProgram = {};
    let indexBuffer = {};

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update() {
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        gl.clearColor(
            0.3921568627450980392156862745098,
            0.58431372549019607843137254901961,
            0.92941176470588235294117647058824,
            1.0);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let uProjection = gl.getUniformLocation(shaderProgram, 'uProjection');
        gl.uniformMatrix4fv(uProjection, false, transposeMatrix4x4(perspectiveProjection(1, 1, 1, 10)));

        let uMove = gl.getUniformLocation(shaderProgram, 'uMove');
        gl.uniformMatrix4fv(uMove, false, transposeMatrix4x4(moveMatrix(0, 0, -2)));

        let uColor = gl.getUniformLocation(shaderProgram, 'uColor');
        gl.uniform3fv(uColor, [1, 1, 1]);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }

    //------------------------------------------------------------------
    //
    // This is the animation loop.
    //
    //------------------------------------------------------------------
    function animationLoop(time) {

        update();
        render();

        requestAnimationFrame(animationLoop);
    }

    async function initialize() {
        console.log('initializing...');

        const vertexShaderSource = await loadFileFromServer('assets/shaders/simple.vert');
        const fragmentShaderSource = await loadFileFromServer('assets/shaders/simple.frag');
        const objectSource = await loadFileFromServer('assets/models/b.ply');

        initializeShaders(vertexShaderSource, fragmentShaderSource);
        initializeVertices(objectSource);

        requestAnimationFrame(animationLoop);
    }

    function initializeVertices(plyObject) {
        // vertices = plyObject.vertices;
        // indices = plyObject.indices;
        // vertexNormals = plyObject.vertexNormals;
        // center = plyObject.center;

        vertices = new Float32Array([
            0.5,  0.5,  0.5,
            0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,
            -0.5, -0.5,  0.5
        ]);
        indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3,
            1, 3, 2,
            0, 3, 1
        ]);
        vertexNormals = vertices;

        initializeBufferObjects();
    }

    function initializeBufferObjects() {
        let vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        let vertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        let position = gl.getAttribLocation(shaderProgram, 'aPosition');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, vertices.BYTES_PER_ELEMENT * 3, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);

        let normal = gl.getAttribLocation(shaderProgram, 'aNormal');
        gl.enableVertexAttribArray(normal);
        gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, vertexNormals.BYTES_PER_ELEMENT * 3, 0);
    }

    function initializeShaders(vertexShaderSource, fragmentShaderSource) {
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        console.log(gl.getShaderInfoLog(vertexShader)); // for debugging

        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        console.log(gl.getShaderInfoLog(fragmentShader));

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);
    }

    initialize();

}());
