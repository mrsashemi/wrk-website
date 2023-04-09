import Image from "next/image";
import React, { useEffect, useRef, useState } from "react"
import portrait from './assets/images/hasibwide-nobg.png'
import edges from './assets/images/hasibwide-edges.png'
import spritesheet from './assets/chickens/spritesheet.png'
import spriteJSON from './assets/chickens/spritesheet.json'
import { colorDistance, distanceRange, drawChicken, drawRoughCircle, drawRoughCube, drawRoughPyramid, drawRoughStar, drawRoughtHeart, getRandomColor, loadChickens, mapRange } from "./methods/effects";
import { create2Dbuffer } from "./methods/createbuffer"
import { setCanvasSize } from "@/state/slices/canvasSlice";
import { useDispatch } from "react-redux";
import { Point, QuadTree, Rect } from "./methods/quadtree";
import rough from "roughjs/bundled/rough.cjs.js";

export const Chickens1000 = () => {
    //state
    const [sketchReady, setReady] = useState(false);
    const [allSprites, setAllSprites] = useState(null);

    //constants
    const brightnessLimits = [255, 221, 187, 155, 123, 94, 66, 40, 14, 0];

    //redux
    const dispatch = useDispatch();

    //animate
    const sketchId = useRef<any>(null);

    //images
    const img = useRef<HTMLImageElement>(null);
    const edge = useRef<HTMLImageElement>(null);
    const sprites = useRef<HTMLImageElement>(null);

    //data 
    const qtree = useRef<QuadTree>();
    const pixels = useRef<DataView>();
    const edgePixels = useRef<DataView>();
    const curves = useRef<any>(null);

    //canvas and buffers
    const c = useRef<HTMLCanvasElement>(null);
    const c0 = useRef<HTMLCanvasElement>(null);
    const c1 = useRef<HTMLCanvasElement>(null);
    const c2 = useRef<HTMLCanvasElement>(null);
    const c3 = useRef<HTMLCanvasElement>(null);
    const c4 = useRef<HTMLCanvasElement>(null);
    const c5 = useRef<HTMLCanvasElement>(null);
    const c6 = useRef<HTMLCanvasElement>(null);
    const c7 = useRef<HTMLCanvasElement>(null);
    const c8 = useRef<HTMLCanvasElement>(null);
    const cImg = useRef<HTMLCanvasElement>(null);
    const cEdge = useRef<HTMLCanvasElement>(null);
    const cBuffers = useRef<any>(null);

    //contexts
    const ctx = useRef<any>(null);
    const ctx0 = useRef<any>(null);
    const ctx1 = useRef<any>(null);
    const ctx2 = useRef<any>(null);
    const ctx3 = useRef<any>(null);
    const ctx4 = useRef<any>(null);
    const ctx5 = useRef<any>(null);
    const ctx6 = useRef<any>(null);
    const ctx7 = useRef<any>(null);
    const ctx8 = useRef<any>(null);
    const ctxImg = useRef<any>(null);
    const ctxEdge = useRef<any>(null);
    const ctxBuffers = useRef<any>(null);

    //rough
    const rc0 = useRef<any>(null);
    const rc1 = useRef<any>(null);
    const rc2 = useRef<any>(null);
    const rc3 = useRef<any>(null);
    const rc4 = useRef<any>(null);
    const rc5 = useRef<any>(null);
    const rc6 = useRef<any>(null);
    const rc7 = useRef<any>(null);
    const rc8 = useRef<any>(null);
    const rcBuffers = useRef<any>(null);

    //initialize sketch
    useEffect(() => {
        const initSketch = async () => {
            const i: any = img.current;
            let w = Math.floor(i.width);
            let h = Math.floor(i.height);

            cBuffers.current = [c0, c1, c2, c3, c4, c5, c6, c7, c8];
            ctxBuffers.current = [ctx0, ctx1, ctx2, ctx3, ctx4, ctx5, ctx6, ctx7, ctx8];
            rcBuffers.current = [rc0, rc1, rc2, rc3, rc4, rc5, rc6, rc7, rc8];

            for (let i = 0; i < 9; i++) {
                let cx = ctxBuffers.current[i];
                let cn = cBuffers.current[i];
                let rn = rcBuffers.current[i];
                cx.current = create2Dbuffer(cx.current, cn.current, w, h, false, null);
                rn.current = rough.canvas((cn as any).current);
            }

            ctx.current = create2Dbuffer(ctx.current, c.current, w, h, false, null);
            ctxImg.current = create2Dbuffer(ctxImg.current, cImg.current, w, h, true, i);
            ctxEdge.current = create2Dbuffer(ctxEdge.current, cEdge.current, w, h, true, edge.current);

            const colorData = ctxImg.current.getImageData(0, 0, w, h).data;
            pixels.current = colorData;

            const edgeData = ctxEdge.current.getImageData(0, 0, w, h).data;
            edgePixels.current = edgeData;
       
            const boundry = new Rect(w/2, h/2, w/2, h/2);
            qtree.current = new QuadTree(boundry, 4);

            curves.current = [];
            dispatch(setCanvasSize([w, h]));
            const tempSprites = await loadChickens(sprites.current, spriteJSON);
            setAllSprites(tempSprites as any);
            setReady(true);
        }
        
        initSketch();
    }, []);
    
    //draw function
    function sketch(now: any) {
        sketchId.current = requestAnimationFrame(sketch as any);
        const cx: any = ctx.current
        const cn: any = c.current;
        let distance = 200;
        let thinMin = 350;
        let thinMax = 310;

        for (let i = 0; i < 9; i++) {
            drawLayer(
                brightnessLimits[i + 1], 
                brightnessLimits[i], 
                distance, 
                thinMin, 
                thinMax, 
                ctxBuffers.current[i].current,
                rcBuffers.current[i].current,
                i
            );

            thinMax -= 30;
            thinMin -= 30;
        }
     
        for (let i = 0; i < 9; i++) {
            cx.drawImage((cBuffers as any).current[i].current, 0, 0, cn.width, cn.height);
        } 
    }

    function drawLayer(lowerLimit: number, upperLimit: number, distance: number, minSize: number, maxSize: number, ctx: any, rc: any, num: number) {
        const cnvs: any = c.current;
        const w: number = cnvs.width;
        const h: number = cnvs.height;
        let randX = Math.floor(Math.random()*w/2 + w/4); //Hasib
        let randY = Math.floor(Math.random()*h + h/6);
        // let randX = Math.floor(Math.random()*w/1.5 + w/7); //Adeeb
        // let randY = Math.floor(Math.random()*h + h/7);
        let prevX = randX;
        let prevY = randY;
        let prevArr: any = getRandomColor(prevX, prevY, w, pixels.current);
        let colorDist = 0;
        let thinningScale = 2;
        if (num < 5) distance = 300;

        let effects = ["circles", "lines", "chickens", "cubes", "pyramids", "stars", "hearts"];
        let index = Math.floor(Math.random()*20);
        let generate;

        if (index > 6 && index < 16) generate = "chickens"
        else if (index > 15) generate = "lines"
        else if (num > 6) generate = "chickens"
        else generate = effects[index];

        for (let i = 0; i < 3000; i++) {
            let randX = Math.floor(Math.random()*w/2 + w/4); //Hasib
            let randY = Math.floor(Math.random()*h + h/6);
            // let randX = Math.floor(Math.random()*w/1.5 + w/7); //Adeeb
            // let randY = Math.floor(Math.random()*h + h/7);
            let randArr: any = getRandomColor(randX, randY, w, pixels.current);
            if (generate === "lines") colorDist = colorDistance(randArr[0], prevArr[0]);

            if (colorDist < 25) {
                let dist = distanceRange(randX, randY, prevX, prevY)
                let size = mapRange(randArr[1], 0, 255, minSize/4, maxSize/4);
                if (generate !== "chickens" && generate !== "lines") size = size/2.5;
              

                if (((randArr[1] < upperLimit && randArr[1] > lowerLimit) && (prevArr[1] < upperLimit && prevArr[1] > lowerLimit))) {
                    if ((dist < distance)) {
                        const quadtree = qtree.current;
                        let thinAmount = size/thinningScale;
                        let range = new Rect(randX, randY, thinAmount, thinAmount);
                        let points = quadtree?.query(num, range, null);
                        
                        if (!points?.length) {
                            let m = new Point(randX, randY, "empty", num);
                            quadtree?.insert(m);
                        
                        
                            if (generate === "chickens") drawChicken(randX, randY, size, size, ctx, randArr[0], prevArr[0], allSprites);
                            else if (generate === "lines") curves.current.push([randX, randY]);
                            else if (generate === "circles") drawRoughCircle(randX, randY, size, rc, randArr[0], prevArr[0], num);
                            else if (generate === "cubes") drawRoughCube(randX, randY, size, rc, randArr[0], prevArr[0], num);
                            else if (generate === "pyramids") drawRoughPyramid(randX, randY, size, rc, randArr[0], prevArr[0], num);
                            else if (generate === "stars") drawRoughStar(randX, randY, size, 10, 4, rc, randArr[0], num+2);
                            else if (generate === "heart") drawRoughtHeart(randX, randY, size, rc, randArr[0], num+2);

                            prevX = randX;
                            prevY = randY;
                            prevArr = randArr;
                        }
                    }
                }
            }
        }

        if (curves.current.length) {
            rc.curve(curves.current, {
                stroke: `rgb(${prevArr[0][0]}, ${prevArr[0][1]}, ${prevArr[0][2]})`, strokeWidth: 6-num/2, roughness: Math.random()*(num+2)+1,
            });
    
            curves.current.length = 0;
        }
    
    }

    //begin loop
    useEffect(() => {
        if (sketchReady) sketch(performance.now);

        return () => {
            cancelAnimationFrame(sketchId.current);
        }
    })

    return (
        <React.Fragment>
            <canvas ref={c} className="absolute inset-0 w-full h-full overflow-hidden z-20 bg-black"/>
            <canvas ref={c0} className="invisible"/>
            <canvas ref={c1} className="invisible"/>
            <canvas ref={c2} className="invisible"/>
            <canvas ref={c3} className="invisible"/>
            <canvas ref={c4} className="invisible"/>
            <canvas ref={c5} className="invisible"/>
            <canvas ref={c6} className="invisible"/>
            <canvas ref={c7} className="invisible"/>
            <canvas ref={c8} className="invisible"/>
            <canvas ref={cImg} className="invisible"/>
            <canvas ref={cEdge} className="invisible"/>
            <Image src={portrait} alt="Portrait of Hasib" className="hidden" ref={img} priority/>
            <Image src={edges} alt="Portrait of Hasib" className="hidden" ref={edge} priority/>
            <Image src={spritesheet} alt="all sprites" className="hidden" ref={sprites} priority unoptimized/>
        </React.Fragment>
    )
}
