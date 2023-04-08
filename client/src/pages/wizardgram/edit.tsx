import Canvas from "@/components/wizardgram/canvas";
import Slider from "@/components/wizardgram/slider";
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

interface SliderTypes {
    id: string;
    color: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
}




function EditPost() {
    const windowSize = useWindowSize();
    const [currentFilter, setCurrentFilter] = useState<string>('none');
    const [editDisplay, setEditDisplay] = useState<string>('hidden');
    const [filterDisplay, setFilterDisplay] = useState<string>('block');
    const [editIndex, setEditIndex] = useState<number>(0);


    //object filters holds information as to which canvas will be shown
    //also holds uniform values that will be passed to the fragment shader in the webgl canvas
    const [filters, setFilters] = useState<{[key: string]: FilterKeys}>({
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
    })

    const [sliders, setSliders] = useState<SliderTypes[][]>([
        [{
            id: "br",
            color: "bg-neutral-400",
            label: "brightness",
            value: 1.0,
            min: 0.0,
            max: 5.0,
            step: 0.1
        },
        {
            id: "con",
            color: "bg-neutral-400",
            label: "contrast",
            value: 1.0,
            min: 0.0,
            max: 5.0,
            step: 0.1
        },
        {
            id: "sat",
            color: "bg-neutral-400",
            label: "saturation",
            value: 1.0,
            min: 0.0,
            max: 5.0,
            step: 0.1
        }],
        [{
            id: "red",
            color: "bg-red-600",
            label: "red",
            value: 1.0,
            min: 0.0,
            max: 5.0,
            step: 0.1
        },
        {
            id: "green",
            color: "bg-green-600",
            label: "green",
            value: 1.0,
            min: 0.0,
            max: 5.0,
            step: 0.1
        },
        {
            id: "blue",
            color: "bg-blue-600",
            label: "blue",
            value: 1.0,
            min: 0.0,
            max: 5.0,
            step: 0.1
        }],
        [{
            id: "strength",
            color: "bg-neutral-400",
            label: "strength",
            value: 0.8,
            min: 0.0,
            max: 1.0,
            step: 0.1
        }],

    ])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => {
        const updatedFilters = {...filters, custom: {...filters.custom, [id]: e.target.value}};
        const tempSliders = [...sliders];
        tempSliders[editIndex][index].value =  Number(e.target.value);

        setFilters(updatedFilters);
        setSliders((tempSliders as SliderTypes[][]));
    }

    const beginEdit = () => {
        setEditDisplay('block');
        setFilterDisplay('hidden')
        setCurrentFilter('custom');
    }

    const beginFilter = () => {
        setEditDisplay('hidden');
        setFilterDisplay('block');
        setCurrentFilter('none');
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
                <div className={`${editDisplay} flex flex-col justify-center items-center m-2 h-1/3 gap-5`}>
                    {sliders[editIndex].map((item, index) => (
                        <Slider 
                            id={item.id} 
                            color={item.color} 
                            label={item.label} 
                            value={item.value}
                            min={item.min} 
                            max={item.max} 
                            step={item.step} 
                            index={index} 
                            handleChange={handleChange} />
                    ))}
                    <div className="flex justify-center items-center gap-5">
                        <button onClick={() => setEditIndex(0)}>Levels</button>
                        <button onClick={() => setEditIndex(1)}>RGB</button>
                        <button onClick={() => setEditIndex(2)}>Strength</button>
                    </div>
                </div>
                <div className={`${filterDisplay} flex m-1 h-1/3 grow overflow-scroll`}>
                        {Object.keys(filters).map((filterKey, index) => (
                            (filterKey !== 'custom') && 
                            <div className={`flex flex-col justify-center items-center h-full`} key={index} onClick={() => {return setCurrentFilter(filterKey)}}>
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
            </React.Fragment>
            <div className="flex justify-evenly m-5">
                <button className="editButton" onClick={() => {return beginFilter()}}>Filters</button>
                <button className="editButton" onClick={() => {return beginEdit()}}>Edit</button>
            </div>
        </div>
    )
}


export default EditPost;

