import {convertToSVG, rasterizeToP5, updateQueries} from '@/hooks/useRasterize';
import 'jest-canvas-mock';

// The following specifically tests the functions that useRasterize relies on the properly rasterize an HTMLElement into a png Data URL
// useRasterize itself uses a useEffect hook to run a suite of async functions and returns a dispatch to the redux store
describe('useRasterize', () => {
    const initialProps = {
        serializeThisRef: {current: document.createElement('div')},
        stateHoldingRef: {current: document.createElement('div')},
        interaction: false,
        changeReload: false,
        events: []
    }

    it("returns an object containing the correct styles in order to update the queries", async () => {
        global.innerWidth = 500;
        global.innerHeight = 400;

        let pageQueries = await updateQueries();
        expect(pageQueries.orientation).toBe("landscape");

        global.innerWidth = 400;
        global.innerHeight = 500;
        global.dispatchEvent(new Event('resize'));

        pageQueries = await updateQueries();
        expect(pageQueries.orientation).toBe("portrait");

        global.innerWidth = 1024;
        global.innerHeight = 768;
        global.dispatchEvent(new Event('resize'));

        pageQueries = await updateQueries();
        expect(pageQueries.orientation).toBe("landscape");
        expect(pageQueries.homeTitle.fontSize).toBe("4.5rem");
        expect(pageQueries.navContainer.margin).toBe("1.25rem");

        global.innerWidth = 1024;
        global.innerHeight = 500;
        global.dispatchEvent(new Event('resize'));

        pageQueries = await updateQueries();
        expect(pageQueries.orientation).toBe("landscape");
        expect(pageQueries.homeTitle.marginBottom).toBe("3rem");
        expect(pageQueries.homeTitle.marginRight).toBe("1rem");

        global.innerWidth = 500;
        global.innerHeight = 1024;
        global.dispatchEvent(new Event('resize'));

        pageQueries = await updateQueries();
        expect(pageQueries.orientation).toBe("portrait");
        expect(pageQueries.homeTitle.fontSize).toBe("4rem");
        expect(pageQueries.homeTitle.marginRight).toBe("1rem");
        
    })
    
    it("serializes a source HTMLElement into XML and returns a SVG Data URI", () => {
        const svgURL = convertToSVG(initialProps.serializeThisRef.current, 100, 100);
        expect(svgURL).toContain('data:image/svg+xml;')
    })

    it("rastrizes html element into useable base64 PNG DataURI", async () => {
        // Mock the img onload and onerror functions so the promise can resolve properly
        Object.defineProperty(global.Image.prototype, 'src', {
            set(src) {
                if (src === "LOAD_ERROR") {
                    setTimeout(() => this.onerror(new Error('mocked error')));
                    
                } else {
                    setTimeout(() => this.onload());
                }
            }
        })
        
        const result = await rasterizeToP5(initialProps);
        expect(result).toContain('data:image/png;base64')
    });
});