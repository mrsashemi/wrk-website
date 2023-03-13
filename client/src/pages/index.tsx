import React, { RefObject, useImperativeHandle, useRef } from 'react'
import {HomeNav} from '../components/home-nav';
import { useRasterize } from '@/hooks/useRasterize';
import { useSelector } from 'react-redux';
import { getDomImage } from '@/state/slices/canvasSlice';

export type RefHandler = {
  stateHoldingRef: RefObject<HTMLDivElement>,
  serializeThisRef: RefObject<HTMLDivElement>
}

// Use refs to create two copies of the UI, one transparent and one hidden that will be sent to WEBGL during the rasterization step.
export const HomeNavShader = React.forwardRef((props, ref) => {
  const stateHoldingRef = React.useRef<HTMLDivElement>(null);
  const serializeThisRef = React.useRef<HTMLDivElement>(null);

  useRasterize({
    serializeThisRef: serializeThisRef,
    stateHoldingRef: stateHoldingRef,
    interaction: false,
    changeReload: false,
    events: [],
  })

  useImperativeHandle(ref, () => ({
    serializeThisRef: serializeThisRef,
    stateHoldingRef: stateHoldingRef
  }));
  
  return (
    <React.Fragment>
      <HomeNav ref={stateHoldingRef} tw_classes={'text-transparent absolute inset-0'} />
      <HomeNav ref={serializeThisRef} tw_classes={'invisible absolute inset-0'} />
    </React.Fragment>
  )
})

export default function Home() {
  const childRef = useRef<RefHandler>(null);
  const domImage = useSelector(getDomImage);


  return (
    <div> 
      <img src={`${domImage && domImage}`} className='w-fit h-fit pointer-events-none' ></img>
      <HomeNavShader ref={childRef}/>
    </div>
  )
}
