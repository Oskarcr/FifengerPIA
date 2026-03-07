import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import mernImage from "./assets/mern.png";

function App() {
  const [count, setCount] = useState(0)

//////////////////////////////////////
//        RESPUESTA DEL BACK        //
//////////////////////////////////////

  useEffect(() => {
    fetch("http://localhost:4000/base/test")
    .then(async res => console.log(await res.text()))
    .catch(err => console.log(err));
  }, []);

  return <>
      <img style={{
        width: "100vw",
        height: "100vh"
      }} src={mernImage}/>
    </>
}

export default App
