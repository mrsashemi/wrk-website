import { useWindowSize } from "@/hooks/useWindowSize";

function WizardGram() {
    const windowSize = useWindowSize();

    return (
        <div className="flex flex-col w-screen h-screen" style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}>
            <div className="flex justify-between items-center m-1">
                <h2>WizardGram</h2>
                <button className="postButton">+</button>
            </div>
            <div className="flex justify-evenly m-1">
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
            <div className="flex flex-col justify-center items-center m-1">
                <h3 className="descriptionHeader">Wizards Robbing Kids</h3>
                <p className="instaDescription">This section will contain information for our about page...</p>
                <button className="w-max h-max">Edit About Us</button>
            </div>
            <div className="flex justify-evenly m-1">
                <div className="flex flex-col">
                    <img className="instaHighlightPic"></img>
                    <h4>Profiles</h4>
                </div>
                <div className="flex flex-col">
                    <img className="newHighlight"></img>
                    <h4>New Profile</h4>
                </div>
            </div>
            <div className="flex flex-col m-1">
                <div className="flex justify-evenly">
                    <button>artworks</button>
                    <button>photography</button>
                    <button>generative</button>
                </div>
                <div className="grid">
                </div>
            </div>
        </div>
    )
}

export default WizardGram;