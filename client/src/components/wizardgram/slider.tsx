interface SliderProps {
    id: string;
    color: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    index: number;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => void;
}

function Slider(props: SliderProps) {

    return (
        <div className="flex flex-col justify-center w-full items-center h-full">
            <div className="flex flex-col w-full justify-center items-center relative">
                <div className={`w-full flex justify-between items-center absolute z-0 top-0 text-xs rounded-lg w-full text-center ${props.color} text-white border-2`}>
                    <label htmlFor={props.id} className="mx-1">{props.label}</label>
                    <label htmlFor={props.id} className="mx-1">{props.value}</label>
                </div>
                <input id={props.id} type="range" min={props.min} max={props.max} step={props.step} value={props.value} onChange={(e) => {return props.handleChange(e, props.index, props.id)}}
                    className="absolute inset-0 z-20 w-full h-4 appearance-none bg-transparent rounded-lg"></input>
            </div>
        </div>
    )
}

export default Slider;