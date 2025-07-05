import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [backendMessage, setBackendMessage] = useState('');

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          
        </a>
        <a href="https://react.dev" target="_blank">
          
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">

        <button onClick={() => {
          setCount((count) => count + 1)
          fetch('/api/hello')
           .then(response => {
            if (!response.ok) {
              throw new Error(`Erro na rede: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
            setBackendMessage(data.message);
          })
          .catch(error => {
            console.error('Houve um problema com a sua requisição fetch:', error);
            setBackendMessage('Falha ao carregar a mensagem.');
          });
        }}>
          count is {count}
        </button>

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <p>
          {backendMessage && <strong>Mensagem do Backend: {backendMessage}</strong>}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
