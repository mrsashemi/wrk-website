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
            <div className="flex justify-center m-1 h-60 border-2 border-solid">
                <canvas></canvas>
            </div>
            <div className="flex m-5">
                <div className="flex flex-col justify-center items-center w-1/3">
                    <h5>Filter</h5>
                    <div className="flex justify-center w-full h-20 border-2 border-solid">
                        <canvas></canvas>
                    </div>
                </div>
            </div>
            <div className="flex justify-evenly m-10">
                <button className="editButton">Filters</button>
                <button className="editButton">Edit</button>
            </div>
        </div>
    )
}


export default EditPost;