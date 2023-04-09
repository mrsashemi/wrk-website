import Canvas from "@/components/wizardgram/canvas";
import { useWindowSize } from "@/hooks/useWindowSize";

function NewPost() {
    const windowSize = useWindowSize();

    return (
        <div className="flex flex-col w-screen h-screen xs:text-sm sm:text-base md:text-lg lg:text-2xl" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
            <div className="flex justify-between items-center border-b-2">
                <button className="px-1 sm:p-2 md:px-3 lg:p-3 lg:px-4 border-r-2">X</button>
                <h2 className="xs:text-base sm:text-lg md:text-xl lg:text-3xl">New Post</h2>
                <button className="px-1 border-l-2 sm:p-2 md:px-3 lg:p-3 lg:px-4">Next</button>
            </div>
            <Canvas 
                margins={'m-2'}
                divWidth={''} 
                scale={`xs:w-76 xs:h-76 sm:w-96 sm:h-96 md:w-128 md:h-128 lg:w-136 lg:h-136 2xl:w-144 2xl:h-144`}
                br={1.0}
                con={1.0}
                sat={1.0}
                red={1.0}
                green={1.0}
                blue={1.0}
                strength={1.0}
                useFilter={false}
                display2D={"block"}
                displayWEBGL={"hidden"}  />
            <div className="flex justify-between items-center border-y-2">
                <button className="px-1 border-r-2 sm:p-2 md:px-3 lg:p-3 lg:px-4 xs:text-base sm:text-lg md:text-xl lg:text-3xl">Select File</button>
                <input type="file" className="hidden"/>
            </div>
            <div className="flex flex-col m-1">
                <div className="grid">
                </div>
            </div>
        </div>
    )
}


export default NewPost;