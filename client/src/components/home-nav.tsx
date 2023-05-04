import { useLongPress } from "@/hooks/useLongpress";
import { getCanvasSize, getInvert, setHovering, setInvert, setMousePos } from "@/state/slices/canvasSlice";
import { getHomeNavContainer, getHomeNavLinks, getHomeTitle } from "@/state/slices/pageSlice";
import React, { useRef } from "react"
import { useDispatch, useSelector } from "react-redux";

interface HomeProps {
  tw_classes: string;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  opaq: boolean 
}

interface MainContainer {
  [index: string]: string;
}

interface NavContainer {
  [index: string]: string;
}

interface NavLinks {
  [index: string]: string;
}

interface TitleContainer {
  [index: string]: string;
}

interface Title {
  [index: string]: string;
}

interface Styles {
  mainContainer: MainContainer;
  navContainer: NavContainer;
  navLinks: NavLinks;
  titleContainer: TitleContainer;
  title: Title;
}

export const HomeNav: React.ForwardRefExoticComponent<HomeProps & React.RefAttributes<HTMLDivElement>> = React.forwardRef((props, ref) => {
  const homeNav = useSelector(getHomeNavContainer);
  const homeNavLinks = useSelector(getHomeNavLinks);
  const homeTitle = useSelector(getHomeTitle);
  const canvasSize = useSelector(getCanvasSize);
  const isInvert = useSelector(getInvert);
  const titleRef = useRef<any>(null);
  const dispatch = useDispatch();
  useLongPress({duration: 100, element: titleRef.current})

  function findMousePos(e: any) {
    let rect = e.target.getBoundingClientRect();
    let scaleX = (canvasSize as number[])[0]/rect.width;
    let scaleY = (canvasSize as number[])[1]/rect.height;
  
    dispatch(setMousePos([(e.clientX - rect.left)*scaleX, (e.clientY - rect.top)*scaleY]));
  }


  const styles: Styles = {
    mainContainer: { // no changes
      width: '100vw', 
      height: '100vh', 
      margin: '0px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      fontFamily: 'courier new', 
      backgroundColor: 'transparent'
    }, 
    navContainer: { // different margins, flexDirection, alignitems, justifycontent, gap
      width: '100vw', 
      height: 'fit-content', 
      display: 'flex',
      color: (props.opaq) ? 'white' : 'transparent',
      ...homeNav
    },
    navLinks: { // different fontsize, lineheight
      fontWeight: "100",
      ...homeNavLinks
    },
    titleContainer: { // no changes
      width: '100vw', 
      height: 'fit-content', 
      margin: '0px', 
      display: 'flex', 
      alignItems: "center", 
      justifyContent: 'end',
    },
    title: { // different fontsize, lineheight, marginRight, marginBottom
      textAlign: "right",
      fontWeight: "100", 
      color: (props.opaq) ? 'white' : 'transparent',
      ...homeTitle
    }
  }

  return (
    <div 
    className={`${props.tw_classes} domClient`}
    ref={ref} 
    onMouseMove={(e) => findMousePos(e)} 
    onClick={() => dispatch(setInvert((isInvert) ? false : true))}
    style={styles.mainContainer}>
      <nav style={styles.navContainer}>
        <div style={styles.navLinks}>Artworks</div>
        <div style={styles.navLinks}>Photography</div>
        <div style={styles.navLinks}>Generative</div>
      </nav>
      <div style={styles.titleContainer}>
        <h1 style={styles.title} 
          ref={titleRef}
          className="select-none cursor-pointer"
          onMouseEnter={() => {
            props.setTitle('WIZARDS ROBBING KIDS')
            return dispatch(setHovering(true))}}
          onMouseLeave={() => {
            props.setTitle('WIZARDS ROBBING KIDS')
            return dispatch(setHovering(false))}}>{props.title}</h1>
      </div>
      <nav style={styles.navContainer}>
        <div style={styles.navLinks}>About</div>
        <div style={styles.navLinks}>Contact</div>
        <div style={styles.navLinks}>Login</div>
      </nav>
    </div>
  )
})
