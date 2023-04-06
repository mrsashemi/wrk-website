import { create2Dbuffer } from "@/sketches/methods/createbuffer";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import portrait from '../../sketches/assets/images/hasibwide.JPG'

interface CanvasProps {
    margins: string
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

    //context
    const ctx = useRef<any>(null);

    useEffect(() => {
        const initCanvas = async () => {
            const i: any = img.current;
            let w = Math.floor(i.width);
            let h = Math.floor(i.height);

            if (w > h) {
                let ratio = h/w;
                setAspect({width: `${100}%`, height: `${ratio*100}%`});
            } else {
                let ratio = w/h;
                setAspect({width: `${ratio*100}%`, height: `${100}%`});
            }

            ctx.current = create2Dbuffer(ctx.current, c.current, w, h, true, i);
        }

        initCanvas();
    }, [])

    return (
        <div className={`flex flex-col justify-center ${props.margins} h-2/4 border-2 border-solid`}>
            <canvas ref={c} style={aspect}></canvas>
            <Image src={portrait} alt="Portrait of Hasib" className="hidden" ref={img} priority/>
        </div>
    )
}


export default Canvas;