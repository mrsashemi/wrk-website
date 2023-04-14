// Interleaved data buffer (X,Y: vertex coordinates, U,V: texture coordinates)
const verticesTexCoords = new Float32Array([
    -1.0, 1.0,  0.0, 1.0,
    -1.0, -1.0, 0.0, 0.0,
    1.0,  1.0,  1.0, 1.0,
    1.0,  -1.0, 1.0, 0.0,
]);

const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT; // bytes per float (4)

export const prepareShader = (ctx: WebGL2RenderingContext, vertex: string, fragment: string, w: any, h: any) => {
    const program = compile(ctx, vertex, fragment);

    // Create the buffer object
    const vertexTexCoordBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexTexCoordBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, verticesTexCoords, ctx.STATIC_DRAW);

    // Use every 1st and 2nd float for position
    const position = ctx.getAttribLocation(program, 'aPosition');
    ctx.vertexAttribPointer(position, 2, ctx.FLOAT, false, FSIZE * 4, 0);
    ctx.enableVertexAttribArray(position);

     // Use every 3rd and 4th float for texCoord
    const texCoord = ctx.getAttribLocation(program, 'aTexCoord');
    ctx.vertexAttribPointer(texCoord, 2, ctx.FLOAT, false, FSIZE * 4, FSIZE * 2);
    ctx.enableVertexAttribArray(texCoord);

    ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image's y axis
    ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
    ctx.enable(ctx.BLEND);
    ctx.disable(ctx.DEPTH_TEST);
    ctx.clearColor(0.0,0.0,0.0,0.0);
    ctx.viewport(0,0,w, h);

    return program;
}

// Compile a WebGL program from a vertex shader and a fragment shader
export const compile = (gl: any, vshader: any, fshader: any) => {
    // Compile vertex shader
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vshader);
    gl.compileShader(vs);

    // Compile fragment shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fshader);
    gl.compileShader(fs);

    // Create and launch the WebGL program
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Log errors (optional)
    console.log('vertex shader:', gl.getShaderInfoLog(vs) || 'OK');
    console.log('fragment shader:', gl.getShaderInfoLog(fs) || 'OK');
    console.log('program:', gl.getProgramInfoLog(program) || 'OK');

    return program;
}

export const createGLbuffer = (gl: WebGL2RenderingContext, canvas: any, w: any, h: any) => {
    gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: true,
        depth: true,
        stencil: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: true,
        perPixelLighting: true,
        version: 2
    });

    canvas.width = w;
    canvas.height = h;
    
    return gl;
}

export const addTexture = (ctx: any, TEXTURE: any, bufferImg: any, program: any, num: any, location: string) => {
    const texture = ctx.createTexture();
    ctx.activeTexture(TEXTURE);
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGB, ctx.RGB, ctx.UNSIGNED_BYTE, bufferImg);
    const buffer = ctx.getUniformLocation(program, location);
    ctx.uniform1i(buffer, num);
}


export const setUniform2f = (gl: WebGL2RenderingContext, location: string, program: any, w: any, h: any) => {
    const uniform = gl.getUniformLocation(program, location);
    gl.uniform2f(uniform, w, h);
}

export const setUniform1f = (gl: WebGL2RenderingContext, location: string, program: any, w: any) => {
    const uniform = gl.getUniformLocation(program, location);
    gl.uniform1f(uniform, w);
}

export const create2Dbuffer = (ctx: any, canvas: any, w: any, h: any, preDraw: boolean, img: any) => {
    (ctx as any) = canvas.getContext('2d', {
        willReadFrequently: true,
        alpha: true
    });

    canvas.width = w;
    canvas.height = h;

    if (preDraw) ctx.drawImage(img, 0, 0, w, h);

    return ctx;
}
