import React, { FC, MutableRefObject, useEffect } from "react"

interface HomeProps {
  tw_classes: string;

}

export const HomeNav: React.ForwardRefExoticComponent<HomeProps & React.RefAttributes<HTMLDivElement>> = React.forwardRef((props, ref) => {


  return (
    <div 
    className={`${props.tw_classes}`}
    ref={ref} 
    style={{width: '100vw', height: '100vh', margin: '0px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'monospace'}}>
      <nav style={{width: '100vw', height: 'fit-content', margin: '0px', display: 'flex', alignItems: "center", justifyContent: 'space-around', marginTop: "0.5rem"}}>
        <div style={{fontSize: "1.5rem", lineHeight: "2rem"}}>Artworks</div>
        <div style={{fontSize: "1.5rem", lineHeight: "2rem"}}>Photography</div>
        <div style={{fontSize: "1.5rem", lineHeight: "2rem"}}>Generative Art</div>
      </nav>
      <div style={{width: '100vw', height: 'fit-content', margin: '0px', display: 'flex', alignItems: "center", justifyContent: 'space-around'}}>
        <h1 style={{fontSize: "1.875rem", lineHeight: "2.25rem"}}>WIZARDS ROBBING KIDS</h1>
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
