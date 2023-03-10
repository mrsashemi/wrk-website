import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import React, { SyntheticEvent } from 'react'

// Use refs to create two copies of the UI, one transparent and one hidden that will be sent to WEBGL during the rasterization step.
/*const Source = React.forwardRef(({}, ref) => (
  <>
    <SourceInput ref={inputRef} />
    <SourceInput ref={sourceRef} />
  </>
))*/

interface Props {
    serializeThisRef: React.RefObject<HTMLElement>;
    stateHoldingRef: React.RefObject<HTMLElement>;
    imgTextureRef: React.MutableRefObject<Record<string, string>>;
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
    React.useEffect(() => {
        rasterizeToP5(props);
        let refreshImg;
        let mouseUpHandler;
    }, []);
}

const rasterizeToP5 = async (props: Props) => {
    const result = await rasterizeDomNode(props.serializeThisRef.current!);
    if (!result) return;
    const {DOMImage, size} = result;
    return props.imgTextureRef.current = {DOMImage};
}

const rasterizeDomNode = async (srcElement: HTMLElement) => {
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

    return {
        DOMImage: png,
        size: {
            x: width,
            y: height
        }
    }

}

// this function serializes the source node and turns it into an SVG Data URI
const convertToSVG = (src: HTMLElement, w: number, h: number) => {
    src.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    const serializedSrc = new XMLSerializer().serializeToString(src);

    // we need to escape characters that are not markup text to ensure the src node is properly converted to an SVG
    const escapedSrc = serializedSrc//.replace(/#/g, '%23').replace(/\n/g, '%0A');

    return (
        `data:image/svg+xml;charset=utf-8,
        <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
        <foreignObject x="0" y="0" width="100%" height="100%">
        <style type="text/css">
        </style>
        ${escapedSrc}
        </foreignObject>
        </svg>`
    )
}

interface Window {
    Image: {
        prototype: HTMLImageElement;
        new (): HTMLImageElement;
    };
}

const createImgFromSVG = (svgURI: string): Promise<HTMLImageElement> => 
    new Promise((resolve, reject) => {
        const img = new window.Image();
        // cors, cross origin allows for images loaded from a foreign object to be used in a canvas.
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = svgURI;
    })

