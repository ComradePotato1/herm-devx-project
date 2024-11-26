import './App.css';
import React from 'react'
import { useState } from 'react'
import axios from 'axios';

function App() {

    const [input, setInput] = useState('')
    const [title, setTitle] = useState('input')
    function handleChange(e, target) {
        setInput(e.target.value)
    }

    const analyze = async () => {
        try {
            
            const res = await axios.get('http://localhost:5001/v1/analyze/' + input);
            if (res.data[0].isReliable) {
                setTitle('Language of this text is ' + res.data[0].language);
            } else {
                setTitle("Unable to determine language")
            }
        } catch (error) {
            //setResponse('Error fetching response: ' + error);
            setTitle("ERROR fetching data")
        }
    };

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
              <button onClick={analyze}
                  style={{ height: "3em", width: "15em", fontSize: "30px", background: "#282c34", borderRadius: "100px" }}>analyze</button>
              <div style={{ height: "1em" }}></div>
              <hr></hr>
              <p>History</p>
              
          </div>
          
    </div>
    );
}

export default App;