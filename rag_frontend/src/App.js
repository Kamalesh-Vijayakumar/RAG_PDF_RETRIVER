import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [filename, setFilename] = useState('');

  const onFileChange = event => {
    setFile(event.target.files[0]);
    setUploaded(false);
  };

  const onQueryChange = event => {
    setQuery(event.target.value);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploaded(true);
      setFilename(response.data.filename);
      setResult('File uploaded. Please enter a query.');
    } catch (error) {
      console.error('Error during file upload:', error);
      setResult('Failed to upload document.');
    }
  };

  const onQuerySubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/analyze/', { query, filename }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setResult(response.data.response);
    } catch (error) {
      console.error('Error during query processing:', error);
      setResult('Failed to process query.');
    }
  };
  const renderResult = (result) => {
    // Check if result is an object and contains the expected keys
    if (result && typeof result === 'object') {
      if (result.response || result.source_nodes || result.metadata) {
        return (
          <div>
            {result.response && <div className='response'><strong>Response:</strong> {result.response}</div>}
      
          </div>
        );
      } else {
        // Generic JSON object display    
        return <pre>{JSON.stringify(result, null, 2)}</pre>;
      }
    }
    // Handle non-object types (e.g., strings or numbers)
    return <div>{result}</div>;
  };
  
  return (
    <div className="App">
      <h1>Trove.AI</h1>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload Document</button>
      {uploaded && (
        <>
          <input type="text" placeholder="Enter your query" value={query} onChange={onQueryChange} />
          <button onClick={onQuerySubmit}>Submit Query</button>
        </>
      )}
      
      <div className="result">{renderResult(result)}</div>
      <footer>
        <p>© 2024 Trover.AI. All rights reserved.</p>
      </footer>
    </div>
    
  );
  
}

export default App;
