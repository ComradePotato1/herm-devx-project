import './App.css';
import React from 'react'
import { useState } from 'react'

function App() {

    const [input, setInput] = useState('')
    const [title, setTitle] = useState('input')
    function handleChange(e, target) {
        setInput(e.target.value)
    }

    function button() {
        setTitle(input)

    }

  return (
      <div className="App">
      <header className="App-header">
              {title}
          </header>

          <div className="Body">
              <div style={{ height: " 2em" }}></div>
              <textarea placeholder="text" onChange={(e) => handleChange(e, "text") }
                  style={{ width: "50em", height: "250px", fontSize: "15px", background: "#282c34" }}></textarea>
              <div style={{ height: "5px" }}></div>
              <br></br>
              <button onClick={() => button()}
                  style={{ height: "3em", width: "15em", fontSize: "30px", background: "#282c34", borderRadius: "100px" }}>add</button>
          </div>
          
    </div>
    );
}

export default App;