import { getCanvasSize, getInvert, setInvert, setMousePos } from "@/state/slices/canvasSlice";
import React, { FC, MutableRefObject, useEffect, useState } from "react"
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
  const dispatch = useDispatch();


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
    style={{width: '100vw', height: '100vh', margin: '0px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'Times New Roman', backgroundColor: 'transparent', color: (props.opaq) ? 'white' : 'transparent'}}>
      <nav style={{width: '100vw', height: 'fit-content', margin: '0px', display: 'flex', alignItems: "center", justifyContent: 'space-around', marginTop: "0.5rem"}}>
        <div style={{fontSize: "1.5rem", lineHeight: "2rem"}}>Artworks</div>
        <div style={{fontSize: "1.5rem", lineHeight: "2rem"}}>Photography</div>
        <div style={{fontSize: "1.5rem", lineHeight: "2rem"}}>Generative Art</div>
      </nav>
      <div style={{width: '100vw', height: 'fit-content', margin: '0px', display: 'flex', alignItems: "center", justifyContent: 'space-around'}}>
        <h1 style={{fontSize: "1.875rem", lineHeight: "2.25rem"}} 
          onMouseEnter={() => props.setTitle('WIZARDS ROBBING KIDS')}
          onMouseLeave={() => props.setTitle('WZRDS')}>{props.title}</h1>
        <div style={{fontSize: "1.5rem", lineHeight: "2rem"}}></div>
        <div style={{fontSize: "1.5rem", lineHeight: "2rem"}}></div>
      </div>
      <nav style={{width: '100vw', height: 'fit-content', margin: '0px', display: 'flex', alignItems: "center", justifyContent: 'space-around', marginBottom: "0.5rem"}}>
        <div style={{fontSize: "1.5rem", lineHeight: "2rem"}}>About</div>
        <div style={{fontSize: "1.5rem", lineHeight: "2rem"}}>Contact</div>
        <div style={{fontSize: "1.5rem", lineHeight: "2rem"}}>Login</div>
      </nav>
    </div>
  )
})
