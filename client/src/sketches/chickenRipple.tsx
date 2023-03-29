import React, { useEffect, useRef, useState } from "react"
import { tileFragment } from "./assets/shaders/tile";
import portrait from './assets/images/hasibwide.JPG'
import spritesheet from './assets/chickens/spritesheet.png'
import spriteJSON from './assets/chickens/spritesheet.json'
import allchickenlines from './assets/chickens/allchickenlines.png'
import Image from "next/image";
import { contrastFragment, sharpenFragment } from "./assets/shaders/contrastAccessibility";
import { vertexUniversal } from "./assets/shaders/universalVertex";
import { useDispatch, useSelector } from "react-redux";
import { getDomImage, getHovering, getInvert, getMousePos, getPressing, setCanvasSize } from "@/state/slices/canvasSlice";
import { addTexture, create2Dbuffer, createGLbuffer, getRandomColor, loadChickens, prepareShader, setUniform1f, setUniform2f, tint } from "./methods/methods";


export const ChickenRipple = () => {
    const isPressing = useSelector(getPressing);
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

    //shader refs
    const quadripples = useRef<any>(null)
    const adjustContrast = useRef<any>(null)
    const sharpenResult = useRef<any>(null)

    //contexts
    const ctxSharpenRef = useRef<any>(null);
    const ctxRef = useRef<any>(null);
    const ctxResultRef = useRef<any>(null);
    const currCTXRef = useRef<any>(null);
    const prevCTXRef = useRef<any>(null);
    const chickensCTXRef = useRef<any>(null);
    const spritesCTXRef = useRef<any>(null);
    const imgCanvasCTXRef = useRef<any>(null);


    //Initialize Sketch
    useEffect(() => {
        const initSketch = async () => {
            const img: any = portraitRef.current;
            let w = img.width/2;
            let h = img.height/2;

            ctxRef.current = createGLbuffer(ctxRef.current, canvasRef.current, w, h);
            const ctx = ctxRef.current;
            ctxResultRef.current = createGLbuffer(ctxResultRef.current, resultRef.current, w, h);
            const rtx = ctxResultRef.current;
            ctxSharpenRef.current = createGLbuffer(ctxSharpenRef.current, sharpenRef.current, w, h);
            const stx = ctxSharpenRef.current;

            spritesCTXRef.current = create2Dbuffer(spritesCTXRef.current, spritesRef.current, 5596, 1177, true, linesRef.current)
            imgCanvasCTXRef.current = create2Dbuffer(imgCanvasCTXRef.current, imgCanvasRef.current, w, h, true, img)
            chickensCTXRef.current = create2Dbuffer(chickensCTXRef.current, chickensRef.current, w, h, false, null)
            currCTXRef.current = create2Dbuffer(currCTXRef.current, currBuffRef.current, w, h, false, null)
            prevCTXRef.current = create2Dbuffer(prevCTXRef.current, prevBuffRef.current, w, h, false, null)

            quadripples.current = prepareShader(ctx, vertexUniversal, tileFragment, w, h);
            adjustContrast.current = prepareShader(rtx, vertexUniversal, contrastFragment, w, h);
            sharpenResult.current = prepareShader(stx, vertexUniversal, sharpenFragment, w, h);

            setUniform2f(ctxRef.current, 'res', quadripples.current, w, h);
            setUniform2f(ctxResultRef.current, 'res', adjustContrast.current, w, h);
            setUniform2f(ctxSharpenRef.current, 'res', sharpenResult.current, w, h);
            setUniform2f(ctxSharpenRef.current, 'res', sharpenResult.current, w, h);
            setUniform2f(ctxRef.current, 'pix', quadripples.current, 1/w, 1/h);
            setUniform2f(ctxRef.current, 'res', quadripples.current, w, h);
            setUniform1f(ctxRef.current, 'doodleX', quadripples.current, 20.0);
            setUniform1f(ctxRef.current, 'doodleY', quadripples.current, 4.0);
            setUniform1f(ctxRef.current, 'damping', quadripples.current, 0.98);
            addTexture(ctx, ctx.TEXTURE1, spritesRef.current, quadripples.current, 1, 'doodleTiles')
            addTexture(ctx, ctx.TEXTURE2, portraitRef.current, quadripples.current, 2, 'imageTexture');

            const tempSprites = await loadChickens(spritesheetRef.current, spriteJSON);
            setSprites(tempSprites.lines);
            dispatch(setCanvasSize([w, h]));
            setReady(true);
        }
        initSketch();
    }, [])


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
            const tinted = tint(bitmap[chkn], randArr[0]);
            chickensCTX.drawImage(tinted, randX, randY, 100, 100);
            if (mousePos) chickensCTX.drawImage(tinted, mousePos[0], mousePos[1], 20, 20);
        }

        const prevCTX = prevCTXRef.current;
        const currCTX = currCTXRef.current;
        prevCTX.drawImage(currBuffRef.current, 0, 0);
        currCTX.drawImage(canvasRef.current, 0, 0);

        setUniform1f(ctxRef.current, 'music', quadripples.current, 0.0);
        setUniform1f(ctxRef.current, 'randomize', quadripples.current, 0.0);
        setUniform1f(ctxRef.current, 'isPlaying', quadripples.current, 0.0);
        setUniform1f(ctxRef.current, 'invert', quadripples.current, (isInvert) ? 1.0 : 0.0);
        setUniform1f(ctxResultRef.current, 'isPressing', adjustContrast.current, (isPressing) ? 1.0 : 0.0);
        setUniform1f(ctxRef.current, 'time', quadripples.current, now);
        setUniform1f(ctxResultRef.current, 'time', adjustContrast.current, now);
        setUniform1f(ctxResultRef.current, 'hover', adjustContrast.current, (isHovering) ? 1.0 : 0.0);
        if (mousePos) setUniform2f(ctxRef.current, 'mouse', quadripples.current, mousePos[0], mousePos[1]);
        if (mousePos) setUniform2f(ctxResultRef.current, 'mouse', adjustContrast.current, mousePos[0], mousePos[1]);
      
        // quadtree + ripple effect
        addTexture(ctx, ctx.TEXTURE0, chickensRef.current, quadripples.current, 0, 'chick')
        addTexture(ctx,  ctx.TEXTURE3, currBuffRef.current, quadripples.current, 3, 'currBuff')
        addTexture(ctx, ctx.TEXTURE4, prevBuffRef.current, quadripples.current, 4, 'prevBuff')
        ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4); // Draw the quad
        
        // adjust contrast for accessibility
        addTexture(rtx, rtx.TEXTURE0, canvas, adjustContrast.current, 0, 'uiBackground');
        addTexture(rtx, rtx.TEXTURE1, domImgRef.current, adjustContrast.current, 1, 'uiForeground');
        rtx.drawArrays(rtx.TRIANGLE_STRIP, 0, 4); // Draw the quad

        // sharpen
        addTexture(stx, stx.TEXTURE0, result, sharpenResult.current, 0, 'uiBackground');
        stx.drawArrays(stx.TRIANGLE_STRIP, 0, 4); // Draw the quad

        if (Math.floor(now/1000) % 5 === 0) chickensCTX.clearRect(0, 0, canvas.width, canvas.height);
        if (isPressing) currCTX.clearRect(0, 0, canvas.width, canvas.height);
    }


    useEffect(() => {
        if (sketchReady) sketch(performance.now);
        return () => {
            cancelAnimationFrame(requestIdRef.current);
        }
    }, [sketch, sketchReady])


    return (
        <React.Fragment>
            <canvas ref={sharpenRef} className="absolute inset-0 w-full h-full overflow-hidden z-10" />
            <canvas ref={resultRef} className="invisible" />
            <canvas ref={canvasRef} className="invisible"/>
            <canvas ref={currBuffRef} className="invisible" />
            <canvas ref={prevBuffRef} className="invisible" />
            <canvas ref={chickensRef} className="invisible" />
            <canvas ref={spritesRef} className="invisible" />
            <canvas ref={imgCanvasRef} className="invisible" />
            <Image src={portrait}  alt="Portrait of Hasib" className="hidden" ref={portraitRef} priority/>
            <Image src={spritesheet} alt="all sprites" className="hidden" ref={spritesheetRef} priority unoptimized/>
            <Image src={allchickenlines} alt="line sprites" className="hidden" ref={linesRef} priority unoptimized/>
            <img src={domImage} alt="rasterized DOM" className="hidden" ref={domImgRef} />
        </React.Fragment>
    )
}

