import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWIO-PFUSmBMbPAJ4mLvzCx8f6xy_Qqiy890CUKtd1CArENuFdKxryHP2G0q_Rx97u8nb59TdSFfCT/pub?output=csv';

  const formatDriveUrl = (url: string) => {
    if (!url || !url.includes('id=')) return url;
    const id = url.split('id=')[1]?.split('&')[0];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  };

  useEffect(() => {
    const fetchData = () => {
      Papa.parse(`${CSV_URL}&t=${new Date().getTime()}`, {
        download: true,
        header: false, // הפעם אנחנו לא מסתמכים על כותרות!
        complete: (results) => {
          const rows = results.data;
          if (rows.length > 1) {
            // לוקחים את השורה האחרונה שיש בה נתונים
            const latestRow = rows.filter((r: any) => r[0]).pop();
            if (latestRow) {
              setData({
                timestamp: latestRow[0],
                location: latestRow[1],
                funIndex: latestRow[2],
                moanIndex: latestRow[3],
                shakes: latestRow[4],
                massage: latestRow[5],
                funny: latestRow[6],
                weird: latestRow[7],
                image: latestRow[8] // העמודה החדשה של התמונה
              });
            }
          }
        }
      });
    };
    fetchData();
    setInterval(fetchData, 30000);
  }, []);

  if (!data) return <div style={{textAlign: 'center', padding: '50px', fontFamily: 'sans-serif'}}>מעדכן נתונים מתאילנד... 🌴</div>;

  return (
    <div style={{direction: 'rtl', fontFamily: 'sans-serif', padding: '15px', backgroundColor: '#f0f9ff', minHeight: '100vh'}}>
      <h1 style={{textAlign: 'center', color: '#0c4a6e', fontSize: '24px', marginBottom: '5px'}}>תאילנד 2026 🇹🇭</h1>
      <p style={{textAlign: 'center', fontWeight: 'bold', color: '#0284c7', marginTop: '0'}}>📍 {data.location}</p>

      {/* אזור התמונה היומית */}
      {data.image && data.image.includes('http') && (
        <div style={{margin: '15px 0', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', border: '4px solid white'}}>
          <img 
            src={formatDriveUrl(data.image)} 
            style={{width: '100%', height: '250px', objectCover: 'cover', display: 'block'}} 
            alt="Daily" 
            onError={(e) => e.currentTarget.style.display='none'}
          />
        </div>
      )}

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px'}}>
        <div style={{background: 'white', padding: '15px', borderRadius: '25px', textAlign: 'center', borderBottom: '5px solid #f97316'}}>
          <div style={{fontSize: '11px', color: '#94a3b8', fontWeight: 'bold'}}>שייקים היום 🥥</div>
          <div style={{fontSize: '36px', fontWeight: '900', color: '#f97316'}}>{data.shakes || 0}</div>
        </div>
        <div style={{background: '#10b981', padding: '15px', borderRadius: '25px', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{fontSize: '11px', opacity: 0.9, fontWeight: 'bold'}}>מסאז' יומי 💆‍♂️</div>
          <div style={{fontSize: '15px', fontWeight: 'bold', marginTop: '5px'}}>{data.massage || 'עוד לא...'}</div>
        </div>
      </div>

      <div style={{background: 'white', padding: '20px', borderRadius: '25px', marginTop: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
          <span style={{fontSize: '14px', fontWeight: 'bold', color: '#475569'}}>מדד ה-FUN 🥳</span>
          <span style={{color: '#22c55e', fontWeight: '900'}}>{data.funIndex}/10</span>
        </div>
        <div style={{background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden'}}>
          <div style={{background: '#22c55e', height: '100%', width: `${(parseInt(data.funIndex) || 0) * 10}%`, transition: 'width 1s ease-in-out'}}></div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', marginTop: '20px'}}>
          <span style={{fontSize: '14px', fontWeight: 'bold', color: '#475569'}}>מדד הקיטורים 😫</span>
          <span style={{color: '#ef4444', fontWeight: '900'}}>{data.moanIndex}/10</span>
        </div>
        <div style={{background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden'}}>
          <div style={{background: '#ef4444', height: '100%', width: `${(parseInt(data.moanIndex) || 0) * 10}%`, transition: 'width 1s ease-in-out'}}></div>
        </div>
      </div>

      {(data.funny || data.weird) && (
        <div style={{background: '#0f172a', color: 'white', padding: '20px', borderRadius: '25px', marginTop: '15px', fontStyle: 'italic', lineHeight: '1.5'}}>
          {data.funny && <p style={{margin: 0}}>"{data.funny}"</p>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
