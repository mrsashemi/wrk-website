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

export function tint(img: any, color: any) {
    // Create a buffer element to draw based on the Image img
    let tinted;
    const buffer = document.createElement('canvas');
    buffer.width = img.width;
    buffer.height = img.height;
    const btx: any = buffer.getContext('2d');
        
    // First draw your image to the buffer
    btx.drawImage(img, 0, 0);
        
    // Now we'll multiply a rectangle of your chosen color
    btx.fillStyle = color;
    btx.globalCompositeOperation = 'multiply';
    btx.fillRect(0, 0, buffer.width, buffer.height);
        
    // Finally, fix masking issues you'll probably incur and optional globalAlpha
    btx.globalAlpha = 0.5;
    btx.globalCompositeOperation = 'destination-in';
    btx.drawImage(img, 0, 0, img.width, img.height);
    tinted = buffer;
    return tinted;
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


export function getRandomColor(x: any, y: any, imgReady: any, context: any) {
    if (!imgReady) return;
    let color = context.getImageData(x, y, 1, 1);
    let brightness = Math.round((color.data[0]+color.data[0]+color.data[1]+color.data[2]+color.data[2]+color.data[2])/6);
    let hex = rgbToHex(color.data[0], color.data[1], color.data[2]);
    return [color, brightness, hex];
}

export function mapRange (value: any, a: any, b: any, c: any, d: any) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}

export function distanceRange(x1: any, y1: any, x2: any, y2: any) {
    return Math.hypot(x2-x1, y2-y1);
}

export function componentToHex(c: any) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
export function rgbToHex(r: any, g: any, b: any) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


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

    // Flip the image's y axis
    ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 1);

    ctx.blendFunc(ctx.ONE,ctx.ONE_MINUS_SRC_ALPHA);
    ctx.enable(ctx.BLEND);
    ctx.clearColor(0.0,0.0,0.0,0.0);
    ctx.viewport(0,0,w, h);

    return program;
}

export const createGLbuffer = (gl: WebGL2RenderingContext, canvas: any, w: any, h: any) => {
    (gl as any) = canvas.getContext('webgl2', {
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

export const create2Dbuffer = (ctx: CanvasRenderingContext2D, canvas: any, w: any, h: any, preDraw: boolean, img: any) => {
    (ctx as any) = canvas.getContext('2d', {
        willReadFrequently: true,
        alpha: true
    });

    canvas.width = w;
    canvas.height = h;

    if (preDraw) ctx.drawImage(img, 0, 0, w, h);

    return ctx;
}

export const setUniform2f = (gl: WebGL2RenderingContext, location: string, program: any, w: any, h: any) => {
    const uniform = gl.getUniformLocation(program, location);
    gl.uniform2f(uniform, w, h);
}

export const setUniform1f = (gl: WebGL2RenderingContext, location: string, program: any, w: any) => {
    const uniform = gl.getUniformLocation(program, location);
    gl.uniform1f(uniform, w);
}


export const loadChickens = async (spritesheet: any, spriteJSON: any) => {
    let lineSprites: any = [];
    let detailSprites: any = [];
    let otherDetailSprites: any = [];
    let bodySprites: any = [];

    let allsprites: any = spritesheet;
    let allspritesJSON: any = spriteJSON
    for (let i = 0; i < 2; i++) {
        lineSprites.push(await createImageBitmap(
            allsprites, 
            allspritesJSON.frames[`chickenlines-${i}.png`]["frame"]["x"], 
            allspritesJSON.frames[`chickenlines-${i}.png`]["frame"]["y"], 
            allspritesJSON.frames[`chickenlines-${i}.png`]["frame"]["w"],
            allspritesJSON.frames[`chickenlines-${i}.png`]["frame"]["h"])
        )
        detailSprites.push(await createImageBitmap(
            allsprites, 
            allspritesJSON.frames[`chickendetail-${i}.png`]["frame"]["x"], 
            allspritesJSON.frames[`chickendetail-${i}.png`]["frame"]["y"], 
            allspritesJSON.frames[`chickendetail-${i}.png`]["frame"]["w"],
            allspritesJSON.frames[`chickendetail-${i}.png`]["frame"]["h"]
        ))

        otherDetailSprites.push(await createImageBitmap(
            allsprites, 
            allspritesJSON.frames[`chickenotherdetail-${i}.png`]["frame"]["x"], 
            allspritesJSON.frames[`chickenotherdetail-${i}.png`]["frame"]["y"], 
            allspritesJSON.frames[`chickenotherdetail-${i}.png`]["frame"]["w"],
            allspritesJSON.frames[`chickenotherdetail-${i}.png`]["frame"]["h"]
        ))

        bodySprites.push(await createImageBitmap(
            allsprites, 
            allspritesJSON.frames[`chickenbody-${i}.png`]["frame"]["x"], 
            allspritesJSON.frames[`chickenbody-${i}.png`]["frame"]["y"], 
            allspritesJSON.frames[`chickenbody-${i}.png`]["frame"]["w"],
            allspritesJSON.frames[`chickenbody-${i}.png`]["frame"]["h"]
        ))
    }

    return {lines: lineSprites, detail: detailSprites, otherdetail: otherDetailSprites, body: bodySprites};
}

export function colorDistance(color1: any, color2: any) {
    const dr = color2[0] - color1[0];
    const dg = color2[1] - color1[1];
    const db = color2[2] - color1[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
}

export function drawChicken(x: number, y: number, w: number, h: number, ctx: any, col: any, col2: any, sprites: any, spriteDetails: any, spriteOtherDetails: any, spriteBody: any) {
    let chkn = Math.floor(Math.random()*2);

    //lines and tinted are the same
    let tinted = tint(sprites[chkn], "#000000");
    ctx.drawImage(tinted, x, y, w, h);
    tinted = tint(spriteDetails[chkn], col2);
    ctx.drawImage(tinted, x, y, w, h);
    tinted = tint(spriteOtherDetails[chkn], col2);
    ctx.drawImage(tinted, x, y, w, h);
    tinted = tint(spriteBody[chkn], col);
    ctx.drawImage(tinted, x, y, w, h);
}
