// import logo from './logo.svg';
// import './App.css';


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//       </header>
//     </div>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Game from "./game/Game";
//import Game2 from "./game/Game2";
import Home from "./Home"; 
import Lost from "./Lost";
import Test from "./Test";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/game" element={<Game />} />
          <Route path="/test" element={<Test />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Lost />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App;
