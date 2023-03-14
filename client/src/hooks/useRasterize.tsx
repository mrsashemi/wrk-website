import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDomImage, setDomImage } from '@/state/slices/canvasSlice';

interface Props {
    serializeThisRef: React.RefObject<HTMLElement>;
    stateHoldingRef: React.RefObject<HTMLElement>;
    interaction: boolean;
    changeReload: boolean;
    events: string[];
}

export const throttle = (delay: number, fn: Function) => {
    let finalCall = 0;
    return (...args: any) => {
        const now = new Date().getTime();
        if (now - finalCall < delay) {
            return;
        }
        finalCall = now;
        return fn(...args);
    }
}

export const useRasterize = (props: Props): void => {
    const dispatch = useDispatch();
    
    React.useEffect(() => {
        const loadRasterizedDom = async () => {
            const DOMImage = await rasterizeToP5(props);
            return dispatch(setDomImage(DOMImage));
        }

        loadRasterizedDom();
    }, []);
}

export const rasterizeToP5 = async (props: Props) => {
    const result = await rasterizeDomNode(props.serializeThisRef.current!);
    if (!result) return;
    const DOMImage = result;
    return DOMImage;
}

export const rasterizeDomNode = async (srcElement: HTMLElement) => {
    if (!srcElement) return;
    const {width, height} = srcElement.getBoundingClientRect();
    const svgDataURI = convertToSVG(srcElement, width, height);

    const img: HTMLImageElement = await createImgFromSVG(svgDataURI);
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    context?.drawImage(img, 0, 0);
    const png = canvas.toDataURL();

    return png;
}

// this function serializes the source node and turns it into an SVG Data URI
export const convertToSVG = (source: HTMLElement, w: number, h: number) => {
    const serializedSrc = new XMLSerializer().serializeToString(source);

    // we need to escape characters that are not markup text to ensure the src node is properly converted to an SVG
    //const escapedSrc = serializedSrc.replace(/#/g, '%23').replace(/\n/g, '%0A');

    return (
        `data:image/svg+xml;charset=utf-8,
        <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
        <foreignObject x="0" y="0" width="100%" height="100%">
        <style type="text/css">
        </style>
        ${serializedSrc}
        </foreignObject>
        </svg>`
    )
}

export const createImgFromSVG = (svgURI: string): Promise<HTMLImageElement> => 
    new Promise((resolve, reject) => {
        const img = document.createElement('img');
        // cors, cross origin allows for images loaded from a foreign object to be used in a canvas.
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (e) => {
            reject(e)
            svgURI = "LOAD_ERROR";
        };
        img.src = svgURI;
    })

