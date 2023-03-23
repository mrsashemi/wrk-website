import React, { RefObject, useEffect, useImperativeHandle, useRef, useState } from 'react'
import {HomeNav} from '../components/home-nav';
import { useRasterize } from '@/hooks/useRasterize';
import { useSelector } from 'react-redux';
import { getDomImage, getHovering } from '@/state/slices/canvasSlice';
import { ChickenRipple } from '@/sketches/chickenRipple';


export type RefHandler = {
  stateHoldingRef: RefObject<HTMLDivElement>,
  serializeThisRef: RefObject<HTMLDivElement>
}

export default function Home() {
  const childRef = useRef<RefHandler>(null);
  const domImage = useSelector(getDomImage);
  

  return (
    <div> 
      {/*<img src={`${domImage && domImage}`} className='invisible w-fit h-fit pointer-events-none absolute inset-0 z-30' id='dom-img' onMouseMove={(e) => findMousePos(e)}></img>*/}
      <ChickenRipple />
      <HomeNavShader ref={childRef}/>
    </div>
  )
}

// Use refs to create two copies of the UI, one transparent and one hidden that will be sent to WEBGL during the rasterization step.
export const HomeNavShader = React.forwardRef((props, ref) => {
  const [title, setTitle] = useState('WZRDS');
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
        tw_classes={'text-transparent absolute inset-0 z-20'}
        title={title}
        setTitle={setTitle}
        opaq={(isHovering) ? false : true}/>
      <HomeNav 
        ref={serializeThisRef} 
        tw_classes={'invisible absolute inset-0 z-10'}
        title={title}
        setTitle={setDummy}
        opaq={(isHovering) ? true : false} />
    </React.Fragment>
  )
})