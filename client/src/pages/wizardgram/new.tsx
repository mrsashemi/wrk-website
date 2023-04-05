import { useWindowSize } from "@/hooks/useWindowSize";

function NewPost() {
    const windowSize = useWindowSize();

    return (
        <div className="flex flex-col w-screen h-screen" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
            <div className="flex justify-between items-center m-1">
                <button className="postButton">X</button>
                <h2>New Post</h2>
                <button className="postButton">Next</button>
            </div>
            <div className="flex justify-center m-1 h-60 border-2 border-solid">
                <canvas></canvas>
            </div>
            <div className="flex justify-between items-center m-1">
                <button className="usernameHeader">Select</button>
                <input type="file" className="hidden"/>
                <div className="flex gap-5">
                    <button className="postButton">+</button>
                    <button className="settingsButton">o</button>
                </div>
            </div>
            <div className="flex flex-col m-1">
                <div className="grid">
                </div>
            </div>
        </div>
    )
}


export default NewPost;