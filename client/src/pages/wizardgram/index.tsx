import { useWindowSize } from "@/hooks/useWindowSize";
import React, { useEffect, useRef, useState } from "react";

function WizardGram() {
    const [showModal, setShowModal] = useState(false);
    const windowSize = useWindowSize();
    const modalRef = useRef<HTMLDivElement>(null);

    function onShow() {
        setShowModal(true);
    }

    function onHide() {
        setShowModal(false);
    }

    // effect to close modal component when clicking outside modal
    useEffect(() => {
        const handleHide = (e: any) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onHide();
            }
        };
        document.addEventListener('click', handleHide, true);
        return () => {
            document.removeEventListener('click', handleHide, true);
        }
    }, [onHide]);
    

    return (
        <React.Fragment>
            <div className="flex flex-col w-screen h-screen" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
                <div className="flex justify-between items-center m-0 border-b-2">
                    <h2 className="px-1">WizardGram</h2>
                    <button className="m-0 px-1 border-l-2" onClick={onShow}>+</button>
                </div>
                <div className="flex justify-evenly p-1 m-0 border-b-2">
                    <div className="flex flex-col items-center">
                        <h4>0</h4>
                        <h4>Photos</h4>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4>0</h4>
                        <h4>Artworks</h4>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4>2</h4>
                        <h4>Sketches</h4>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center p-1 m-0">
                    <h3 className="descriptionHeader">Wizards Robbing Kids</h3>
                    <p className="instaDescription">This section will contain information for our about page...</p>
                    <button className="w-max h-max border-y-2 w-screen">Edit About Us</button>
                </div>
                <div className="flex justify-evenly p-1 m-0 border-b-2">
                    <div className="flex flex-col">
                        <img className="instaHighlightPic"></img>
                        <h4>Profiles</h4>
                    </div>
                    <div className="flex flex-col">
                        <img className="newHighlight"></img>
                        <h4>New Profile</h4>
                    </div>
                </div>
                <div className="flex flex-col m-0">
                    <div className="flex justify-evenly border-b-2 p-0 w-screen">
                        <button className="w-full h-full p-0 m-0">artworks</button>
                        <button className="w-full h-full p-0 m-0 border-x-2">photography</button>
                        <button className="w-full h-full p-0 m-0">generative</button>
                    </div>
                    <div className="grid">
                    </div>
                </div>
            </div>
            <div className={`flex flex-col justify-start items-center bg-white w-screen h-5/6 fixed z-50 ${showModal ? 'show' : ''} modal`} ref={modalRef}>
                <div className="w-full flex flex-col items-center border-b-2">
                    <div className="mt-2 w-1/4 p-0 rounded-3xl border-2" onClick={onHide}></div>
                    <h3 className="m-0 py-2">Create New Post</h3>
                </div>
                <div className="w-full p-0 cursor-pointer flex flex-col">
                    <button className="w-full py-2 pl-1 cursor-pointer text-left">Photography</button>
                    <div className="w-full p-0 cursor-pointer border-b-2 self-end"></div>
                </div>
                <div className="w-full p-0 cursor-pointer flex flex-col">
                    <button className="w-full py-2 pl-1 cursor-pointer text-left">Artworks</button>
                    <div className="w-full p-0 cursor-pointer border-b-2 self-end"></div>
                </div>
                <div className="w-full p-0 cursor-pointer flex flex-col">
                    <button className="w-full py-2 pl-1 cursor-pointer text-left">Generative</button>
                    <div className="w-full p-0 cursor-pointer border-b-2 self-end"></div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default WizardGram;