import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import React, { useEffect } from 'react'
import {HomeNav} from '../components/home-nav';
import { useRasterize } from '@/hooks/useRasterize';


// Use refs to create two copies of the UI, one transparent and one hidden that will be sent to WEBGL during the rasterization step.
export const HomeNavShader = React.forwardRef((props, ref) => {
  const {serializeThisRef, stateHoldingRef}: Record<string, React.RefObject<HTMLDivElement>> = ref;
  
  return (
    <>
      <HomeNav ref={stateHoldingRef} />
      <HomeNav ref={serializeThisRef} />
    </>
  )
})



export default function Home() {
  const stateHoldingRef = React.useRef<HTMLDivElement>();
  const serializeThisRef = React.useRef<HTMLDivElement>();
  const imgTextureRef = React.useRef<Record<string, string>>();

  useRasterize({
    serializeThisRef: stateHoldingRef,
    stateHoldingRef: serializeThisRef,
    imgTextureRef: imgTextureRef,
    interaction: false,
    changeReload: false,
    events: [],
  })

  useEffect(() => {
    console.log(imgTextureRef.current);
  }, [imgTextureRef.current])

  return (
    <div>
      <canvas />
      <img src={`${imgTextureRef.current.DOMImage}`}></img>
      <HomeNavShader 
        ref={{
          stateHoldingRef: stateHoldingRef,
          serializeThisRef: serializeThisRef,
        }}
      />
    </div>
  )
}
