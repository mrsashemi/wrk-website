import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'


export default function Home() {
  return (
    <div className='container m-0 w-screen h-screen flex flex-col justify-between' >
      <nav className='container w-screen h-fit mx-auto flex item-center justify-evenly'>
        <div>Artworks</div>
        <div>Photography</div>
        <div>Generative Art</div>
      </nav>
      <div className='container mx-auto w-screen h-fit flex item-center justify-evenly'>
        <h1>WIZARDS ROBBING KIDS</h1>
        <div></div>
        <div></div>
      </div>
      <nav className='container w-screen h-fit mx-auto flex item-center justify-evenly'>
        <div>About</div>
        <div>Contact</div>
        <div>Login</div>
      </nav>
    </div>
  )
}

// pseudocode
// 