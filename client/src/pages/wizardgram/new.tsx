import Canvas from "@/components/wizardgram/canvas";
import { useWindowSize } from "@/hooks/useWindowSize";

function NewPost() {
    const windowSize = useWindowSize();

    return (
        <div className="flex flex-col w-screen h-screen" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
            <div className="flex justify-between items-center border-b-2">
                <button className="px-1 border-r-2">X</button>
                <h2>New Post</h2>
                <button className="px-1 border-l-2">Next</button>
            </div>
            <Canvas 
                margins={'m-1'}
                divWidth={''}
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
                <button className="px-1 border-r-2">Select File</button>
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