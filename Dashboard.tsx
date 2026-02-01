import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [totalShakes, setTotalShakes] = useState(0);

  // הקישור הישיר ל-CSV שלך
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWIO-PFUSmBMbPAJ4mLvzCx8f6xy_Qqiy890CUKtd1CArENuFdKxryHP2G0q_Rx97u8nb59TdSFfCT/pub?output=csv';

  useEffect(() => {
    const fetchData = () => {
      // הוספת Timestamp כדי למנוע נתונים ישנים (Cache Bursting)
      const urlWithCacheBuster = `${CSV_URL}&t=${new Date().getTime()}`;
      
      Papa.parse(urlWithCacheBuster, {
        download: true,
        header: true,
        complete: (results) => {
          const rows = results.data.filter((r: any) => r['חותמת זמן']);
          if (rows.length > 0) {
            const latest = rows[rows.length - 1];
            setData(latest);
            
            // חישוב שייקים
            const total = rows.reduce((acc: number, curr: any) => 
              acc + (parseInt(curr['כמה שייקים שתינו היום']) || 0), 0);
            setTotalShakes(total);
          }
        }
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div style={{textAlign: 'center', padding: '50px', fontFamily: 'sans-serif'}}>טוען נתונים... 🌴</div>;

  return (
    <div style={{direction: 'rtl', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f9ff', minHeight: '100vh'}}>
      <h1 style={{textAlign: 'center', color: '#0c4a6e'}}>תאילנד 2026 🇹🇭</h1>
      <p style={{textAlign: 'center', fontWeight: 'bold', color: '#0284c7'}}>📍 {data['איפה אנחנו']}</p>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px'}}>
        <div style={{background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize: '12px', color: '#94a3b8'}}>שייקים היום</div>
          <div style={{fontSize: '40px', fontWeight: 'bold', color: '#f97316'}}>{data['כמה שייקים שתינו היום'] || 0}</div>
          <div style={{fontSize: '10px', color: '#94a3b8'}}>סה"כ: {totalShakes}</div>
        </div>
        
        <div style={{background: '#10b981', padding: '20px', borderRadius: '20px', textAlign: 'center', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize: '12px', opacity: 0.8}}>מסאז' יומי</div>
          <div style={{fontSize: '18px', fontWeight: 'bold', marginTop: '10px'}}>{data['מי עשו היום מסאז\'?'] || 'אף אחד'}</div>
        </div>
      </div>

      <div style={{background: 'white', padding: '20px', borderRadius: '20px', marginTop: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
          <span style={{fontSize: '14px', fontWeight: 'bold'}}>מדד ה-FUN 🥳</span>
          <span style={{color: '#22c55e', fontWeight: 'bold'}}>{data['מדד ה-FUN']}/10</span>
        </div>
        <div style={{background: '#f1f5f9', height: '10px', borderRadius: '5px'}}>
          <div style={{background: '#22c55e', height: '100%', borderRadius: '5px', width: `${(data['מדד ה-FUN'] || 0) * 10}%`}}></div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', marginTop: '15px'}}>
          <span style={{fontSize: '14px', fontWeight: 'bold'}}>מדד הקיטורים 😫</span>
          <span style={{color: '#ef4444', fontWeight: 'bold'}}>{data['מדד הקיטורים היומי']}/10</span>
        </div>
        <div style={{background: '#f1f5f9', height: '10px', borderRadius: '5px'}}>
          <div style={{background: '#ef4444', height: '100%', borderRadius: '5px', width: `${(data['מדד הקיטורים היומי'] || 0) * 10}%`}}></div>
        </div>
      </div>

      {(data['הדבר הכי מצחיק שקרה היום'] || data['הדבר הכי מוזר שראינו היום']) && (
        <div style={{background: '#0f172a', color: 'white', padding: '20px', borderRadius: '20px', marginTop: '15px', fontStyle: 'italic'}}>
          {data['הדבר הכי מצחיק שקרה היום'] && <p>"{data['הדבר הכי מצחיק שקרה היום']}"</p>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
