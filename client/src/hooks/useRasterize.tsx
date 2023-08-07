// This custom hook is a technique based on the following article about creating an accessible canvas via rasterization of the DOM, https://annekagoss.medium.com/accessible-webgl-43d15f9caa21
// The implementation of the hook is adapted for my specific use case 

import React from 'react'
import { useDispatch, useSelector} from 'react-redux';
import { setDomImage } from '@/state/slices/canvasSlice';
import { getSetting, setCurrentSettings, setPageOrientation } from "@/state/slices/pageSlice";

interface Props {
    serializeThisRef: React.RefObject<HTMLElement>;
    stateHoldingRef: React.RefObject<HTMLElement>;
    events: any[];
}

interface newSetting {
    query: number,
    orientation: string
}

export const useRasterize = (props: Props): void => {
    const currSetting = useSelector(getSetting);
    const dispatch = useDispatch();

    // since the state only gets updated between renders, use a temporary object to reflect resize changes on a current render frame
    const tempSetting = {...currSetting}

    // check media queries, return true if the current orientation is the same on page resize
    const isMatch = async () => {
        let match = false;
        let setting = await findOrientation();
        if (setting.orientation === tempSetting.orientation && setting.query === tempSetting.query) match = true;
        else if (!match) await updateOrientation(setting);

        return match;
    }

    // update the media queries if the current orientation is not the same
    const updateOrientation = async (newSetting: newSetting) => {
        tempSetting.query = newSetting.query;
        tempSetting.orientation = newSetting.orientation;
        return dispatch(setCurrentSettings(newSetting));
    }

    // update the current styles to reflect the media queries prior to dom rasterization
    const createStyles = async (match: boolean) => {
        if (match) console.log("match", tempSetting)
        if (!match) { 
            console.log("update", tempSetting)
            const queries = await updateQueries();
            return dispatch(setPageOrientation(queries));
        }
    }

    const loadRasterizedDom = async () => {
        const match = await isMatch();
        await createStyles(match);
        const DOMImage = await rasterizeToP5(props);
        return dispatch(setDomImage(DOMImage));
    }
    
    React.useEffect(() => {
        loadRasterizedDom();
        window.addEventListener('load', () => loadRasterizedDom());
        window.addEventListener('resize', () => loadRasterizedDom());

        return () => {
            window.removeEventListener('load', () => loadRasterizedDom());
            window.removeEventListener('resize', () => loadRasterizedDom());
        }
    }, []);

    React.useEffect(() => {
        loadRasterizedDom();
    }, props.events);
}

const findOrientation = async () => {
    let newOrientation = (window.innerHeight > window.innerWidth) ? 'height' : 'width';
    let newQuery = 640;

    if (window.matchMedia(`(max-${newOrientation}: 640px)`).matches) newQuery = 640;
    else if (window.matchMedia(`(max-${newOrientation}: 768px)`).matches) newQuery = 768;
    else if (window.matchMedia(`(max-${newOrientation}: 1024px)`).matches) newQuery = 1024;
    else if (window.matchMedia(`(max-${newOrientation}: 1536px)`).matches) newQuery = 1536;
    else if (window.matchMedia(`(max-${newOrientation}: 2500px)`).matches) newQuery = 2500;

    return {query: newQuery, orientation: newOrientation};
}

interface NavContainer {
    margin: string,
    gap: string
}

interface NavLinks {
    fontSize: string,
    lineHeight: string
}

interface HomeTitle {
    fontSize: string,
    lineHeight: string,
    marginRight: string,
    marginBottom: string
}

interface Style {
    orientation: string,
    navContainer: NavContainer,
    navLinks: NavLinks,
    homeTitle: HomeTitle
}

