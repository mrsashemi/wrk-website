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
import { getRandomColor, loadChickens, tint } from "./methods/effects";
import { addTexture, create2Dbuffer, createGLbuffer, prepareShader, setUniform1f, setUniform2f } from "./methods/createbuffer"


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
    const sketchId = useRef<any>(null);

    //data
    const pixels = useRef<any>();

    //image refs
    const img = useRef<HTMLImageElement>(null);
    const sprites = useRef<HTMLImageElement>(null);
    const lines = useRef<HTMLImageElement>(null);
    const dom = useRef<HTMLImageElement>(null);

    //canvas and buffers
    const cSharpen = useRef<HTMLCanvasElement>(null);
    const cRipple = useRef<HTMLCanvasElement>(null);
    const cContrast = useRef<HTMLCanvasElement>(null);
    const cCurrent = useRef<HTMLCanvasElement>(null);
    const cPrevious = useRef<HTMLCanvasElement>(null);
    const cChickens = useRef<HTMLCanvasElement>(null);
    const cSprites = useRef<HTMLCanvasElement>(null);
    const cImg = useRef<HTMLCanvasElement>(null);

    //shaders
    const quadRipples = useRef<any>(null)
    const adjustContrast = useRef<any>(null)
    const sharpenResult = useRef<any>(null)

    //contexts
    const glSharpen = useRef<any>(null);
    const glRipple = useRef<any>(null);
    const glContrast = useRef<any>(null);
    const ctxCurrent = useRef<any>(null);
    const ctxPrevious = useRef<any>(null);
    const ctxChickens = useRef<any>(null);
    const ctxSprites = useRef<any>(null);
    const ctxImg = useRef<any>(null);


    //Initialize Sketch
    useEffect(() => {
        const initSketch = async () => {
            let w = Math.floor((img as any).current.width/2);
            let h = Math.floor((img as any).current.height/2);

            glRipple.current = createGLbuffer(glRipple.current, cRipple.current, w, h);
            glContrast.current = createGLbuffer(glContrast.current, cContrast.current, w, h);
            glSharpen.current = createGLbuffer(glSharpen.current, cSharpen.current, w, h);

            ctxCurrent.current = create2Dbuffer(ctxCurrent.current, cCurrent.current, w, h, false, null);
            ctxPrevious.current = create2Dbuffer(ctxPrevious.current, cPrevious.current, w, h, false, null);
            ctxChickens.current = create2Dbuffer(ctxChickens.current, cChickens.current, w, h, false, null);
            ctxSprites.current = create2Dbuffer(ctxSprites.current, cSprites.current, 5596, 1177, true, lines.current);
            ctxImg.current = create2Dbuffer(ctxImg.current, cImg.current, w, h, true, img.current);

            quadRipples.current = prepareShader(glRipple.current, vertexUniversal, tileFragment, w, h);
            adjustContrast.current = prepareShader(glContrast.current, vertexUniversal, contrastFragment, w, h);
            sharpenResult.current = prepareShader(glSharpen.current, vertexUniversal, sharpenFragment, w, h);

            setUniform2f(glContrast.current, 'res', adjustContrast.current, w, h);
            setUniform2f(glSharpen.current, 'res', sharpenResult.current, w, h);
            setUniform2f(glRipple.current, 'res', quadRipples.current, w, h);
            setUniform2f(glRipple.current, 'pix', quadRipples.current, 1/w, 1/h);
            setUniform1f(glRipple.current, 'doodleX', quadRipples.current, 20.0);
            setUniform1f(glRipple.current, 'doodleY', quadRipples.current, 4.0);
            setUniform1f(glRipple.current, 'damping', quadRipples.current, 0.98);
            addTexture(glRipple.current, glRipple.current.TEXTURE1, cSprites.current, quadRipples.current, 1, 'doodleTiles')
            addTexture(glRipple.current, glRipple.current.TEXTURE2, img.current, quadRipples.current, 2, 'imageTexture');

            const colorData = ctxImg.current.getImageData(0, 0, w, h).data;
            pixels.current = colorData;

            const tempSprites = await loadChickens(sprites.current, spriteJSON);
            setSprites(tempSprites.lines);
            dispatch(setCanvasSize([w, h]));
            setReady(true);
        }
        initSketch();
    }, [])


    function sketch(now: any) {
        sketchId.current = requestAnimationFrame(sketch as any);

        if (spriteBitMap) {
            let randX = Math.floor(Math.random()*(cRipple as any).current.width);
            let randY = Math.floor(Math.random()*(cRipple as any).current.height);

        
            let randArr: any = getRandomColor(randX, randY, (cRipple as any).current.width, pixels.current);
            let chkn = Math.floor(Math.random()*2);
    
            //lines and tinted are the same
            let bitmap: any = spriteBitMap;
            const tinted = tint(bitmap[chkn], randArr[0]);
            ctxChickens.current.drawImage(tinted, randX, randY, 50, 50);
            if (mousePos) ctxChickens.current.drawImage(tinted, mousePos[0], mousePos[1], 20, 20);
        }

        ctxPrevious.current.drawImage(cCurrent.current, 0, 0);
        ctxCurrent.current.drawImage(cRipple.current, 0, 0);

        setUniform1f(glRipple.current, 'music', quadRipples.current, 0.0);
        setUniform1f(glRipple.current, 'randomize', quadRipples.current, 0.0);
        setUniform1f(glRipple.current, 'isPlaying', quadRipples.current, 0.0);
        setUniform1f(glRipple.current, 'invert', quadRipples.current, (isInvert) ? 1.0 : 0.0);
        setUniform1f(glRipple.current, 'time', quadRipples.current, now);
        setUniform1f(glContrast.current, 'isPressing', adjustContrast.current, (isPressing) ? 1.0 : 0.0);
        setUniform1f(glContrast.current, 'time', adjustContrast.current, now);
        setUniform1f(glContrast.current, 'hover', adjustContrast.current, (isHovering) ? 1.0 : 0.0);

        if (mousePos) setUniform2f(glRipple.current, 'mouse', quadRipples.current, mousePos[0], mousePos[1]);
        if (mousePos) setUniform2f(glContrast.current, 'mouse', adjustContrast.current, mousePos[0], mousePos[1]);
      
        // quadtree + ripple effect
        addTexture(glRipple.current, glRipple.current.TEXTURE0, cChickens.current, quadRipples.current, 0, 'chick')
        addTexture(glRipple.current,  glRipple.current.TEXTURE3, cCurrent.current, quadRipples.current, 3, 'currBuff')
        addTexture(glRipple.current, glRipple.current.TEXTURE4, cPrevious.current, quadRipples.current, 4, 'prevBuff')
        glRipple.current.drawArrays(glRipple.current.TRIANGLE_STRIP, 0, 4); // Draw the quad
        
        // adjust contrast for accessibility
        addTexture(glContrast.current, glContrast.current.TEXTURE0, cRipple.current, adjustContrast.current, 0, 'uiBackground');
        addTexture(glContrast.current, glContrast.current.TEXTURE1, dom.current, adjustContrast.current, 1, 'uiForeground');
        glContrast.current.drawArrays(glContrast.current.TRIANGLE_STRIP, 0, 4); // Draw the quad

        // sharpen
        addTexture(glSharpen.current, glSharpen.current.TEXTURE0, cContrast.current, sharpenResult.current, 0, 'uiBackground');
        glSharpen.current.drawArrays(glSharpen.current.TRIANGLE_STRIP, 0, 4); // Draw the quad

        if (Math.floor(now/1000) % 5 === 0) ctxChickens.current.clearRect(0, 0, (cRipple as any).current.width, (cRipple as any).current.height);
        if (isPressing) ctxCurrent.current.clearRect(0, 0, (cRipple as any).current.width, (cRipple as any).current.height);
    }


    useEffect(() => {
        if (sketchReady) sketch(performance.now);
        return () => {
            cancelAnimationFrame(sketchId.current);
        }
    }, [sketch, sketchReady])


    return (
        <React.Fragment>
            <canvas ref={cSharpen} className="absolute inset-0 w-full h-full overflow-hidden z-10"/>
            <canvas ref={cContrast} className="invisible"/>
            <canvas ref={cRipple} className="invisible"/>
            <canvas ref={cCurrent} className="invisible"/>
            <canvas ref={cPrevious} className="invisible"/>
            <canvas ref={cChickens} className="invisible"/>
            <canvas ref={cSprites} className="invisible"/>
            <canvas ref={cImg} className="invisible"/>
            <Image src={portrait}  alt="Portrait of Hasib" className="hidden" ref={img} priority/>
            <Image src={spritesheet} alt="all sprites" className="hidden" ref={sprites} priority unoptimized/>
            <Image src={allchickenlines} alt="line sprites" className="hidden" ref={lines} priority unoptimized/>
            <img src={domImage} alt="rasterized DOM" className="hidden" ref={dom} />
        </React.Fragment>
    )
}

