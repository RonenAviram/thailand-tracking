import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

// הגדרת טיפוסים כדי שה-Build לא ייכשל
interface SheetRow {
  location: string;
  fun: string;
  moan: string;
  shakes: string;
  massage: string;
  funny: string;
  weird: string;
  image: string;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<SheetRow | null>(null);
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWIO-PFUSmBMbPAJ4mLvzCx8f6xy_Qqiy890CUKtd1CArENuFdKxryHP2G0q_Rx97u8nb59TdSFfCT/pub?output=csv';

  useEffect(() => {
    const fetchData = () => {
      // שליפת הנתונים כטקסט פשוט כדי למנוע בעיות זיכרון
      fetch(`${CSV_URL}&t=${new Date().getTime()}`)
        .then(res => res.text())
        .then(csvText => {
          Papa.parse(csvText, {
            header: false, // מתעלמים מכותרות בעברית!
            skipEmptyLines: true,
            complete: (results) => {
              // המרה בטוחה של התוצאות
              const rows = results.data as string[][];
              
              // לוקחים את השורה האחרונה שיש בה תוכן אמיתי
              // (מניחים שהשורה הראשונה היא כותרות)
              if (rows.length > 1) {
                const lastRow = rows[rows.length - 1];
                
                // מיפוי לפי הסדר בגיליון שלך (0=זמן, 1=מיקום, 2=פאן, וכו')
                setData({
                  location: lastRow[1] || '',
                  fun: lastRow[2] || '0',
                  moan: lastRow[3] || '0',
                  shakes: lastRow[4] || '0',
                  massage: lastRow[5] || '',
                  funny: lastRow[6] || '',
                  weird: lastRow[7] || '',
                  image: lastRow[8] || ''
                });
              }
            }
          });
        })
        .catch(err => console.error("Error fetching CSV:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // תצוגת טעינה
  if (!data) return <div className="text-center p-10">טוען נתונים...</div>;

  // פונקציית עזר לתמונה
  const getImageUrl = (url: string) => {
    if (!url || !url.includes('id=')) return null;
    const id = url.split('id=')[1]?.split('&')[0];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  };
  const imgUrl = getImageUrl(data.image);

  return (
    <div style={{direction: 'rtl', fontFamily: 'system-ui, sans-serif', padding: '20px', background: '#f0f9ff', minHeight: '100vh', color: '#1e293b'}}>
      
      {/* כותרת ומיקום */}
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <h1 style={{margin: 0, fontSize: '2rem', color: '#0c4a6e'}}>תאילנד 2026 🌴</h1>
        <div style={{background: '#0ea5e9', color: 'white', display: 'inline-block', padding: '5px 15px', borderRadius: '999px', marginTop: '10px', fontWeight: 'bold'}}>
          📍 {data.location}
        </div>
      </div>

      {/* תמונה יומית */}
      {imgUrl && (
        <div style={{borderRadius: '20px', overflow: 'hidden', border: '4px solid white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', marginBottom: '20px'}}>
          <img src={imgUrl} alt="Daily" style={{width: '100%', height: 'auto', display: 'block'}} />
        </div>
      )}

      {/* גריד מדדים */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
        {/* שייקים */}
        <div style={{background: 'white', padding: '15px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold'}}>שייקים 🥥</div>
          <div style={{fontSize: '2.5rem', fontWeight: '900', color: '#f97316', lineHeight: 1}}>{data.shakes}</div>
        </div>
        {/* מסאז' */}
        <div style={{background: '#10b981', padding: '15px', borderRadius: '20px', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.9}}>מסאז' יומי 💆‍♂️</div>
          <div style={{fontSize: '1.1rem', fontWeight: 'bold'}}>{data.massage || '-'}</div>
        </div>
      </div>

      {/* ברים של פאן וקיטורים */}
      <div style={{background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
        
        {/* פאן */}
        <div style={{marginBottom: '15px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px'}}>
            <span>מדד ה-FUN 🥳</span>
            <span style={{color: '#22c55e'}}>{data.fun}/10</span>
          </div>
          <div style={{height: '10px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${parseInt(data.fun) * 10}%`, background: '#22c55e', transition: 'width 1s'}}></div>
          </div>
        </div>

        {/* קיטורים */}
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px'}}>
            <span>מדד הקיטורים 😫</span>
            <span style={{color: '#ef4444'}}>{data.moan}/10</span>
          </div>
          <div style={{height: '10px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${parseInt(data.moan) * 10}%`, background: '#ef4444', transition: 'width 1s'}}></div>
          </div>
        </div>

      </div>

      {/* ציטוטים */}
      {(data.funny || data.weird) && (
        <div style={{marginTop: '20px', background: '#1e293b', color: 'white', padding: '20px', borderRadius: '20px'}}>
          {data.funny && <p style={{fontStyle: 'italic', margin: '0 0 10px 0'}}>"{data.funny}"</p>}
          {data.weird && <p style={{fontSize: '0.8rem', color: '#94a3b8', margin: 0}}>👀 מוזר: {data.weird}</p>}
        </div>
      )}

    </div>
  );
};

export default Dashboard;
