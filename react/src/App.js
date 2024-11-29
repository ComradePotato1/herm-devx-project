import './App.css';
import React from 'react'
import { useState } from 'react'
import axios from 'axios';

function App() {

    const [input, setInput] = useState('')
    const [title, setTitle] = useState('input')
    const [history, setHistory] = useState([["Hello world", "english"]])

    function handleChange(e, target) {
        setInput(e.target.value)
    }


    const getHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5001/v1/history');
        console.log(res.data);
        const newHistory = res.data.map(item => [item.input, item.lang]);
        setHistory(newHistory.reverse());
        setTitle("History synced")
        } catch (error) {
            setTitle("ERROR syncing data")
        }
    };


    const analyze = async () => {
        try {
            const res = await axios.get('http://localhost:5001/v1/analyze/' + input);
            if (res.data[0].isReliable) {
                setTitle('Language of this text is ' + res.data[0].language);
                setHistory([...history, [input, res.data[0].language]]);
            } else {
                setTitle("Unable to determine language")
                setHistory([...history, [input, "Unable to determine"]])
            }
        } catch (error) {
            setTitle("ERROR fetching data")
            setHistory([...history, [input, "ERROR"]])
        }
    };

    const removeHistory = async () => {
        try {
            const res = await axios.post('http://localhost:5001/v1/remove');
            getHistory();
            setTitle("History cleared");
        } catch (error) {
            setTitle("ERROR accessing database")
        }
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
              <button onClick={analyze}
                  style={{ height: "3em", width: "15em", fontSize: "30px", background: "#282c34", borderRadius: "100px" }}>analyze</button>
              <button onClick={getHistory}
                  style={{ height: "3em", width: "7.5em", fontSize: "30px", background: "#282c34", borderRadius: "100px" }}>sync history</button>
              <button onClick={removeHistory}
                  style={{ height: "3em", width: "7em", fontSize: "30px", background: "#282c34", borderRadius: "100px" }}>clear history</button>
              <div style={{ height: "3em" }}></div>
              <hr></hr>
              <h2>History</h2>

              {history.map((history, index) => (
                <div key = {index}>
                <div>
                    <p>Result: {history[1]}</p>
                    <p>{history[0]}</p>
                    <hr></hr>
                </div>
                </div>
            ))}
            <div style={{ height: "3em" }}></div>
              
          </div>
          
    </div>
    );
}

export default App;