import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const Dashboard = () => {
  const [status, setStatus] = useState('מאתחל...');
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState('');
  
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWIO-PFUSmBMbPAJ4mLvzCx8f6xy_Qqiy890CUKtd1CArENuFdKxryHP2G0q_Rx97u8nb59TdSFfCT/pub?output=csv';

  useEffect(() => {
    setStatus('מתחיל fetch...');
    
    fetch(CSV_URL)
      .then(response => {
        setStatus(`תשובה התקבלה! סטטוס: ${response.status}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then(text => {
        setRawText(text.slice(0, 200)); // מראה את ה-200 תווים הראשונים
        setStatus('התקבל טקסט, מתחיל פרסור...');
        
        Papa.parse(text, {
          header: false,
          complete: (results) => {
            setStatus(`פרסור הצליח! נמצאו ${results.data.length} שורות.`);
            console.log(results.data);
          },
          error: (err) => setError(`שגיאת פרסור: ${err.message}`)
        });
      })
      .catch(e => {
        setError(`שגיאת רשת: ${e.message}`);
        setStatus('נכשל.');
      });
  }, []);

  return (
    <div style={{direction: 'ltr', padding: '20px', fontFamily: 'monospace', backgroundColor: '#333', color: '#0f0', minHeight: '100vh'}}>
      <h1 style={{borderBottom: '2px solid white', paddingBottom: '10px'}}>VERSION DEBUG 1.0</h1>
      
      <div style={{marginTop: '20px'}}>
        <strong>STATUS:</strong> {status}
      </div>

      {error && (
        <div style={{marginTop: '20px', color: 'red', border: '1px solid red', padding: '10px'}}>
          <strong>ERROR:</strong> {error}
        </div>
      )}

      <div style={{marginTop: '20px'}}>
        <strong>RAW CSV DATA (First 200 chars):</strong>
        <pre style={{background: 'black', padding: '10px', border: '1px solid gray', whiteSpace: 'pre-wrap'}}>
          {rawText || 'Waiting for data...'}
        </pre>
      </div>

      <div style={{marginTop: '50px', borderTop: '1px solid gray', paddingTop: '10px', color: 'white'}}>
        <p>Instructions:</p>
        <ol>
          <li>If you don't see "VERSION DEBUG 1.0", the deployment failed. Check GitHub Actions.</li>
          <li>If you see "Failed to fetch" error, it's a CORS issue.</li>
          <li>If you see the raw CSV data below, the connection is FINE and the issue was in the mapping.</li>
        </ol>
      </div>
    </div>
  );
};

export default Dashboard;
