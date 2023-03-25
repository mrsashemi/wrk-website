import { useLongPress } from "@/hooks/useLongpress";
import { useWindowSize } from "@/hooks/useWindowSize";
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
  const windowSize = useWindowSize();
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

  const styles: any = {
    mainContainer: {
      xsm: {
        prt: { //320x568
          width: '100vw', 
          height: '100vh', 
          margin: '0px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          fontFamily: 'courier new', 
          backgroundColor: 'transparent'
        },
        lnd: { //568x320
          width: '100vw', 
          height: '100vh', 
          margin: '0px', 
          padding: '0px',
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          fontFamily: 'courier new', 
          backgroundColor: 'transparent'
        }
      },
      sm: {
        prt: { //640x854
          width: '100vw', 
          height: '100vh', 
          margin: '0px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          fontFamily: 'courier new', 
          backgroundColor: 'transparent'
        },
        lnd: { //854X640
          width: '100vw', 
          height: '100vh', 
          margin: '0px', 
          padding: '0px',
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          fontFamily: 'courier new', 
          backgroundColor: 'transparent'
        }
      },
      md: {
        prt: { //768x1024
          width: '100vw', 
          height: '100vh', 
          margin: '0px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          fontFamily: 'courier new', 
          backgroundColor: 'transparent'
        },
        lnd: { //1024x768
          width: '100vw', 
          height: '100vh', 
          margin: '0px', 
          padding: '0px',
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          fontFamily: 'courier new', 
          backgroundColor: 'transparent'
        }
      },
      lg: {
        prt: { //1024x1366
          width: '100vw', 
          height: '100vh', 
          margin: '0px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          fontFamily: 'courier new', 
          backgroundColor: 'transparent'
        },
        lnd: { //1366x1024
          width: '100vw', 
          height: '100vh', 
          margin: '0px', 
          padding: '0px',
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          fontFamily: 'courier new', 
          backgroundColor: 'transparent'
        }
      },
    }, 
    navContainer: {
      xsm: {
        prt: {
          width: '100vw', 
          height: 'fit-content', 
          margin: '1rem', 
          display: 'flex',
          flexDirection: 'column', 
          alignItems: "start", 
          justifyContent: 'center', 
          color: (props.opaq) ? 'white' : 'transparent',
        },
        lnd: {
          width: '100%', 
          height: 'fit-content', 
          margin: '0.75rem', 
          display: 'flex',
          alignItems: "center", 
          gap: '1rem',
          justifyContent: 'start', 
          color: (props.opaq) ? 'white' : 'transparent',
        }
      },
      sm: { 
        prt: { 
          width: '100vw', 
          height: 'fit-content', 
          margin: '1.25rem', 
          gap: '0.25rem',
          display: 'flex',
          flexDirection: 'column', 
          alignItems: "start", 
          justifyContent: 'center', 
          color: (props.opaq) ? 'white' : 'transparent',
        },
        lnd: {
          width: '100%', 
          height: 'fit-content', 
          margin: '1rem', 
          display: 'flex',
          alignItems: "center", 
          gap: '1.125rem',
          justifyContent: 'start', 
          color: (props.opaq) ? 'white' : 'transparent',
        }
      },
      md: { 
        prt: {
          width: '100vw', 
          height: 'fit-content', 
          margin: '1.25rem', 
          gap: '0.5rem',
          display: 'flex',
          flexDirection: 'column', 
          alignItems: "start", 
          justifyContent: 'center', 
          color: (props.opaq) ? 'white' : 'transparent',
        },
        lnd: { 
          width: '100%', 
          height: 'fit-content', 
          margin: '1.25rem', 
          display: 'flex',
          alignItems: "center", 
          gap: '1.5rem',
          justifyContent: 'start', 
          color: (props.opaq) ? 'white' : 'transparent',
        }
      },
      lg: { 
        prt: {
          width: '100vw', 
          height: 'fit-content', 
          margin: '1.5rem', 
          gap: '0.75rem',
          display: 'flex',
          flexDirection: 'column', 
          alignItems: "start", 
          justifyContent: 'center', 
          color: (props.opaq) ? 'white' : 'transparent',
        },
        lnd: { 
          width: '100%', 
          height: 'fit-content', 
          margin: '1.5rem', 
          display: 'flex',
          alignItems: "center", 
          gap: '1.75rem',
          justifyContent: 'start', 
          color: (props.opaq) ? 'white' : 'transparent',
        }
      },
      xxlg: { 
        prt: {
          width: '100vw', 
          height: 'fit-content', 
          margin: '1.5rem', 
          gap: '0.75rem',
          display: 'flex',
          flexDirection: 'column', 
          alignItems: "start", 
          justifyContent: 'center', 
          color: (props.opaq) ? 'white' : 'transparent',
        },
        lnd: { 
          width: '100%', 
          height: 'fit-content', 
          margin: '2.5rem', 
          display: 'flex',
          alignItems: "center", 
          gap: '2.875rem',
          justifyContent: 'start', 
          color: (props.opaq) ? 'white' : 'transparent',
        }
      },
    },
    navLinks: {
      xsm: {
        prt: {
          fontSize: "1.25rem", 
          lineHeight: "1.75rem",
          fontWeight: "100"
        },
        lnd: {
          fontSize: "1rem", 
          lineHeight: "1.5rem",
          fontWeight: "100"
        }
      },
      sm: {
        prt: {
          fontSize: "1.5rem", 
          lineHeight: "2.0rem",
          fontWeight: "100"
        },
        lnd: {
          fontSize: "1.125rem", 
          lineHeight: "1.75rem",
          fontWeight: "100"
        }
      },
      md: {
        prt: {
          fontSize: "1.875rem", 
          lineHeight: "2.25rem",
          fontWeight: "100"
        },
        lnd: {
          fontSize: "1.5rem", 
          lineHeight: "2rem",
          fontWeight: "100"
        }
      },
      lg: {
        prt: {
          fontSize: "2.25rem", 
          lineHeight: "2.5rem",
          fontWeight: "100"
        },
        lnd: {
          fontSize: "2.25rem", 
          lineHeight: "2.5rem",
          fontWeight: "100"
        }
      },
      xxlg: {
        prt: {
          fontSize: "2.25rem", 
          lineHeight: "2.5rem",
          fontWeight: "100"
        },
        lnd: {
          fontSize: "3.75rem", 
          lineHeight: "1rem",
          fontWeight: "100"
        }
      },
    },
    titleContainer: {
      xsm: {
        prt: {
          width: '100vw', 
          height: 'fit-content', 
          margin: '0px', 
          display: 'flex', 
          alignItems: "center", 
          justifyContent: 'end',
        },
        lnd: {
          width: '100%', 
          height: 'fit-content', 
          margin: '0px', 
          display: 'flex', 
          alignItems: "center", 
          justifyContent: 'end',
        }
      },
      sm: {
        prt: {
          width: '100vw', 
          height: 'fit-content', 
          margin: '0px', 
          display: 'flex', 
          alignItems: "center", 
          justifyContent: 'end',
        },
        lnd: {
          width: '100%', 
          height: 'fit-content', 
          margin: '0px', 
          display: 'flex', 
          alignItems: "center", 
          justifyContent: 'end',
        }
      },
      md: {
        prt: {
          width: '100vw', 
          height: 'fit-content', 
          margin: '0px', 
          display: 'flex', 
          alignItems: "center", 
          justifyContent: 'end',
        },
        lnd: {
          width: '100%', 
          height: 'fit-content', 
          margin: '0px', 
          display: 'flex', 
          alignItems: "center", 
          justifyContent: 'end',
        }
      },
      lg: {
        prt: {
          width: '100vw', 
          height: 'fit-content', 
          margin: '0px', 
          display: 'flex', 
          alignItems: "center", 
          justifyContent: 'end',
        },
        lnd: {
          width: '100%', 
          height: 'fit-content', 
          margin: '0px', 
          display: 'flex', 
          alignItems: "center", 
          justifyContent: 'end',
        }
      }
    },
    title: {
      xsm: {
        prt: {
          fontSize: "4.5rem", 
          textAlign: "right",
          lineHeight: "1", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '0.5rem'
        },
        lnd: {
          fontSize: "2rem", 
          textAlign: "right",
          lineHeight: "2.5rem", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '1rem',
          marginBottom: '6rem'
        }
      },
      sm: {
        prt: {
          fontSize: "8rem", 
          textAlign: "right",
          lineHeight: "1", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '1rem'
        },
        lnd: {
          fontSize: "3.75rem", 
          textAlign: "right",
          lineHeight: "1", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '1.5rem',
          marginBottom: '11rem'
        }
      },
      md: {
        prt: {
          fontSize: "8rem", 
          textAlign: "right",
          lineHeight: "1", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '1.25rem'
        },
        lnd: {
          fontSize: "4.5rem", 
          textAlign: "right",
          lineHeight: "1", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '1.5rem',
          marginBottom: '12rem'
        }
      },
      lg: {
        prt: {
          fontSize: "10rem", 
          textAlign: "right",
          lineHeight: "1", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '1.5rem'
        },
        lnd: {
          fontSize: "6rem", 
          textAlign: "right",
          lineHeight: "1", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '1.75rem',
          marginBottom: '14rem'
        }
      },
      xlg: { 
        prt: { //
          fontSize: "10rem", 
          textAlign: "right",
          lineHeight: "1", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '1.5rem'
        },
        lnd: { //1536x1154
          fontSize: "7rem", 
          textAlign: "right",
          lineHeight: "1", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '1.75rem',
          marginBottom: '16rem'
        }
      },
      xxlg: { 
        prt: { //
          fontSize: "10rem", 
          textAlign: "right",
          lineHeight: "1", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '1.5rem'
        },
        lnd: { //1536x1154
          fontSize: "10rem", 
          textAlign: "right",
          lineHeight: "1", 
          fontWeight: "100", 
          color: (props.opaq) ? 'white' : 'transparent',
          marginRight: '1.75rem',
          marginBottom: '16rem'
        }
      },
    }
  }


  return (
    <div 
    className={`${props.tw_classes} domClient`}
    ref={ref} 
    onMouseMove={(e) => findMousePos(e)} 
    onClick={() => dispatch(setInvert((isInvert) ? false : true))}
    style={styles.mainContainer.lg.lnd}>
      <nav style={styles.navContainer.lg.lnd}>
        <div style={styles.navLinks.lg.lnd}>Artworks</div>
        <div style={styles.navLinks.lg.lnd}>Photography</div>
        <div style={styles.navLinks.lg.lnd}>Generative</div>
      </nav>
      <div style={styles.titleContainer.lg.lnd}>
        <h1 style={styles.title.lg.lnd} 
          ref={titleRef}
          className="select-none cursor-pointer"
          onMouseEnter={() => {
            props.setTitle('WIZARDS ROBBING KIDS')
            return dispatch(setHovering(true))}}
          onMouseLeave={() => {
            props.setTitle('WIZARDS ROBBING KIDS')
            return dispatch(setHovering(false))}}>{props.title}</h1>
      </div>
      <nav style={styles.navContainer.lg.lnd}>
        <div style={styles.navLinks.lg.lnd}>About</div>
        <div style={styles.navLinks.lg.lnd}>Contact</div>
        <div style={styles.navLinks.lg.lnd}>Login</div>
      </nav>
    </div>
  )
})
