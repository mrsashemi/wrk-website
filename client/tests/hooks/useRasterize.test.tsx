import { renderHook, render } from '@testing-library/react';
import { useRasterize } from '@/hooks/useRasterize';
import React, { Component } from 'react';
import { HomeNavShader } from '@/pages';
import { Provider, useDispatch } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from '@/pages/_app';
import { setDomImage } from '@/state/slices/canvasSlice';

type RefHandler = {
    stateHoldingRef: React.RefObject<HTMLDivElement>,
    serializeThisRef: React.RefObject<HTMLDivElement>
}

const initialState = {
    domImage: null
};

const mockStore = configureStore();
const imageStore = mockStore(initialState);

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
}))

describe('useRasterize', () => {
    it("rastrizes html element into useable base64 PNG DataURI", () => {
        const dispatch = jest.fn();
        (useDispatch as jest.Mock).mockReturnValue(dispatch);

        const { result } = renderHook(useRasterize, {
            initialProps: {
                serializeThisRef: { current: document.createElement('div') },
                stateHoldingRef: { current: document.createElement('div') },
                interaction: false,
                changeReload: false,
                events: []
            },
            wrapper: ({children}) => (
                <Provider store={imageStore}>{children}</Provider>
            )
        });

        expect(dispatch).toHaveBeenCalledWith(setDomImage(expect.any(String)));
    }) 
})