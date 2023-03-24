import { useLongPress } from "@/hooks/useLongpress";
import { getCanvasSize, getInvert, setHovering, setInvert, setMousePos } from "@/state/slices/canvasSlice";
import React, { FC, MutableRefObject, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";

interface HomeProps {
  tw_classes: string;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  opaq: boolean 
}

export const HomeNav: React.ForwardRefExoticComponent<HomeProps & React.RefAttributes<HTMLDivElement>> = React.forwardRef((props, ref) => {
  const canvasSize = useSelector(getCanvasSize);
  const isInvert = useSelector(getInvert);
  const titleRef = useRef<any>(null);
  const dispatch = useDispatch();
  useLongPress({duration: 100, element: titleRef.current})

  function findMousePos(e: any) {
    let rect = e.target.getBoundingClientRect();

    let scaleX = canvasSize[0]/rect.width;
    let scaleY = canvasSize[1]/rect.height;
  
    dispatch(setMousePos([(e.clientX - rect.left)*scaleX, (e.clientY - rect.top)*scaleY]));
  }


  return (
    <div 
    className={`${props.tw_classes} domClient`}
    ref={ref} 
    onMouseMove={(e) => findMousePos(e)} 
    onClick={() => dispatch(setInvert((isInvert) ? false : true))}
    style={{width: '100vw', height: '100vh', margin: '0px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'courier new', backgroundColor: 'transparent'}}>
      <nav style={{width: '100vw', height: 'fit-content', margin: '0px', display: 'flex', alignItems: "center", justifyContent: 'space-around', marginTop: "0.5rem", color: (props.opaq) ? 'rgb(128, 128, 128)' : 'transparent'}}>
        <div style={{fontSize: "1rem", lineHeight: "1.5rem"}}>Artworks</div>
        <div style={{fontSize: "1rem", lineHeight: "1.5rem"}}>Photography</div>
        <div style={{fontSize: "1rem", lineHeight: "1.5rem"}}>Generative Art</div>
      </nav>
      <div style={{width: '100vw', height: 'fit-content', margin: '0px', display: 'flex', alignItems: "center", justifyContent: 'start', marginLeft: '3.5rem', paddingBottom: '10rem'}}>
        <h1 style={{fontSize: "6rem", lineHeight: "1", fontWeight: "100", color: (props.opaq) ? 'white' : 'transparent'}} 
          ref={titleRef}
          className="select-none cursor-pointer"
          onMouseEnter={() => {
            props.setTitle('WIZARDS ROBBING KIDS')
            return dispatch(setHovering(true))}}
          onMouseLeave={() => {
            props.setTitle('WZRDS')
            return dispatch(setHovering(false))}}>{props.title}</h1>
      </div>
      <nav style={{width: '100vw', height: 'fit-content', margin: '0px', display: 'flex', alignItems: "center", justifyContent: 'space-around', marginBottom: "0.5rem", color: (props.opaq) ? 'rgb(128, 128, 128)' : 'transparent'}}>
        <div style={{fontSize: "1rem", lineHeight: "1.5rem"}}>About</div>
        <div style={{fontSize: "1rem", lineHeight: "1.5rem"}}>Contact</div>
        <div style={{fontSize: "1rem", lineHeight: "1.5rem"}}>Login</div>
      </nav>
    </div>
  )
})
