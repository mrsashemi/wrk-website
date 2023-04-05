import { useWindowSize } from "@/hooks/useWindowSize";

function PublishPost() {
    const windowSize = useWindowSize();

    return (
        <div className="flex flex-col w-screen h-screen" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
            <div className="flex justify-between items-center m-1">
                <button className="postButton">Back</button>
                <h2>Publish Post</h2>
                <button className="postButton">Publish</button>
            </div>
            <div className="flex m-1">
                <div className="flex w-full">
                    <div className="flex justify-center w-1/3 h-20 border-2 border-solid">
                        <canvas></canvas>
                    </div>
                    <textarea className="border-y-2 border-r-2 w-full border-solid " placeholder="Write description..."></textarea>
                </div>
            </div>
            <div className="flex m-1">
                <input className="border-2 w-full border-solid " placeholder="Title..."></input>
            </div>
        </div>
    )
}


export default PublishPost;