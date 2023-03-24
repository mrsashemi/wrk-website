import { setPressing } from '@/state/slices/canvasSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

type useLongPressProps = {
    duration: number;
    element?: HTMLElement | Document;
};

export const useLongPress = ({
    duration = 500,
    element,
}: useLongPressProps) => {
    const [hasPressed, setHasPressed] = React.useState(false);
    const dispatch = useDispatch();

    React.useEffect(() => {
    let to: any;
    const onMouseDown = (e: any) => {
        e.stopPropagation();
        to = setTimeout(() => {
        setHasPressed(true);
        dispatch(setPressing(true));
        }, duration);
    };
    const onMouseUp = (e: any) => {
        e.stopPropagation();
        clearTimeout(to);
        setHasPressed(false);
        dispatch(setPressing(false));
    };
    if (element) {
        element.addEventListener('mousedown', onMouseDown);
        element.addEventListener('mouseup', onMouseUp);
    }

    return () => {
        if (element) {
        element.removeEventListener('mousedown', onMouseDown);
        element.removeEventListener('mouseup', onMouseUp);
        }
        clearTimeout(to);
    };
    }, [element]);
    return hasPressed;
};
