import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWIO-PFUSmBMbPAJ4mLvzCx8f6xy_Qqiy890CUKtd1CArENuFdKxryHP2G0q_Rx97u8nb59TdSFfCT/pub?output=csv';

  useEffect(() => {
    const fetchData = () => {
      Papa.parse(`${CSV_URL}&t=${new Date().getTime()}`, {
        download: true,
        header: true,
        complete: (results) => {
          const rows = results.data.filter((r: any) => Object.values(r).some(v => v));
          if (rows.length > 0) {
            const latest = rows[rows.length - 1];
            
            // פונקציה שמוצאת ערך לפי מילת מפתח בכותרת (כדי לעקוף רווחים מעצבנים)
            const getVal = (keyword: string) => {
              const key = Object.keys(latest).find(k => k.includes(keyword));
              return key ? latest[key] : null;
            };

            setData({
              location: getVal('איפה'),
              fun: parseInt(getVal('FUN')) || 0,
              moan: parseInt(getVal('קיטור')) || 0,
              shakes: parseInt(getVal('שייק')) || 0,
              massage: getVal('מסאז'),
              funny: getVal('מצחיק'),
              image: getVal('תמונה')
            });
          }
        }
      });
    };
    fetchData();
  }, []);

  if (!data) return <div style={{textAlign: 'center', padding: '50px'}}>טוען נתונים... 🥥</div>;

  return (
    <div style={{direction: 'rtl', fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f0f9ff', minHeight: '100vh'}}>
      <h1 style={{textAlign: 'center', color: '#0c4a6e'}}>תאילנד 2026 🌴</h1>
      <p style={{textAlign: 'center', fontWeight: 'bold', color: '#0284c7'}}>📍 {data.location || 'בתנועה'}</p>

      {/* תמונה יומית */}
      {data.image && data.image.includes('http') && (
        <div style={{margin: '20px 0', borderRadius: '20px', overflow: 'hidden', border: '5px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}}>
          <img 
            src={data.image.replace('open?id=', 'uc?export=view&id=')} 
            style={{width: '100%', display: 'block'}} 
            alt="Daily" 
          />
        </div>
      )}

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px'}}>
        <div style={{background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', borderBottom: '5px solid #f97316'}}>
          <div style={{fontSize: '12px', color: '#94a3b8'}}>שייקים היום 🥥</div>
          <div style={{fontSize: '40px', fontWeight: 'bold', color: '#f97316'}}>{data.shakes}</div>
        </div>
        <div style={{background: '#10b981', padding: '20px', borderRadius: '20px', textAlign: 'center', color: 'white'}}>
          <div style={{fontSize: '12px'}}>מי עשו מסאז'? 💆‍♂️</div>
          <div style={{fontSize: '16px', fontWeight: 'bold', marginTop: '5px'}}>{data.massage || 'אף אחד'}</div>
        </div>
      </div>

      <div style={{background: 'white', padding: '20px', borderRadius: '20px', marginTop: '15px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
          <span style={{fontWeight: 'bold'}}>מדד ה-FUN 🥳</span>
          <span style={{color: '#22c55e', fontWeight: 'bold'}}>{data.fun}/10</span>
        </div>
        <div style={{background: '#f1f5f9', height: '10px', borderRadius: '5px', overflow: 'hidden'}}>
          <div style={{background: '#22c55e', height: '100%', width: `${data.fun * 10}%`, transition: 'width 0.5s'}}></div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', marginTop: '15px'}}>
          <span style={{fontWeight: 'bold'}}>מדד הקיטורים 😫</span>
          <span style={{color: '#ef4444', fontWeight: 'bold'}}>{data.moan}/10</span>
        </div>
        <div style={{background: '#f1f5f9', height: '10px', borderRadius: '5px', overflow: 'hidden'}}>
          <div style={{background: '#ef4444', height: '100%', width: `${data.moan * 10}%`, transition: 'width 0.5s'}}></div>
        </div>
      </div>

      {data.funny && (
        <div style={{background: '#0f172a', color: 'white', padding: '20px', borderRadius: '20px', marginTop: '15px', fontStyle: 'italic'}}>
          "{data.funny}"
        </div>
      )}
    </div>
  );
};

export default Dashboard;
