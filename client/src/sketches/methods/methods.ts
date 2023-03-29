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
    btx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    btx.globalCompositeOperation = 'multiply';
    btx.fillRect(0, 0, buffer.width, buffer.height);
        
    // Finally, fix masking issues you'll probably incur and optional globalAlpha
    btx.globalAlpha = 1.0;
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


export function getRandomColor(x: any, y: any, w: any, context: any) {
    const index = y * (w*4) + x*4;
    let color = [context[index], context[index+1], context[index+2]];
    let brightness = Math.max(color[0], color[1], color[2]);
    return [color, brightness];
}

export function mapRange (value: any, a: any, b: any, c: any, d: any) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}

export function distanceRange(x1: any, y1: any, x2: any, y2: any) {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.sqrt(a*a + b*b); //Math.hypot is more accurate, but slower
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
    let tinted = tint(sprites[chkn], [0, 0, 0]);
    ctx.drawImage(tinted, x, y, w, h);
    tinted = tint(spriteDetails[chkn], col2);
    ctx.drawImage(tinted, x, y, w, h);
    tinted = tint(spriteOtherDetails[chkn], col2);
    ctx.drawImage(tinted, x, y, w, h);
    tinted = tint(spriteBody[chkn], col);
    ctx.drawImage(tinted, x, y, w, h);
}


export function drawRoughCircle(x: any, y: any, size: any, rc: any, col: any, col2: any, num: any) {
    rc.circle(x, y, size, {fill: `rgb(${col[0]}, ${col[1]}, ${col[2]})`, fillStyle: "solid", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2}); 
    rc.circle(x, y, size/1.5, {fill: `rgb(${col2[0]}, ${col2[1]}, ${col2[2]})`, fillStyle: "hachure", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2}); 
    rc.circle(x, y, size/3, {fill: `rgb(${col[0]}, ${col[1]}, ${col[2]})`, fillStyle: "cross-hatch", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2}); 
}


export function drawRoughCube(cX: any, cY: any, size: any, rc: any, col: any, col2: any, num: any) {
    let poly = [];

    for(let a = 0; a < Math.PI*2; a+=Math.PI*2/6) {
        poly.push([cX + size * Math.cos(a), cY + size * Math.sin(a)])        
    }
    poly.push([cX, cY]);

    if (cX%2==0) {
        rc.polygon([poly[0], poly[1], poly[2], poly[7]], {
            fill: `rgb(${col2[0]}, ${col2[1]}, ${col2[2]})`, fillStyle: "solid", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
        rc.polygon([poly[7], poly[2], poly[3], poly[4]], {
            fill: `rgb(${col[0]}, ${col[1]}, ${col[2]})`, fillStyle: "zigzag", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
        rc.polygon([poly[0], poly[7], poly[4], poly[5]], {
            fill: `rgb(${col2[0]}, ${col2[1]}, ${col2[2]})`, fillStyle: "dots", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
    } else {
        rc.polygon([poly[0], poly[1], poly[7], poly[5]], {
            fill: `rgb(${col[0]}, ${col[1]}, ${col[2]})`, fillStyle: "dashed", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
        rc.polygon([poly[7], poly[1], poly[2], poly[3]], {
            fill: `rgb(${col2[0]}, ${col2[1]}, ${col2[2]})`, fillStyle: "zigzag-line", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
        rc.polygon([poly[3], poly[7], poly[5], poly[4]], {
            fill: `rgb(${col[0]}, ${col[1]}, ${col[2]})`, fillStyle: "solid", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
    }
}

export function drawRoughPyramid(cX: any, cY: any, size: any, rc: any, col: any, col2: any, num: any) {
    let poly = [];

    for(let a = 0; a < Math.PI*2; a+=Math.PI*2/6) {
        poly.push([cX + size * Math.cos(a), cY + size * Math.sin(a)])        
    }
    poly.push([cX, cY]);

    if (cX%2==0) {
        rc.polygon([poly[0], poly[2], poly[7]], {
            fill: `rgb(${col2[0]}, ${col2[1]}, ${col2[2]})`, fillStyle: "solid", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
        rc.polygon([poly[7], poly[2], poly[4]], {
            fill: `rgb(${col[0]}, ${col[1]}, ${col[2]})`, fillStyle: "zigzag", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
        rc.polygon([poly[0], poly[7], poly[4]], {
            fill: `rgb(${col2[0]}, ${col2[1]}, ${col2[2]})`, fillStyle: "dots", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
    } else {
        rc.polygon([poly[1], poly[3], poly[7]], {
            fill: `rgb(${col[0]}, ${col[1]}, ${col[2]})`, fillStyle: "dashed", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
        rc.polygon([poly[7], poly[3], poly[5]], {
            fill: `rgb(${col2[0]}, ${col2[1]}, ${col2[2]})`, fillStyle: "zigzag-line", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
        rc.polygon([poly[1], poly[7], poly[5]], {
            fill: `rgb(${col[0]}, ${col[1]}, ${col[2]})`, fillStyle: "solid", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
        })
    }
}

export function drawRoughStar(x: any, y: any, radius1: any, radius2: any, npoints: any, rc: any, col: any, num: any) {
	let angle = (Math.PI*2 )/ npoints;
	let halfAngle = angle / 2.0;
    let star = [];

	for (let a = 0; a < Math.PI*2; a += angle) {
	  let sx = x + Math.cos(a) * radius2;
	  let sy = y + Math.sin(a) * radius2;
	  star.push([sx, sy]);

	  sx = x + Math.cos(a + halfAngle) * radius1;
	  sy = y + Math.sin(a + halfAngle) * radius1;
	  star.push([sx, sy]);
	}

    rc.polygon(star, {
        fill: `rgb(${col[0]}, ${col[1]}, ${col[2]})`, fillStyle: "cross-hatch", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
    })

}

export function drawRoughtHeart(x: any, y: any, size: any, rc: any, col: any, num: any) {
    let heart = [];

    for (let a = 0; a < Math.PI*2; a += 0.01) {
		let r = 2 - 2 * Math.sin(a) + Math.sin(a) * (Math.sqrt(Math.abs(Math.cos(a))/(Math.sin(a)+1.4)));
		let currX = x + size*r * Math.cos(a);
		let currY = y + -size*r * Math.sin(a);
        heart.push([currX, currY]);
	}

    rc.polygon(heart, {
        fill: `rgb(${col[0]}, ${col[1]}, ${col[2]})`, fillStyle: "zigzag", strokeWidth: 1, roughness: Math.random() * (num+1), bowing: num+2
    })
 }
