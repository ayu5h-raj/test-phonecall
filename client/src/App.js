import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {

  const [name, setName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [fromPhone, setFromPhone] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(1e9);
  const duration = [5, 10, 15]

  const handleCall = async () => {

    if (name === '' || toPhone === "" || fromPhone === "") {
      alert("Invalid input");
      return;
    }

    const response = await axios('/call?' + new URLSearchParams({
      num1: toPhone,
      num2: fromPhone
    }))

    const sid = response.data.sid;
    const startTime = response.data.startTime;

    setTimeout(() => {
      axios.post(`/terminateCall`, {
        name: name,
        sid: sid,
        toPhone: toPhone,
        fromPhone: fromPhone,
        startTime: startTime
      })
    }, parseInt(selectedDuration) * 60 * 1000)

  }

  return (
    <div className="App">
      <label>Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>Number1(from)</label>
      <input type="text" value={fromPhone} onChange={(e) => setFromPhone(e.target.value)} />
      <label>Number2(to)</label>
      <input type="text" value={toPhone} onChange={(e) => setToPhone(e.target.value)} />
      <label htmlFor="duration">Select Duration (in minutes)</label>
      <select name="duration" value={selectedDuration} onChange={e => setSelectedDuration(e.target.value)}>
        {duration.map(dur => <option value={dur} key={dur} >{dur}</option>
        )}
      </select>
      <button onClick={handleCall}> Call </button>
    </div>
  );
}

export default App;
