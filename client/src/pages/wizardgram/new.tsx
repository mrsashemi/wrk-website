import Canvas from "@/components/wizardgram/canvas";
import { useWindowSize } from "@/hooks/useWindowSize";
import { setCanvasImg } from "@/state/slices/gramSlice";
import { useReadAllMediaQuery, useSaveMediaMutation } from "@/state/slices/mediaSlice";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";


function NewPost() {
    const windowSize = useWindowSize();
    const hiddenFileInput = useRef(null);
    const [addMedia] = useSaveMediaMutation();
    const allMedia = useReadAllMediaQuery('originals');
    const dispatch = useDispatch();

    const [gridReady, setGridReady] = useState<boolean>(false)

    const handleClick = (e: any) => {
        (hiddenFileInput.current as any).click();
    }

    const handleChange = (e: any) => {  
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        const createImg = async () => {
            try {
                const result = await addMedia(formData);
                if (result) {
                    console.log(result);
                }
            } catch (error) {
                console.log(error);
            }
        }

        createImg();
    }

    useEffect(() => {
        if (allMedia.isSuccess) {
            let temp = allMedia.currentData.slice();
            temp.sort((a: any, b: any) => {return Date.parse(b.date) - Date.parse(a.date)});
            allMedia.currentData = temp;

            setGridReady(true);
            dispatch(setCanvasImg(allMedia.currentData[0].resolutions.res_1536.key))
        }
        console.log(allMedia)
    }, [allMedia])

    return (
        <div className="flex flex-col w-screen h-screen xs:text-sm sm:text-base md:text-lg lg:text-2xl" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
            <div className="flex justify-between items-center border-b-2">
                <button className="px-1 sm:p-2 md:px-3 lg:p-3 lg:px-4 border-r-2">X</button>
                <h2 className="xs:text-base sm:text-lg md:text-xl lg:text-3xl">New Post</h2>
                <button className="px-1 border-l-2 sm:p-2 md:px-3 lg:p-3 lg:px-4">Next</button>
            </div>
            {gridReady && <Canvas 
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
                displayWEBGL={"hidden"}  />}
            <div className="flex justify-between items-center border-y-2">
                <button onClick={handleClick} className="px-1 border-r-2 sm:p-2 md:px-3 lg:p-3 lg:px-4 xs:text-base sm:text-lg md:text-xl lg:text-3xl">Select File</button>
                <input type="file" ref={hiddenFileInput} onChange={handleChange} className="hidden"/>
            </div>
            <div className="flex flex-col m-2">
                <div className="flex flex-wrap gap-2">
                    {gridReady && allMedia.currentData.map((img: any) =>
                        <div key={img._id}>
                            <Image 
                                src={`http://localhost:5050/img/image/${img.resolutions.res_320.key}`} 
                                width={320} 
                                height={320} 
                                alt={img.name} 
                                onClick={() => {return dispatch(setCanvasImg(img.resolutions.res_1536.key))}} 
                                priority/>
                        </div>
                    
                    )}
                </div>
            </div>
        </div>
    )
}


export default NewPost;