// there are likely better ways to write this function that avoids too many if/then statetements but at the moment im unsure what the final requirements will be
export const updateQueries = async () => {
    let maxSize: number; 
    let portrait;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let skinny = 1; 

    const style: Style = {
        orientation: "",
        navContainer: {
            margin: "",
            gap: ""
        },
        navLinks: {
            fontSize: "",
            lineHeight: ""
        },
        homeTitle: {
            fontSize: "",
            lineHeight: "",
            marginRight: "",
            marginBottom: ""
        }
    }

    if (height > width) {
        portrait = true;
        maxSize = height;
        style.orientation = "portrait";
        if ((width*1.6) < height) skinny = 2;
    } else {
        portrait = false
        maxSize = width;
        style.orientation = "landscape";
        if ((height*1.6) < width) skinny = 2;
    }

    if (maxSize <= 640) {
        console.log("xs", style.orientation)
        style.navContainer = {
            margin: (portrait) ? "1rem" : "0.75rem", 
            gap: (portrait) ? "0" : "1rem"
        };
        style.navLinks = {
            fontSize: (portrait) ? "1.25rem" : "1rem", 
            lineHeight: (portrait) ? "1.75rem" : "1.5rem"
        };
        style.homeTitle = {
            fontSize: (portrait) ? "4.5rem" : "2rem", 
            lineHeight: (portrait) ? "1" : "2.5rem", 
            marginRight: (portrait) ? "0.5rem" : "1rem",
            marginBottom: (portrait) ? "0" : "6rem"
        };
    } else if (maxSize <= 768) {
        console.log("s", style.orientation)
        style.navContainer = {
            margin: (portrait) ? "1.25rem" : "1rem", 
            gap: (portrait) ? "0.25rem" : "1.125rem"
        };
        style.navLinks = {
            fontSize: (portrait) ? "1.5rem" : "1.125rem", 
            lineHeight: (portrait) ? "2rem" : "1.75rem"
        };
        style.homeTitle = {
            fontSize: (portrait) ? `${7/skinny}rem` : "3.75rem", 
            lineHeight: "1", 
            marginRight: (portrait || (!portrait && skinny === 2)) ? "1rem" : "1.5rem", 
            marginBottom: (portrait) ? "0" : (skinny === 2) ? "2rem" : "11rem"
        };
    } else if (maxSize <= 1024) {
        console.log("m", style.orientation)
        style.navContainer = {
            margin: "1.25rem", 
            gap: (portrait) ? "0.5rem" : "1.5rem"
        };
        style.navLinks = {
            fontSize: (portrait) ? "1.875rem" : "1.5rem", 
            lineHeight: (portrait) ? "2.25rem" : "2rem"
        };
        style.homeTitle = {
            fontSize: (portrait) ? `${8/skinny}rem` : "4.5rem", 
            lineHeight: "1", 
            marginRight: (portrait || (!portrait && skinny === 2)) ? "1rem" : "1.5rem", 
            marginBottom: (portrait) ? "0" : (skinny === 2) ? "3rem" : "11rem"
        };
    } else if (maxSize <= 1536) {
        console.log("l", style.orientation)
        style.navContainer = {
            margin: "1.5rem", 
            gap: (portrait) ? "0.75rem" : "1.75rem"
        };
        style.navLinks = {
            fontSize:  "2.25rem", 
            lineHeight: "2.5rem"
        };
        style.homeTitle = {
            fontSize: (portrait) ? `10rem` : "6rem", 
            lineHeight: "1", 
            marginRight: (portrait) ? "1.5rem" : "1.75rem", 
            marginBottom: (portrait) ? "0" : "14rem"
        };
    } else if (maxSize <= 2500) {
        console.log("xl", style.orientation)
        style.navContainer = {
            margin: "1.5rem", 
            gap: (portrait) ? "0.75rem" : "1.75rem"
        };
        style.navLinks = {
            fontSize:  "2.25rem", 
            lineHeight: "2.5rem"
        };
        style.homeTitle = {
            fontSize: (portrait) ? `10rem` : "7rem", 
            lineHeight: "1", 
            marginRight: (portrait) ? "1.5rem" : "1.75rem", 
            marginBottom: (portrait) ? "0" : "16rem"
        };
    } else {
        console.log("xxl", style.orientation)
        style.navContainer = {
            margin: (portrait) ? "1.5rem" : "2.5rem", 
            gap: (portrait) ? "0.75rem" : "2.875rem"
        };
        style.navLinks = {
            fontSize: (portrait) ? "2.25rem" : "3.75rem", 
            lineHeight: (portrait) ? "2.5rem" : "1"
        };
        style.homeTitle = {
            fontSize: "10rem", 
            lineHeight: "1", 
            marginRight: (portrait) ? "1.5rem" : "1.75rem", 
            marginBottom: (portrait) ? "0" : "16rem"
        };
    }

    return style;
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
    canvas.width = width*1.5;
    canvas.height = height*1.5;

    const context = canvas.getContext('2d');
    context?.drawImage(img, 0, 0, canvas.width, canvas.height);
    const png = canvas.toDataURL();

    return png;
}

// this function serializes the source element and turns it into an SVG 
export const convertToSVG = (source: HTMLElement, w: number, h: number) => {
    const serializedSrc = new XMLSerializer().serializeToString(source);

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

// load the newly created svg into an image element
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

