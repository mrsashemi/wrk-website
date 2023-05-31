import { useWindowSize } from "@/hooks/useWindowSize";
import { setType } from "@/state/slices/gramSlice";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

function WizardGram() {
    const [showModal, setShowModal] = useState(false);
    const windowSize = useWindowSize();
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

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

    function addType(e: any) {
        dispatch(setType(e.target.textContent));
    }

    return (
        <React.Fragment>
            <div className="flex flex-col w-screen h-screen xs:text-sm sm:text-base md:text-lg lg:text-2xl" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
                <div className="flex justify-between items-center m-0 border-b-2">
                    <h2 className="px-1 sm:p-2 lg:p-3 xs:text-base sm:text-lg md:text-xl lg:text-3xl">WizardGram</h2>
                    <button className="m-0 px-1 sm:p-2 md:px-3 lg:p-3 lg:px-4 border-l-2" onClick={onShow}>+</button>
                </div>
                <div className="flex justify-between items-center p-5 m-0 border-b-2">
                    <div className="flex flex-col items-center">
                        <h4 className="xs:text-xs sm:text-sm md:text-base lg:text-lg">Profile Holder</h4>
                    </div>
                    <div>
                        <div className="flex justify-end xs:gap-2 sm:gap-4 md:gap-6 lg:gap-12 m-0">
                            <div className="flex flex-col items-center">
                                <h4>0</h4>
                                <h4 className="xs:text-xs sm:text-sm md:text-base lg:text-lg">Photos</h4>
                            </div>
                            <div className="flex flex-col items-center">
                                <h4>0</h4>
                                <h4 className="xs:text-xs sm:text-sm md:text-base lg:text-lg">Artworks</h4>
                            </div>
                            <div className="flex flex-col items-center">
                                <h4>2</h4>
                                <h4 className="xs:text-xs sm:text-sm md:text-base lg:text-lg">Sketches</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center p-1 sm:p-2 m-0">
                    <h3 className="pl-4 self-start">Wizards Robbing Kids</h3>
                    <p className="p-4 xs:text-xs sm:text-sm md:text-base lg:text-lg self-start">This section will contain information for our about page...</p>
                    <button className="w-max h-max border-y-2 w-screen lg:p-2 xs:text-xs sm:text-sm md:text-base lg:text-lg">Edit About Us</button>
                </div>
                <div className="flex justify-evenly p-1 sm:p-2 m-0 border-b-2 xs:text-xs sm:text-sm md:text-base lg:text-lg">
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
                        <button className="w-full h-full p-0 m-0 sm:p-1 md:p-2">artworks</button>
                        <button className="w-full h-full p-0 m-0 sm:p-1 md:p-2 border-x-2">photography</button>
                        <button className="w-full h-full p-0 m-0 sm:p-1 md:p-2">generative</button>
                    </div>
                    <div className="grid">
                    </div>
                </div>
            </div>
            <div className={`xs:text-sm sm:text-base md:text-lg flex flex-col justify-start items-center bg-white w-screen h-5/6 fixed z-50 ${showModal ? 'show' : ''} modal`} ref={modalRef}>
                <div className="w-full flex flex-col items-center border-b-2">
                    <div className="mt-2 sm:mt-3 w-1/4 p-0 rounded-3xl border-2" onClick={onHide}></div>
                    <h3 className="m-0 py-2 sm:py-2.5 md:py-3">Create New Post</h3>
                </div>
                <div className="w-full p-0 cursor-pointer flex flex-col">
                    <Link className="w-full py-2 pl-1 sm:py-3 sm:pl-2 md:py-4 md:pl-3  cursor-pointer text-left" href='/wizardgram/new' onClick={(e) => {return addType(e)}}>Photography</Link>
                    <div className="w-full p-0 cursor-pointer border-b-2 self-end"></div>
                </div>
                <div className="w-full p-0 cursor-pointer flex flex-col">
                    <Link className="w-full py-2 pl-1 sm:py-3 sm:pl-2 md:py-4 md:pl-3  cursor-pointer text-left" href='/wizardgram/new' onClick={(e) => {return addType(e)}}>Artworks</Link>
                    <div className="w-full p-0 cursor-pointer border-b-2 self-end"></div>
                </div>
                <div className="w-full p-0 cursor-pointer flex flex-col">
                    <Link className="w-full py-2 pl-1 sm:py-3 sm:pl-2 md:py-4 md:pl-3  cursor-pointer text-left" href='/wizardgram/new' onClick={(e) => {return addType(e)}}>Generative</Link>
                    <div className="w-full p-0 cursor-pointer border-b-2 self-end"></div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default WizardGram;