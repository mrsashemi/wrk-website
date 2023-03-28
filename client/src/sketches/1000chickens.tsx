import Image from "next/image";
import React, { useEffect, useRef, useState } from "react"
import portrait from './assets/images/hasibwide.JPG'
import spritesheet from './assets/chickens/spritesheet.png'
import spriteJSON from './assets/chickens/spritesheet.json'
import { colorDistance, create2Dbuffer, distanceRange, drawChicken, getRandomColor, loadChickens, mapRange } from "./methods/methods";
import { setCanvasSize } from "@/state/slices/canvasSlice";
import { useDispatch } from "react-redux";
import { Point, QuadTree, Rect } from "./methods/quadtree";

export const Chickens1000 = () => {
    //state
    const [sketchReady, setReady] = useState(false);
    const [spriteLines, setLines] = useState(null);
    const [spriteDetail, setDetail] = useState(null);
    const [spriteOtherDetail, setOtherDetail] = useState(null);
    const [spriteBody, setBody] = useState(null);

    //constants
    const brightnessLimits = [255, 221, 187, 155, 123, 94, 66, 40, 14, 0];

    //redux
    const dispatch = useDispatch();

    //animate
    const sketchId = useRef<any>(null);

    //images
    const img = useRef<HTMLImageElement>(null);
    const sprites = useRef<HTMLImageElement>(null);

    //data structure
    const qtree = useRef<QuadTree>();

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
    const ctxBuffers = useRef<any>(null);

    //initialize sketch
    useEffect(() => {
        const initSketch = async () => {
            const i: any = img.current;
            let w = i.width/3;
            let h = i.height/3;

            ctx.current = create2Dbuffer(ctx.current, c.current, w, h, false, null);
            ctx0.current = create2Dbuffer(ctx0.current, c0.current, w, h, false, null);
            ctx1.current = create2Dbuffer(ctx1.current, c1.current, w, h, false, null);
            ctx2.current = create2Dbuffer(ctx2.current, c2.current, w, h, false, null);
            ctx3.current = create2Dbuffer(ctx3.current, c3.current, w, h, false, null);
            ctx4.current = create2Dbuffer(ctx4.current, c4.current, w, h, false, null);
            ctx5.current = create2Dbuffer(ctx5.current, c5.current, w, h, false, null);
            ctx6.current = create2Dbuffer(ctx6.current, c6.current, w, h, false, null);
            ctx7.current = create2Dbuffer(ctx7.current, c7.current, w, h, false, null);
            ctx8.current = create2Dbuffer(ctx8.current, c8.current, w, h, false, null);
            ctxImg.current = create2Dbuffer(ctxImg.current, cImg.current, w, h, true, i);

            cBuffers.current = [c0, c1, c2, c3, c4, c5, c6, c7, c8];
            ctxBuffers.current = [
                ctx0, 
                ctx1, 
                ctx2, 
                ctx3, 
                ctx4, 
                ctx5, 
                ctx6, 
                ctx7,
                ctx8
            ];

            const boundry = new Rect(w/2, h/2, w/2, h/2);
            qtree.current = new QuadTree(boundry, 4);

            dispatch(setCanvasSize([w, h]));
            const tempSprites = await loadChickens(sprites.current, spriteJSON);
            setLines(tempSprites.lines);
            setDetail(tempSprites.detail);
            setOtherDetail(tempSprites.otherdetail);
            setBody(tempSprites.body);
            setReady(true);
        }
        
        initSketch();
    }, []);
    
    //draw function
    function sketch(now: any) {
        sketchId.current = requestAnimationFrame(sketch as any);
        const cx: any = ctx.current

        let distanceRange = 130;
        let thinMin = 350;
        let thinMax = 310;

        for (let i = 0; i < 9; i++) {
            let minSize = (i > 6) ? 45 : thinMin;
            let maxSize = (i > 6) ? 70 : thinMax;

            drawLayer(
                brightnessLimits[i + 1], 
                brightnessLimits[i], 
                distanceRange, 
                minSize, 
                maxSize, 
                ctxBuffers.current[i].current,
                i
            );

            thinMax -= 30;
            thinMin -= 30;
            if (i === 2 || i === 5) distanceRange += 10;
        }

        for (let i = 0; i < 9; i++) {
            cx.drawImage((cBuffers as any).current[i].current, 0, 0);
        } 
    }

    function drawLayer(lowerLimit: number, upperLimit: number, distance: number, minSize: number, maxSize: number, ctx: any, num: number) {
        const cnvs: any = c.current;
        const w: number = cnvs.width;
        const h: number = cnvs.height;
        let randX = Math.floor(Math.random()*w);
        let randY = Math.floor(Math.random()*h);
        let prevX = randX;
        let prevY = randY;
        let prevArr: any = getRandomColor(prevX, prevY, sketchReady, ctxImg.current);
        let loopamount = 1000;
    
        for (let i = 0; i < loopamount; i++) {
            let randX = Math.floor(Math.random()*w);
            let randY = Math.floor(Math.random()*h);
            let randArr: any = getRandomColor(prevX, prevY, sketchReady, ctxImg.current);
            let colorDist = colorDistance(randArr[0].data, prevArr[0].data);
            const colorThreshold = 25;
            let thinningScale = 8;

            if (colorDist < colorThreshold) {
                let size = mapRange(randArr[1], 0, 255, minSize, maxSize);
                size = size/8;
                let dist = distanceRange(randX, randY, prevX, prevY)

                if (((randArr[1] < upperLimit && randArr[1] > lowerLimit) && (prevArr[1] < upperLimit && prevArr[1] > lowerLimit))) {
                    if ((dist < distance)) {
                        const quadtree = qtree.current;
                        let thinAmount = size/thinningScale;
                        let range = new Rect(randX, randY, thinAmount, thinAmount);
                        let points = (quadtree as QuadTree).queryWithoutZ(range, null);
                        if (!(points as any).length) {
                            let m = new Point(randX, randY, "empty");
                            (quadtree as QuadTree).insert(m);

                            
                            drawChicken(randX, randY, size, size, ctx, randArr[2], prevArr[2], spriteLines, spriteDetail, spriteOtherDetail, spriteBody);
    
                            // if (generate === "circles") drawRoughCircle(randX, randY, size, rc, f1, f2, f3, randArr[2], prevArr[2], num+2); 
                            // else if (generate === "lines")  curves.push([randX, randY]);
                            // else if (generate === "chickens") drawChicken(randX, randY, size, size, ctx, randArr[2], prevArr[2], num+2);
                            // else if (generate === "cubes") drawRoughCube(randX, randY, size, rc, f1, f2, f3, randArr[2], prevArr[2], num+2);
                            // else if (generate === "pyramids") drawRoughPyramid(randX, randY, size, rc, f1, f2, f3, randArr[2], prevArr[2], num+2);
                            // else if (generate === "stars") drawRoughStar(randX, randY, size, 20, 3, rc, f1, randArr[2], num+2);
                            // else if (generate === "hearts") drawRoughtHeart(randX, randY, size/3, rc, f1, randArr[2], num+2);
    
                            prevX = randX;
                            prevY = randY;
                            prevArr = randArr;
                        }
                    }
                }
            }
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
            <canvas ref={c} className="absolute inset-0 w-full h-full overflow-hidden bg-black" />
            <canvas ref={c0} className="invisible" />
            <canvas ref={c1} className="invisible" />
            <canvas ref={c2} className="invisible" />
            <canvas ref={c3} className="invisible" />
            <canvas ref={c4} className="invisible" />
            <canvas ref={c5} className="invisible" />
            <canvas ref={c6} className="invisible" />
            <canvas ref={c7} className="invisible" />
            <canvas ref={c8} className="invisible" />
            <canvas ref={cImg} className="invisible" />
            <Image src={portrait} alt="Portrait of Hasib" className="hidden" ref={img} priority/>
            <Image src={spritesheet} alt="all sprites" className="hidden" ref={sprites} priority unoptimized/>
        </React.Fragment>
    )
}

