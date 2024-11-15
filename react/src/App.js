import './App.css';
import React from 'react'
import { useState } from 'react'

function App() {

  return (
    <div className="App">
      <header className="App-header">
              Knockoff Citation Machine
          </header>

          <div className="Body">
              <div style={{ height: " 2em" }}></div>
              <textarea placeholder="text" style={{ width: "50em", height: "250px", fontSize: "15px", background: "#282c34" }}></textarea>
              <div style={{ height: "5px" }}></div>
              <br></br>
              <button style={{ height: "3em", width: "15em", fontSize: "30px", background:"#282c34"} }>add</button>
          </div>
          
    </div>
  );
}

export default App;