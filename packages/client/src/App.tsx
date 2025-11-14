// We can import types directly from 'common'!
import { QuestionType } from 'common';
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  // This code proves we have access to the shared types
  const exampleType = QuestionType.TEXT;
  console.log('Shared type from common package:', exampleType);

  return (
    <>
      <h1>Google Forms Clone</h1>
      <p>Shared types are working! Example type: {exampleType}</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App