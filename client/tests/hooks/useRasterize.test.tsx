import { renderHook, render } from '@testing-library/react';
import { rasterizeToP5, useRasterize } from '@/hooks/useRasterize';
import React, { useEffect } from 'react';
import { HomeNavShader } from '@/pages/index';
import { Provider, useDispatch, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import { setDomImage, getDomImage } from '@/state/slices/canvasSlice';
import { act } from 'react-dom/test-utils';



describe('useRasterize', () => {
    const initialProps = {
        serializeThisRef: {current: document.createElement('div')},
        stateHoldingRef: {current: document.createElement('div')},
        interaction: false,
        changeReload: false,
        events: []
    }

    it("rastrizes html element into useable base64 PNG DataURI", async () => {
        const result = await rasterizeToP5(initialProps);
        console.log(result);

        //expect(rasterizeToP5).toReturn(String);
    });
});