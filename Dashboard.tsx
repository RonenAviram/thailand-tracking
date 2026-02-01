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
        header: true,
        complete: (results) => {
          const rows = results.data.filter((r: any) => r['חותמת זמן']);
          if (rows.length > 0) setData(rows[rows.length - 1]);
        }
      });
    };
    fetchData();
    setInterval(fetchData, 30000);
  }, []);

  if (!data) return <div style={{textAlign: 'center', padding: '50px'}}>טוען... 🌴</div>;

  return (
    <div style={{direction: 'rtl', fontFamily: 'sans-serif', padding: '15px', backgroundColor: '#f0f9ff', minHeight: '100vh'}}>
      <h1 style={{textAlign: 'center', fontSize: '24px'}}>משפחת אבירם בתאילנד 🇹🇭</h1>
      <p style={{textAlign: 'center', fontWeight: 'bold'}}>📍 {data['איפה אנחנו']}</p>

      {data['התמונה היומית'] && (
        <div style={{margin: '15px 0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'}}>
          <img src={formatDriveUrl(data['התמונה היומית'])} style={{width: '100%', display: 'block'}} alt="Daily" />
        </div>
      )}

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
        <div style={{background: 'white', padding: '15px', borderRadius: '20px', textAlign: 'center'}}>
          <div style={{fontSize: '12px', color: '#666'}}>שייקים</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#f97316'}}>{data['כמה שייקים שתינו היום'] || 0}</div>
        </div>
        <div style={{background: '#10b981', padding: '15px', borderRadius: '20px', textAlign: 'center', color: 'white'}}>
          <div style={{fontSize: '12px'}}>מסאז'</div>
          <div style={{fontSize: '16px', fontWeight: 'bold'}}>{data['מי עשו היום מסאז\'?'] || 'אף אחד'}</div>
        </div>
      </div>

      <div style={{background: 'white', padding: '20px', borderRadius: '20px', marginTop: '15px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
          <span>מדד ה-FUN 🥳</span>
          <span style={{color: '#22c55e', fontWeight: 'bold'}}>{data['מדד ה-FUN']}/10</span>
        </div>
        <div style={{background: '#eee', height: '10px', borderRadius: '5px'}}>
          <div style={{background: '#22c55e', height: '100%', width: `${(data['מדד ה-FUN'] || 0) * 10}%`}}></div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', marginTop: '15px'}}>
          <span>מדד הקיטורים 😫</span>
          <span style={{color: '#ef4444', fontWeight: 'bold'}}>{data['מדד הקיטורים היומי']}/10</span>
        </div>
        <div style={{background: '#eee', height: '10px', borderRadius: '5px'}}>
          <div style={{background: '#ef4444', height: '100%', width: `${(data['מדד הקיטורים היומי'] || 0) * 10}%`}}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
