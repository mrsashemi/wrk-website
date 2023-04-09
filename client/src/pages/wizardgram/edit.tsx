import Canvas from "@/components/wizardgram/canvas";
import Slider from "@/components/wizardgram/slider";
import { useWindowSize } from "@/hooks/useWindowSize";
import { setFilterKeys } from "@/state/slices/gramSlice";
import { useAppDispatch } from "@/state/store/types";
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
    const dispatch = useAppDispatch();
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
    
    //use sliders to individually modify the uniform values on the webgl canvas
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
        }]
    ])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => {
        const updatedFilters = {...filters, custom: {...filters.custom, [id]: e.target.value}};
        const tempSliders = [...sliders];
        tempSliders[editIndex][index].value =  Number(e.target.value);
        dispatch(setFilterKeys(updatedFilters.custom));
        setFilters(updatedFilters);
        setSliders((tempSliders as SliderTypes[][]));
    }

    //Select whether to use a premade filter or to customize the image on its own
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
        <div className="flex flex-col w-screen h-screen justify-between xs:text-sm sm:text-base md:text-lg lg:text-2xl" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
            <div className="flex justify-between items-center border-b-2 md:mb-2">
                <button className="px-1 sm:p-2 md:px-3 lg:p-3 lg:px-4 border-r-2">Back</button>
                <h2 className="xs:text-base sm:text-lg md:text-xl lg:text-3xl">Edit Post</h2>
                <button className="px-1 border-l-2 sm:p-2 md:px-3 lg:p-3 lg:px-4">Next</button>
            </div>
            <Canvas 
                margins={'m-4'} 
                divWidth={''}
                scale={`xs:w-76 xs:h-76 sm:w-96 sm:h-96 md:w-128 md:h-128 lg:w-136 lg:h-136 2xl:w-144 2xl:h-144`}
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
            <div className={`${editDisplay} flex flex-col justify-center items-center m-4 xs:h-48 md:h-76 gap-5`}>
                {sliders[editIndex].map((item, index) => (
                    <Slider 
                        key={index}
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
                <div className="flex justify-between items-center w-full mt-2 p-0 gap-5 border-y-2 xs:text-base sm:text-lg md:text-xl lg:text-3xl">
                    <button onClick={() => setEditIndex(0)} className="px-2 border-x-2 sm:p-2 md:px-3 lg:p-3 lg:px-4">Levels</button>
                    <button onClick={() => setEditIndex(1)} className="sm:p-2 md:px-3 lg:p-3 lg:px-4">RGB</button>
                    <button onClick={() => setEditIndex(2)} className="px-2 border-x-2 sm:p-2 md:px-3 lg:p-3 lg:px-4">Strength</button>
                </div>
            </div>
            <div className={`${filterDisplay} flex m-4 xs:h-48  md:h-76 overflow-scroll`}>
                    {Object.keys(filters).map((filterKey, index) => (
                        (filterKey !== 'custom') && 
                        <div className={`flex flex-col justify-center items-center h-full`} key={index} onClick={() => {return setCurrentFilter(filterKey)}}>
                            <h5>{filterKey}</h5>
                            <Canvas 
                                margins={'m-2'} 
                                divWidth={'w-24'}
                                scale={`xs:w-20 xs:h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 2xl:w-56 2xl:h-56`}
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
            <div className="flex justify-evenly border-t-2 xs:text-base sm:text-lg md:text-xl lg:text-3xl">
                <button className="py-4 w-1/2  border-r-2" onClick={() => {return beginFilter()}}>Filters</button>
                <button className="py-4 w-1/2" onClick={() => {return beginEdit()}}>Edit</button>
            </div>
        </div>
    )
}


export default EditPost;

