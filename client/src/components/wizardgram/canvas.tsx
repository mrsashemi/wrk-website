import { filterFragment } from "@/sketches/assets/shaders/filters";
import { vertexUniversal } from "@/sketches/assets/shaders/universalVertex";
import { addTexture, create2Dbuffer, createGLbuffer, prepareShader, setUniform1f, setUniform2f } from "@/sketches/methods/createbuffer";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import portrait from '../../sketches/assets/images/hasibwide.JPG'

interface CanvasProps {
    margins: string;
    divWidth: string;
    display2D: string;
    displayWEBGL: string;
    scale: string;
    useFilter: boolean;
    br: number;
    con: number;
    sat: number;
    red: number;
    green: number;
    blue: number;
    strength: number;
}

interface AspectRatio {
    width: string;
    height: string;
}

function Canvas(props:CanvasProps) {
    const [aspect, setAspect] = useState<AspectRatio>()

    //img
    const img = useRef<HTMLImageElement>(null)

    //canvas
    const c = useRef<HTMLCanvasElement>(null);
    const cFilter = useRef<HTMLCanvasElement>(null);

    //context
    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const gl = useRef<any>(null);

    //shaders
    const filter = useRef<any>(null);

    useEffect(() => {
        const initCanvas = async () => {
            const i: HTMLImageElement | null = img.current;
            let w: number = Math.floor((i as HTMLImageElement).width);
            let h: number = Math.floor((i as HTMLImageElement).height);

            if (w > h) {
                let ratio = h/w;
                setAspect({width: `${100}%`, height: `${ratio*100}%`});
            } else {
                let ratio = w/h;
                setAspect({width: `${ratio*100}%`, height: `${100}%`});
            }

            ctx.current = create2Dbuffer(ctx.current, c.current, w, h, true, i);
            gl.current = createGLbuffer(gl.current, cFilter.current, w, h);
            filter.current = prepareShader(gl.current, vertexUniversal, filterFragment, w, h);

            setUniform2f(gl.current, 'res', filter.current, w, h);
            addTexture(gl.current, gl.current.TEXTURE0, c.current, filter.current, 0, 'img0');
            addTexture(gl.current, gl.current.TEXTURE1, c.current, filter.current, 1, 'img1');
        }

        initCanvas();
    }, []);

    useEffect(() => {
        const addFilter = () => {
            if (props.useFilter) {
                setUniform1f(gl.current, 'br', filter.current, props.br);
                setUniform1f(gl.current, 'con', filter.current, props.con);
                setUniform1f(gl.current, 'sat', filter.current, props.sat);
                setUniform1f(gl.current, 'red', filter.current, props.red);
                setUniform1f(gl.current, 'green', filter.current, props.green);
                setUniform1f(gl.current, 'blue', filter.current, props.blue);
                setUniform1f(gl.current, 'strength', filter.current, props.strength);
                gl.current.drawArrays(gl.current.TRIANGLE_STRIP, 0, 4);
            } 
        }

        addFilter();
    }, [
        props.useFilter,
        props.br,
        props.con,
        props.sat,
        props.red,
        props.green,
        props.blue,
        props.strength
    ])

    return (
        <div className={`flex flex-col justify-center self-center ${props.margins} ${props.divWidth} ${props.scale} border-2 border-solid`}>
            <canvas ref={cFilter} className={`${props.displayWEBGL}`} style={aspect}></canvas>
            <canvas ref={c} className={`${props.display2D}`} style={aspect}></canvas>
            <Image src={portrait} alt="Portrait of Hasib" className="hidden" ref={img} priority/>
        </div>
    )
}


export default Canvas;

