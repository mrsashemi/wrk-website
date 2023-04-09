import Canvas from "@/components/wizardgram/canvas";
import { useWindowSize } from "@/hooks/useWindowSize";
import { getFilterKeys } from "@/state/slices/gramSlice";
import { useAppSelector } from "@/state/store/types";

function PublishPost() {
    const windowSize = useWindowSize();
    const filter = useAppSelector(getFilterKeys);

    return (
        <div className="flex flex-col w-screen h-screen xs:text-sm sm:text-base md:text-lg lg:text-2xl" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
            <div className="flex justify-between mb-1 items-center border-b-2">
                <button className="px-1 sm:p-2 md:px-3 lg:p-3 lg:px-4 border-r-2">Back</button>
                <h2 className="xs:text-base sm:text-lg md:text-xl lg:text-3xl">Publish Post</h2>
                <button className="px-1 sm:p-2 md:px-3 lg:p-3 lg:px-4 border-l-2">Publish</button>
            </div>
            <div className="flex m-4">
                <input className="border-2 w-full border-solid xs:mx-2 md:mx-4 mt-4" placeholder="Title..."></input>
            </div>
            <div className="flex justify-center max-h-1/4 items-start w-full">
                <Canvas 
                margins={'my-1 ml-4'}
                divWidth={''}
                scale={`xs:w-20 xs:h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 2xl:w-56 2xl:h-56`}
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
                <textarea className="border-y-2 border-r-2 my-4 mr-4 w-3/4 xs:h-20 sm:h-32 md:h-40 lg:h-48 2xl:h-56 border-solid " placeholder="Write description..."></textarea>
            </div>
        </div>
    )
}


export default PublishPost;