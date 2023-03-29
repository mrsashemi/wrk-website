import React, { RefObject, useEffect, useImperativeHandle, useRef, useState } from 'react'
import {HomeNav} from '../components/home-nav';
import { useRasterize } from '@/hooks/useRasterize';
import { useSelector } from 'react-redux';
import { getDomImage, getHovering } from '@/state/slices/canvasSlice';
import { ChickenRipple } from '@/sketches/chickenRipple';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Chickens1000 } from '@/sketches/1000chickens';


export type RefHandler = {
  stateHoldingRef: RefObject<HTMLDivElement>,
  serializeThisRef: RefObject<HTMLDivElement>
}

export default function Home() {
  const childRef = useRef<RefHandler>(null);
  const domImage = useSelector(getDomImage);
  const windowSize = useWindowSize();
  

  return (
    <div className='w-screen h-screen m-0 p-0 overflow-hidden' style={{width: `calc(${windowSize[0]*0.01}px*100)`, height: `calc(${windowSize[1]*0.01}px*100)`}}> 
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      {/*<img src={`${domImage && domImage}`} className='invisible w-fit h-fit pointer-events-none absolute inset-0 z-30' id='dom-img' onMouseMove={(e) => findMousePos(e)}></img>*/}
      <Chickens1000 />
      {/* {<ChickenRipple />} */}
      <HomeNavShader ref={childRef}/>
    </div>
  )
}

// Use refs to create two copies of the UI, one transparent and one hidden that will be sent to WEBGL during the rasterization step.
export const HomeNavShader = React.forwardRef((props, ref) => {
  const [title, setTitle] = useState('WIZARDS ROBBING KIDS');
  const [dummy, setDummy] = useState('');
  const stateHoldingRef = React.useRef<HTMLDivElement>(null);
  const serializeThisRef = React.useRef<HTMLDivElement>(null);
  const isHovering = useSelector(getHovering);

  useRasterize({
    serializeThisRef: serializeThisRef,
    stateHoldingRef: stateHoldingRef,
    events: [title],
  })

  useImperativeHandle(ref, () => ({
    serializeThisRef: serializeThisRef,
    stateHoldingRef: stateHoldingRef
  }));

  
  return (
    <React.Fragment>
      <HomeNav 
        ref={stateHoldingRef} 
        tw_classes={'text-transparent absolute inset-0 z-40'}
        title={title}
        setTitle={setTitle}
        opaq={false}/>
      <HomeNav 
        ref={serializeThisRef} 
        tw_classes={'invisible absolute inset-0 z-30'}
        title={title}
        setTitle={setDummy}
        opaq={true} />
    </React.Fragment>
  )
})