import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Game from "./game/Game";
import Home from "./Home"; 
import Lost from "./Lost";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/game" element={<Game />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Lost />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App;
