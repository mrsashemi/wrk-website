import Canvas from "@/components/wizardgram/canvas";
import { useWindowSize } from "@/hooks/useWindowSize";
import React, { useState } from "react";

interface FilterKeys {
    br: number;
    con: number;
    sat: number;
    red: number;
    green: number;
    blue: number;
    strength: number;
    useFilter: boolean;
    display2D: string;
    displayWEBGL: string;
}

function EditPost() {
    const windowSize = useWindowSize();
    const [currentFilter, setCurrentFilter] = useState('none');
    const [edit, setEditing] = useState(true);

    //object filters holds information as to which canvas will be shown
    //also holds uniform values that will be passed to the fragment shader in the webgl canvas
    const filters: {[key: string]: FilterKeys} = {
        none: {
            br: 1.0,
            con: 1.0,
            sat: 1.0, 
            red: 1.0,
            green: 1.0,
            blue: 1.0,
            strength: 1.0,
            useFilter: false,
            display2D: "block",
            displayWEBGL: "hidden"
        },
        sepia: {
            br: 1.0,
            con: 1.0,
            sat: 1.0, 
            red: 1.07,
            green: 0.74,
            blue: 0.43,
            strength: 0.8,
            useFilter: true,
            display2D: "hidden",
            displayWEBGL: "block"
        },
        amaro: {
            br: 1.2,
            con: 1.1,
            sat: 1.2, 
            red: 1.0,
            green: 1.03,
            blue: 1.0,
            strength: 0.8,
            useFilter: true,
            display2D: "hidden",
            displayWEBGL: "block"
        },
        earlybird: {
            br: 1.2,
            con: 1.1,
            sat: 1.2, 
            red: 1.1,
            green: 1.0,
            blue: 0.9,
            strength: 0.8,
            useFilter: true,
            display2D: "hidden",
            displayWEBGL: "block"
        },
        hefe: {
            br: 1.3,
            con: 1.0,
            sat: 1.3, 
            red: 1.15,
            green: 1.0,
            blue: 0.8,
            strength: 0.8,
            useFilter: true,
            display2D: "hidden",
            displayWEBGL: "block"
        },
        hudson: {
            br: 1.0,
            con: 1.0,
            sat: 0.9, 
            red: 1.0,
            green: 1.0,
            blue: 1.0,
            strength: 0.8,
            useFilter: true,
            display2D: "hidden",
            displayWEBGL: "block"
        },
        mayfair: {
            br: 1.1,
            con: 1.1,
            sat: 1.3, 
            red: 1.0,
            green: 1.0,
            blue: 1.0,
            strength: 0.8,
            useFilter: true,
            display2D: "hidden",
            displayWEBGL: "block"
        },
        rise: {
            br: 1.2,
            con: 1.0,
            sat: 0.9, 
            red: 1.1,
            green: 1.0,
            blue: 0.9,
            strength: 0.8,
            useFilter: true,
            display2D: "hidden",
            displayWEBGL: "block"
        },
        toaster: {
            br: 1.2,
            con: 1.1,
            sat: 1.2, 
            red: 1.0,
            green: 1.03,
            blue: 1.0,
            strength: 0.8,
            useFilter: true,
            display2D: "hidden",
            displayWEBGL: "block"
        },
        xpro: {
            br: 1.2,
            con: 1.2,
            sat: 1.3, 
            red: 1.0,
            green: 1.0,
            blue: 1.0,
            strength: 0.8,
            useFilter: true,
            display2D: "hidden",
            displayWEBGL: "block"
        },
        fashion: {
            br: 1.0,
            con: 1.9,
            sat: 0.1, 
            red: 1.0,
            green: 1.0,
            blue: 1.0,
            strength: 0.8,
            useFilter: true,
            display2D: "hidden",
            displayWEBGL: "block"
        },
        custom: {
            br: 1.0,
            con: 1.0,
            sat: 1.0, 
            red: 1.0,
            green: 1.0,
            blue: 1.0,
            strength: 0.8,
            useFilter: true,
            display2D: "hidden",
            displayWEBGL: "block"
        },
    }



    return (
        <div className="flex flex-col w-screen h-screen justify-between" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
            <div className="flex justify-between items-center m-1">
                <button className="postButton">Back</button>
                <h2>Edit Post</h2>
                <button className="postButton">Next</button>
            </div>
            <Canvas 
                margins={'m-1'} 
                divWidth={''}
                br={filters[currentFilter].br}
                con={filters[currentFilter].con}
                sat={filters[currentFilter].sat}
                red={filters[currentFilter].red}
                green={filters[currentFilter].green}
                blue={filters[currentFilter].blue}
                strength={filters[currentFilter].strength}
                useFilter={filters[currentFilter].useFilter}
                display2D={filters[currentFilter].display2D}
                displayWEBGL={filters[currentFilter].displayWEBGL} />
            <React.Fragment>
                {edit ? (
                    <div className="flex m-1 h-1/3 gap-5">
                        <div className="flex flex-col justify-center w-full items-center h-full">
                            <h5>levels</h5>
                            <div className="flex flex-col w-full justify-center items-center relative">
                                <label htmlFor="br-range" className="absolute z-0 top-0 text-xs">brightness</label>
                                <input id="br-range" type="range" min="0.0" max="5.0" step="0.05"
                                    className="absolute inset-0 z-10 w-full h-4 appearance-none bg-transparent border-2 rounded-lg cursor-pointer"></input>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center w-full items-center h-full">
                            <h5>rgb</h5>
                            <div>
                                <label htmlFor="br-range">red</label>
                                <input id="br-range" type="range" min="0.0" max="5.0" step="0.05" value="1.0" 
                                    className="w-full h-2 rounded-lg cursor-pointer"></input>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center w-full items-center h-full">
                            <h5>strength</h5>
                            <div>
                                <label htmlFor="br-range">red</label>
                                <input id="br-range" type="range" min="0.0" max="5.0" step="0.05" value="1.0" 
                                    className="w-full h-2 rounded-lg cursor-pointer"></input>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex m-1 h-1/3 grow overflow-scroll">
                        {Object.keys(filters).map((filterKey, index) => (
                            (filterKey !== 'custom') && 
                            <div className="flex flex-col justify-center items-center h-full" key={index} onClick={() => {return setCurrentFilter(filterKey)}}>
                                <h5>{filterKey}</h5>
                                <Canvas 
                                    margins={'m-1'} 
                                    divWidth={'w-24'}
                                    br={filters[filterKey].br}
                                    con={filters[filterKey].con}
                                    sat={filters[filterKey].sat}
                                    red={filters[filterKey].red}
                                    green={filters[filterKey].green}
                                    blue={filters[filterKey].blue}
                                    strength={filters[filterKey].strength}
                                    useFilter={filters[filterKey].useFilter}
                                    display2D={filters[filterKey].display2D}
                                    displayWEBGL={filters[filterKey].displayWEBGL} />
                            </div>
                        ))}
                    </div>
                )}
            </React.Fragment>
            <div className="flex justify-evenly m-5">
                <button className="editButton">Filters</button>
                <button className="editButton">Edit</button>
            </div>
        </div>
    )
}


export default EditPost;

