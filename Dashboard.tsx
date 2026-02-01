import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [debugRaw, setDebugRaw] = useState<any>(null); // משתנה לדיבאג
  
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWIO-PFUSmBMbPAJ4mLvzCx8f6xy_Qqiy890CUKtd1CArENuFdKxryHP2G0q_Rx97u8nb59TdSFfCT/pub?output=csv';

  useEffect(() => {
    const fetchData = () => {
      fetch(`${CSV_URL}&t=${new Date().getTime()}`)
        .then(res => res.text())
        .then(csvText => {
          Papa.parse(csvText, {
            header: false, // הנה השינוי הגדול: לא מתייחסים לכותרות בכלל!
            skipEmptyLines: true,
            complete: (results) => {
              const rows = results.data as any[];
              
              // שומר את השורה האחרונה לדיבאג כדי שנראה מה המחשב רואה
              const lastRow = rows[rows.length - 1];
              setDebugRaw(lastRow);

              if (rows.length > 1) {
                // מיפוי לפי מיקום בטבלה (0=זמן, 1=מיקום, 2=פאן, 3=קיטורים...)
                // זה חייב לעבוד כי זה לא תלוי בשפה
                const latest = rows[rows.length - 1];
                
                setData({
                  location: latest[1],
                  fun: parseInt(latest[2]) || 0,
                  moan: parseInt(latest[3]) || 0,
                  shakes: parseInt(latest[4]) || 0,
                  massage: latest[5],
                  funny: latest[6],
                  weird: latest[7],
                  image: latest[8]
                });
              }
            }
          });
        });
    };
    fetchData();
    setInterval(fetchData, 10000);
  }, []);

  if (!data) return <div style={{textAlign: 'center', padding: '50px', direction: 'rtl'}}>טוען נתונים... 🥥</div>;

  return (
    <div style={{direction: 'rtl', fontFamily: 'sans-serif', padding: '15px', backgroundColor: '#f0f9ff', minHeight: '100vh', paddingBottom: '100px'}}>
      <h1 style={{textAlign: 'center', fontSize: '24px', fontWeight: '900', color: '#0c4a6e'}}>תאילנד 2026 🇹🇭</h1>
      <p style={{textAlign: 'center', fontWeight: 'bold', color: '#0284c7', marginTop: '-10px'}}>📍 {data.location || '...'}</p>

      {data.image && data.image.includes('http') && (
        <div style={{margin: '15px 0', borderRadius: '25px', overflow: 'hidden', border: '5px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
          <img 
            src={data.image.replace('open?id=', 'uc?export=view&id=')} 
            style={{width: '100%', display: 'block'}} 
            alt="Daily" 
          />
        </div>
      )}

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px'}}>
        <div style={{background: 'white', padding: '15px', borderRadius: '20px', textAlign: 'center', borderBottom: '5px solid #f97316'}}>
          <div style={{fontSize: '11px', color: '#94a3b8', fontWeight: 'bold'}}>שייקים היום 🥥</div>
          <div style={{fontSize: '36px', fontWeight: '900', color: '#f97316'}}>{data.shakes}</div>
        </div>
        <div style={{background: '#10b981', padding: '15px', borderRadius: '20px', textAlign: 'center', color: 'white'}}>
          <div style={{fontSize: '11px', opacity: 0.8, fontWeight: 'bold'}}>מסאז' יומי 💆‍♂️</div>
          <div style={{fontSize: '16px', fontWeight: 'bold'}}>{data.massage || '-'}</div>
        </div>
      </div>

      <div style={{background: 'white', padding: '20px', borderRadius: '20px', marginTop: '15px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
          <span style={{fontWeight: 'bold', fontSize: '14px'}}>מדד ה-FUN 🥳</span>
          <span style={{color: '#22c55e', fontWeight: '900'}}>{data.fun}/10</span>
        </div>
        <div style={{background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden'}}>
          <div style={{background: '#22c55e', height: '100%', width: `${data.fun * 10}%`}}></div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', marginTop: '15px'}}>
          <span style={{fontWeight: 'bold', fontSize: '14px'}}>מדד הקיטורים 😫</span>
          <span style={{color: '#ef4444', fontWeight: '900'}}>{data.moan}/10</span>
        </div>
        <div style={{background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden'}}>
          <div style={{background: '#ef4444', height: '100%', width: `${data.moan * 10}%`}}></div>
        </div>
      </div>

      {data.funny && (
        <div style={{background: '#0f172a', color: 'white', padding: '20px', borderRadius: '20px', marginTop: '15px', fontStyle: 'italic'}}>
          "{data.funny}"
        </div>
      )}

      {/* איזור דיבאג - שלח לי צילום מסך של זה אם זה לא עובד */}
      <div style={{marginTop: '30px', padding: '10px', background: 'black', color: '#00ff00', fontSize: '10px', borderRadius: '10px', fontFamily: 'monospace', overflowX: 'scroll'}}>
        <strong>DEBUG INFO (Send to Support):</strong><br/>
        {JSON.stringify(debugRaw, null, 2)}
      </div>
    </div>
  );
};

export default Dashboard;
