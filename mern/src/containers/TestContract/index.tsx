// Counter.js
import React, { useState } from 'react';

function TestContract() {
  // Declare a state variable 'count' with a default value of 0
  const [count, setCount] = useState(0);

  // Function to increment the count
  const increment = () => setCount(count + 1);

  // Function to decrement the count
  const decrement = () => setCount(count - 1);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Simple Counter</h1>
      <p>Current Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement} style={{ marginLeft: '10px' }}>
        Decrement
      </button>
    </div>
  );
}

export default TestContract;
