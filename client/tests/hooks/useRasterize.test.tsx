import { renderHook, render } from '@testing-library/react';
import { useRasterize } from '@/hooks/useRasterize';
import React from 'react';
import { HomeNavShader } from '@/pages';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

type RefHandler = {
    stateHoldingRef: React.RefObject<HTMLDivElement>,
    serializeThisRef: React.RefObject<HTMLDivElement>
}

const initialState = {
    domImage: null
};

const mockStore = configureStore();
const imageStore = mockStore(initialState);

describe('useRasterize', () => {
    it("rastrizes html element into useable base64 PNG DataURI", () => {
        const ref = React.createRef<RefHandler>();
        render(
            <Provider store={imageStore} >
                <HomeNavShader ref={ref} />
            </Provider>
        );

        if (ref && ref.current) {
            const { result } = renderHook(useRasterize, {
                initialProps: {
                    serializeThisRef: ref.current.serializeThisRef,
                    stateHoldingRef: ref.current.stateHoldingRef,
                    interaction: false,
                    changeReload: false,
                    events: []
                }
            });


        }
    }) 
})