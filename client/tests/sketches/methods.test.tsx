import 'jest-canvas-mock';
import { compile, create2Dbuffer, createGLbuffer, prepareShader } from '@/sketches/methods/createbuffer';

// unit testing individual effects on a canvas isn't very intuitive so the effects like drawImage, compiling shaders, and others will be done with E2E testing
// so far, the imported sketches have been heavily prototyped and worked on in p5js/VanillaJS, and they seem to work well as far as effects are concerned
// testing here will be for properly creating buffers
describe('creating 2Dcanvas buffer', () => {
    let canvas: HTMLCanvasElement;
    let ctx: RenderingContext | null;

    beforeEach(() => {
        canvas = document.createElement('canvas');
        jest.spyOn(canvas, 'getContext').mockImplementation(() => {
            return {} as RenderingContext;
        });
    });
  
    afterEach(() => {
        jest.restoreAllMocks();
    });
  
    it('should create a 2D canvas context with the correct options', () => {
        ctx = create2Dbuffer(ctx, canvas, 100, 200, false, null);
        expect(canvas.getContext).toHaveBeenCalledWith('2d', {
            willReadFrequently: true,
            alpha: true
        });
        expect(ctx).toBeDefined();
    });
  
    it('should set the canvas width and height', () => {
        create2Dbuffer(ctx, canvas, 100, 200, false, null);
        expect(canvas.width).toBe(100);
        expect(canvas.height).toBe(200);
    });
  
  
    it('should return the created context', () => {
        ctx = create2Dbuffer(ctx, canvas, 100, 200, false, null);
        expect(ctx).toBeDefined();
    });
    
});
  
describe('createGLbuffer', () => {
    it('should create a WebGL context on the canvas', () => {
        const canvas = document.createElement('canvas');
        const gl = createGLbuffer(null, canvas, 800, 600);

        expect(gl).not.toBeNull();
        expect(canvas.width).toBe(800);
        expect(canvas.height).toBe(600);
    });
});