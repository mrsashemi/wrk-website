import Canvas from "@/components/wizardgram/canvas";
import { useWindowSize } from "@/hooks/useWindowSize";

function EditPost() {
    const windowSize = useWindowSize();

    return (
        <div className="flex flex-col w-screen h-screen justify-between" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
            <div className="flex justify-between items-center m-1">
                <button className="postButton">Back</button>
                <h2>Edit Post</h2>
                <button className="postButton">Next</button>
            </div>
            <Canvas margins={'m-1'} />
            <div className="flex m-1 h-1/3">
                <div className="flex flex-col justify-center items-center h-full">
                    <h5>Filter</h5>
                    <Canvas margins={'m-1'} />
                </div>
            </div>
            <div className="flex justify-evenly m-5">
                <button className="editButton">Filters</button>
                <button className="editButton">Edit</button>
            </div>
        </div>
    )
}


export default EditPost;