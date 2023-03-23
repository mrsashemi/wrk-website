import React, { RefObject, useEffect, useRef, useState } from "react"
import { tileFragment } from "./assets/shaders/tile";
import portrait from './assets/images/hasibwide.JPG'
import spritesheet from './assets/chickens/spritesheet.png'
import spriteJSON from './assets/chickens/spritesheet.json'
import allchickenlines from './assets/chickens/allchickenlines.png'
import { useWindowSize } from "@/hooks/useWindowSize";
import Image from "next/image";
import { contrastFragment, sharpenFragment } from "./assets/shaders/contrastAccessibility";
import { vertexUniversal } from "./assets/shaders/universalVertex";
import { useDispatch, useSelector } from "react-redux";
import { getDomImage, getHovering, getInvert, getMousePos, setCanvasSize } from "@/state/slices/canvasSlice";


export const ChickenRipple = () => {
    const windowSizes = useWindowSize();
    const dispatch = useDispatch();
    const domImage = useSelector(getDomImage);
    const mousePos = useSelector(getMousePos);
    const isHovering = useSelector(getHovering);
    const isInvert = useSelector(getInvert);
    const [sketchReady, setReady] = useState(false);
    const [spriteBitMap, setSprites] = useState(null);

    //animate
    const requestIdRef = useRef<any>(null);

    //image refs
    const portraitRef = useRef<HTMLImageElement>(null);
    const spritesheetRef = useRef<HTMLImageElement>(null);
    const linesRef = useRef<HTMLImageElement>(null);
    const domImgRef = useRef<HTMLImageElement>(null);

    //canvas and buffers
    const sharpenRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const resultRef = useRef<HTMLCanvasElement>(null);
    const currBuffRef = useRef<HTMLCanvasElement>(null);
    const prevBuffRef = useRef<HTMLCanvasElement>(null);
    const chickensRef = useRef<HTMLCanvasElement>(null);
    const spritesRef = useRef<HTMLCanvasElement>(null);
    const imgCanvasRef = useRef<HTMLCanvasElement>(null);

    //contexts
    const ctxSharpenRef = useRef<any>(null);
    const ctxRef = useRef<any>(null);
    const ctxResultRef = useRef<any>(null);
    const currCTXRef = useRef<any>(null);
    const prevCTXRef = useRef<any>(null);
    const chickensCTXRef = useRef<any>(null);
    const spritesCTXRef = useRef<any>(null);
    const imgCanvasCTXRef = useRef<any>(null);

    //uniforms
    const sharpenUniformRef = useRef(null);
    const resultUniformRef = useRef(null);
    const domRef = useRef(null);
    const doodleTilesRef = useRef(null);           
    const chickRef = useRef(null);           
    const musicRef = useRef(null);          
    const randomizeRef = useRef(null);          
    const isPlayRef = useRef(null);          
    const imageTextureRef = useRef(null);           
    const invertRef = useRef(null);           
    const currRef = useRef(null);          
    const prevRef = useRef(null);           
    const timeRef = useRef(null);         
    const time2Ref = useRef(null);  
    const mouseRef = useRef(null);
    const mouse2Ref = useRef(null);
    const hoverRef = useRef(null);

    // Interleaved data buffer (X,Y: vertex coordinates, U,V: texture coordinates)
    const verticesTexCoords = new Float32Array([
        -1.0, 1.0,  0.0, 1.0,
        -1.0, -1.0, 0.0, 0.0,
        1.0,  1.0,  1.0, 1.0,
        1.0,  -1.0, 1.0, 0.0,
    ]);
    

    const n = 4; // vertices (4)
    const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT; // bytes per float (4)
    const damping = 0.98; //for water ripple effect

    //Initialize Sketch
    useEffect(() => {
        const initSketch = async () => {
            const canvas: any = canvasRef.current;
            ctxRef.current = canvas.getContext('webgl2', {
                willReadFrequently: true,
                alpha: true,
                antialias: true,
                depth: true,
                stencil: true,
                premultipliedAlpha: false,
                preserveDrawingBuffer: true,
                perPixelLighting: true,
                version: 2
            });
            const img: any = portraitRef.current;
            const ctx = ctxRef.current;
            canvas.width = img.width/1.75;
            canvas.height = img.height/1.75;
            dispatch(setCanvasSize([canvas.width, canvas.height]));

            const result: any = resultRef.current;
            ctxResultRef.current = result.getContext('webgl2', {
                willReadFrequently: true,
                alpha: true,
                antialias: true,
                depth: true,
                stencil: true,
                premultipliedAlpha: false,
                preserveDrawingBuffer: true,
                perPixelLighting: true,
                version: 2
            });
            const rtx = ctxResultRef.current;
            result.width = canvas.width;
            result.height = canvas.height;

            const sharpen: any = sharpenRef.current;
            ctxSharpenRef.current = sharpen.getContext('webgl2', {
                willReadFrequently: true,
                alpha: true,
                antialias: true,
                depth: true,
                stencil: true,
                premultipliedAlpha: false,
                preserveDrawingBuffer: true,
                perPixelLighting: true,
                version: 2
            });
            const stx = ctxSharpenRef.current;
            sharpen.width = canvas.width;
            sharpen.height = canvas.height;


            
            const sprites: any = spritesRef.current;
            const lines: any = linesRef.current;
            spritesCTXRef.current = sprites.getContext('2d', {
                willReadFrequently: true,
                alpha: true,
            });
            const spritesCTX = spritesCTXRef.current;
            sprites.width = 5596;
            sprites.height = 1177;
            spritesCTX.drawImage(lines, 0, 0);

            const imgCanvas: any = imgCanvasRef.current;
            imgCanvasCTXRef.current = imgCanvas.getContext('2d', {
                willReadFrequently: true,
                alpha: true,
            });
            imgCanvas.width = canvas.width;
            imgCanvas.height = canvas.height;
            const imgCanvasCTX = imgCanvasCTXRef.current;
            imgCanvasCTX.drawImage(img, 0, 0, canvas.width, canvas.height);

            const chickens: any = chickensRef.current;
            chickensCTXRef.current = chickens.getContext('2d', {
                willReadFrequently: true,
                alpha: true,
            });
            chickens.width = canvas.width;
            chickens.height = canvas.height;

            const currBuff: any = currBuffRef.current;
            currCTXRef.current = currBuff.getContext('2d', {
                willReadFrequently: true,
                alpha: true,
            });
            currBuff.width = canvas.width;
            currBuff.height = canvas.height;

            const prevBuff: any = prevBuffRef.current;
            prevCTXRef.current = prevBuff.getContext('2d', {
                willReadFrequently: true,
                alpha: true,
            });
            prevBuff.width = canvas.width;
            prevBuff.height = canvas.height;
           
            const program = compile(ctx, vertexUniversal, tileFragment);
            const resultProgram = compile(rtx, vertexUniversal, contrastFragment);
            const sharpenProgram = compile(stx, vertexUniversal, sharpenFragment);

            // Create the buffer object
            const vertexTexCoordBuffer = ctx.createBuffer();
            ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexTexCoordBuffer);
            ctx.bufferData(ctx.ARRAY_BUFFER, verticesTexCoords, ctx.STATIC_DRAW);

            const vertexTexCoordBufferRes = rtx.createBuffer();
            rtx.bindBuffer(rtx.ARRAY_BUFFER, vertexTexCoordBufferRes);
            rtx.bufferData(rtx.ARRAY_BUFFER, verticesTexCoords, rtx.STATIC_DRAW);

            const vertexTexCoordBufferSharp = stx.createBuffer();
            stx.bindBuffer(stx.ARRAY_BUFFER, vertexTexCoordBufferSharp);
            stx.bufferData(stx.ARRAY_BUFFER, verticesTexCoords, stx.STATIC_DRAW);


            // Use every 1st and 2nd float for position
            const position = ctx.getAttribLocation(program, 'aPosition');
            ctx.vertexAttribPointer(position, 2, ctx.FLOAT, false, FSIZE * 4, 0);
            ctx.enableVertexAttribArray(position);

            const positionRes = rtx.getAttribLocation(resultProgram, 'aPosition');
            rtx.vertexAttribPointer(positionRes, 2, rtx.FLOAT, false, FSIZE * 4, 0);
            rtx.enableVertexAttribArray(positionRes);

            const positionSharp = stx.getAttribLocation(sharpenProgram, 'aPosition');
            stx.vertexAttribPointer(positionSharp, 2, stx.FLOAT, false, FSIZE * 4, 0);
            stx.enableVertexAttribArray(positionSharp);

            // Use every 3rd and 4th float for texCoord
            const texCoord = ctx.getAttribLocation(program, 'aTexCoord');
            ctx.vertexAttribPointer(texCoord, 2, ctx.FLOAT, false, FSIZE * 4, FSIZE * 2);
            ctx.enableVertexAttribArray(texCoord);

            const texCoordRes = rtx.getAttribLocation(resultProgram, 'aTexCoord');
            rtx.vertexAttribPointer(texCoordRes, 2, rtx.FLOAT, false, FSIZE * 4, FSIZE * 2);
            rtx.enableVertexAttribArray(texCoordRes);

            const texCoordSharp = stx.getAttribLocation(sharpenProgram, 'aTexCoord');
            stx.vertexAttribPointer(texCoordSharp, 2, stx.FLOAT, false, FSIZE * 4, FSIZE * 2);
            stx.enableVertexAttribArray(texCoordRes);
  

            const res = ctx.getUniformLocation(program, 'res');
            const res2 = rtx.getUniformLocation(resultProgram, 'res');
            const res3 = stx.getUniformLocation(sharpenProgram, 'res');
            
            const pix = ctx.getUniformLocation(program, 'pix');
            const doodleX = ctx.getUniformLocation(program, 'doodleX');
            const doodleY = ctx.getUniformLocation(program, 'doodleY');
            const damp = ctx.getUniformLocation(program, 'damping');

            doodleTilesRef.current = ctx.getUniformLocation(program, 'doodleTiles');
            chickRef.current = ctx.getUniformLocation(program, 'chick');
            musicRef.current = ctx.getUniformLocation(program, 'music');
            randomizeRef.current = ctx.getUniformLocation(program, 'randomize');
            isPlayRef.current = ctx.getUniformLocation(program, 'isPlaying');
            imageTextureRef.current = ctx.getUniformLocation(program, 'imageTexture');
            invertRef.current = ctx.getUniformLocation(program, 'invert');
            currRef.current = ctx.getUniformLocation(program, 'currBuff');
            prevRef.current = ctx.getUniformLocation(program, 'prevBuff');
            resultUniformRef.current = rtx.getUniformLocation(resultProgram, 'uiBackground');
            domRef.current = rtx.getUniformLocation(resultProgram, 'uiForeground');
            hoverRef.current = rtx.getUniformLocation(resultProgram, 'hover');
            sharpenUniformRef.current = stx.getUniformLocation(resultProgram, 'uiBackground');

            timeRef.current = ctx.getUniformLocation(program, 'time');
            time2Ref.current = rtx.getUniformLocation(resultProgram, 'time');
            mouseRef.current = ctx.getUniformLocation(program, 'mouse');
            mouse2Ref.current = rtx.getUniformLocation(resultProgram, 'mouse');

            // Flip the image's y axis
            ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 1);
            rtx.pixelStorei(rtx.UNPACK_FLIP_Y_WEBGL, 1);
            stx.pixelStorei(rtx.UNPACK_FLIP_Y_WEBGL, 1);

            const texture00 = ctx.createTexture();
            addTexture(ctx, texture00, ctx.TEXTURE1, spritesRef.current, doodleTilesRef.current, 1)

            const texture000 = ctx.createTexture();
            addTexture(ctx, texture000, ctx.TEXTURE2, portraitRef.current, imageTextureRef.current, 2);

            ctx.uniform2f(res, canvas.width, canvas.height);
            rtx.uniform2f(res2, canvas.width, canvas.height);
            stx.uniform2f(res3, canvas.width, canvas.height);
            ctx.uniform2f(pix, 1.0/canvas.width, 1.0/canvas.height);
            ctx.uniform1f(doodleX, 20.0);
            ctx.uniform1f(doodleY, 4.0);
            ctx.uniform1f(damp, damping);

            ctx.blendFunc(ctx.ONE,ctx.ONE_MINUS_SRC_ALPHA);
            ctx.enable(ctx.BLEND);
            ctx.clearColor(0.0,0.0,0.0,0.0);
            ctx.viewport(0,0,canvas.width, canvas.height);

            rtx.blendFunc(rtx.ONE,rtx.ONE_MINUS_SRC_ALPHA);
            rtx.enable(rtx.BLEND);
            rtx.clearColor(0.0,0.0,0.0,0.0);
            rtx.viewport(0,0,canvas.width, canvas.height);

            stx.blendFunc(stx.ONE,stx.ONE_MINUS_SRC_ALPHA);
            stx.enable(stx.BLEND);
            stx.clearColor(0.0,0.0,0.0,0.0);
            stx.viewport(0,0,canvas.width, canvas.height);
            loadChickens();

            setReady(true);
        }
        initSketch();
    }, [])

    async function loadChickens() {
        let tempSprites: any = [];
        let allsprites: any = spritesheetRef.current;
        let allspritesJSON: any = spriteJSON
        for (let i = 0; i < 2; i++) {
            tempSprites.push(await createImageBitmap(
                allsprites, 
                allspritesJSON.frames[`chickenlines-${i}.png`]["frame"]["x"], 
                allspritesJSON.frames[`chickenlines-${i}.png`]["frame"]["y"], 
                allspritesJSON.frames[`chickenlines-${i}.png`]["frame"]["w"],
                allspritesJSON.frames[`chickenlines-${i}.png`]["frame"]["h"])
            )
        }

        setSprites(tempSprites);
    }

    function sketch(now: any) {
        requestIdRef.current = requestAnimationFrame(sketch as any);
        const canvas: any = canvasRef.current;
        const result: any = resultRef.current;
        const ctx = ctxRef.current;
        const rtx = ctxResultRef.current;
        const stx = ctxSharpenRef.current;
        const chickensCTX = chickensCTXRef.current;

        if (spriteBitMap) {
            let randX = Math.floor(Math.random()*canvas.width);
            let randY = Math.floor(Math.random()*canvas.height);

            
            let randArr: any = getRandomColor(randX, randY, sketchReady, imgCanvasCTXRef.current);
            let chkn = Math.floor(Math.random()*(spriteBitMap as any).length);
    
            //lines and tinted are the same
            let bitmap: any = spriteBitMap;
            const tinted = tint(bitmap[chkn], randArr[2]);
            chickensCTX.drawImage(tinted, randX, randY, 50, 50);
            if (mousePos) chickensCTX.drawImage(tinted, mousePos[0], mousePos[1], 30, 30);
        }

        const prevCTX = prevCTXRef.current;
        const currCTX = currCTXRef.current;
        prevCTX.drawImage(currBuffRef.current, 0, 0);
        currCTX.drawImage(canvasRef.current, 0, 0);

        ctx.uniform1f(musicRef.current, 0.0);
        ctx.uniform1f(randomizeRef.current, 0.0);
        ctx.uniform1f(isPlayRef.current, 0.0);
        ctx.uniform1f(invertRef.current, (isInvert) ? 1.0 : 0.0);
        ctx.uniform1f(timeRef.current, now);
        rtx.uniform1f(time2Ref.current, now);
        rtx.uniform1f(hoverRef.current, (isHovering) ? 1.0 : 0.0);
        if (mousePos) ctx.uniform2f(mouseRef.current, mousePos[0], mousePos[1]);
        if (mousePos) rtx.uniform2f(mouse2Ref.current, mousePos[0], mousePos[1]);

        // quadtree + ripple effect
        const texture0 = ctx.createTexture();
        addTexture(ctx, texture0, ctx.TEXTURE0, chickensRef.current, chickRef.current, 0)

        const texture1 = ctx.createTexture();
        addTexture(ctx, texture1, ctx.TEXTURE3, currBuffRef.current, currRef.current , 3)

        const texture2 = ctx.createTexture();
        addTexture(ctx, texture2, ctx.TEXTURE4, prevBuffRef.current, prevRef.current, 4)
     
        ctx.clear(ctx.COLOR_BUFFER_BIT);   // Clear canvas
        ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, n); // Draw the quad
        
        // adjust contrast for accessibility
        const textureRes = rtx.createTexture();
        addTexture(rtx, textureRes, rtx.TEXTURE0, canvas, resultUniformRef.current, 0);

        const texture2Res = rtx.createTexture();
        addTexture(rtx, texture2Res, rtx.TEXTURE1, domImgRef.current, domRef.current, 1);

        rtx.clear(rtx.COLOR_BUFFER_BIT);   // Clear canvas
        rtx.drawArrays(rtx.TRIANGLE_STRIP, 0, n); // Draw the quad

        // sharpen resolution
        const textureSharp = stx.createTexture();
        addTexture(stx, textureSharp, stx.TEXTURE0, result, sharpenUniformRef.current, 0);

        stx.clear(stx.COLOR_BUFFER_BIT);   // Clear canvas
        stx.drawArrays(stx.TRIANGLE_STRIP, 0, n); // Draw the quad

        if (Math.floor(now/1000) % 5 === 0) chickensCTX.clearRect(0, 0, canvas.width, canvas.height);
    }


    useEffect(() => {
        if (sketchReady) sketch(performance.now);

        return () => {
            cancelAnimationFrame(requestIdRef.current);
        }

    }, [sketch, sketchReady])


    return (
        <React.Fragment>
            <canvas ref={sharpenRef} className="absolute inset-0" />
            <canvas ref={resultRef} className="invisible" />
            <canvas ref={canvasRef} className="invisible"/>
            <canvas ref={currBuffRef} className="invisible" />
            <canvas ref={prevBuffRef} className="invisible" />
            <canvas ref={chickensRef} className="invisible" />
            <canvas ref={spritesRef} className="invisible" />
            <canvas ref={imgCanvasRef} className="invisible" />
            <Image src={portrait} width={windowSizes[0]} height={windowSizes[1]} alt="Portrait of Hasib" className="hidden" ref={portraitRef} priority/>
            <Image src={spritesheet} alt="all sprites" className="hidden" ref={spritesheetRef} priority unoptimized/>
            <Image src={allchickenlines} alt="line sprites" className="hidden" ref={linesRef} priority unoptimized/>
            <img src={domImage} alt="rasterized DOM" className="hidden" width={windowSizes[0]} height={windowSizes[1]} ref={domImgRef} />
        </React.Fragment>
    )
}

const addTexture = (ctx: WebGL2RenderingContext, texture: any, TEXTURE: any, bufferImg: any, buffer: any, num: any) => {
    ctx.activeTexture(TEXTURE);
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGB, ctx.RGB, ctx.UNSIGNED_BYTE, bufferImg);
    ctx.uniform1i(buffer, num);
}

function tint(img: any, color: any) {
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
const compile = (gl: any, vshader: any, fshader: any) => {
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


function getRandomColor(x: any, y: any, imgReady: any, context: any) {
    if (!imgReady) return;
    let color = context.getImageData(x, y, 1, 1);
    let brightness = Math.round((color.data[0]+color.data[0]+color.data[1]+color.data[2]+color.data[2]+color.data[2])/6);
    let hex = rgbToHex(color.data[0], color.data[1], color.data[2]);
    return [color, brightness, hex];
}

function mapRange (value: any, a: any, b: any, c: any, d: any) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}

function distanceRange(x1: any, y1: any, x2: any, y2: any) {
    return Math.hypot(x2-x1, y2-y1);
}

function componentToHex(c: any) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r: any, g: any, b: any) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
