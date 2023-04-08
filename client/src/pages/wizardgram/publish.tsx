import Canvas from "@/components/wizardgram/canvas";
import { useWindowSize } from "@/hooks/useWindowSize";
import { getFilterKeys } from "@/state/slices/gramSlice";
import { useAppSelector } from "@/state/store/types";

function PublishPost() {
    const windowSize = useWindowSize();
    const filter = useAppSelector(getFilterKeys);

    return (
        <div className="flex flex-col w-screen h-screen" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
            <div className="flex justify-between mb-1 items-center border-b-2">
                <button className="px-1 border-r-2">Back</button>
                <h2>Publish Post</h2>
                <button className="px-1 border-l-2">Publish</button>
            </div>
            <div className="flex m-1">
                <input className="border-2 w-full border-solid " placeholder="Title..."></input>
            </div>
            <div className="flex justify-center max-h-1/4 items-start w-full">
                <Canvas 
                margins={'my-1 ml-1'}
                divWidth={''}
                br={filter.br}
                con={filter.con}
                sat={filter.sat}
                red={filter.red}
                green={filter.green}
                blue={filter.blue}
                strength={filter.strength}
                useFilter={filter.useFilter}
                display2D={filter.display2D}
                displayWEBGL={filter.displayWEBGL} />
                <textarea className="border-y-2 border-r-2 my-1 mr-1 w-3/4 h-2/4 border-solid " placeholder="Write description..."></textarea>
            </div>
        </div>
    )
}


export default PublishPost;