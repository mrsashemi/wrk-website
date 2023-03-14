import React, { useCallback, useEffect } from "react";
import p5Types from "p5";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { getDomImage } from "@/state/slices/canvasSlice";

// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
})

interface ComponentProps {
    
}

let x = 50;
let y = 50;
let img: any;

export const InitialSketch: React.FC<ComponentProps> = (props: ComponentProps) => {
    const domImage = useSelector(getDomImage);

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
        img = p5.loadImage(domImage, dom => {
            p5.image(dom, 0, 0)
        });
    }

    const rerender = useCallback((p5: p5Types) => {
        if (!p5) return;
        img = p5.loadImage(domImage, dom => {
            p5.image(dom, 0, 0)
        });
    }, [domImage])

    const draw = (p5: p5Types) => {
        p5.background(10,100,78,128);
        p5.ellipse(x,y,70,70);
        p5.image(img, 0, 0);

        rerender(p5);
    }



    return (
        <Sketch setup={setup} draw={draw}/>
    )
}
 