import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  
  // שימוש ב-AllOrigins כדי לעקוף את החסימה של גוגל במובייל
  const GOOGLE_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWIO-PFUSmBMbPAJ4mLvzCx8f6xy_Qqiy890CUKtd1CArENuFdKxryHP2G0q_Rx97u8nb59TdSFfCT/pub?output=csv';
  const PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(GOOGLE_CSV)}`;

  useEffect(() => {
    const fetchData = () => {
      // הוספת timestamp כדי למנוע Cache
      fetch(`${PROXY_URL}&t=${Date.now()}`)
        .then(res => res.text())
        .then(csvText => {
          Papa.parse(csvText, {
            header: false, // מתעלמים מכותרות בעברית
            skipEmptyLines: true,
            complete: (results) => {
              const rows = results.data as any[];
              if (rows.length > 1) {
                // לוקחים תמיד את השורה האחרונה
                const lastRow = rows[rows.length - 1];
                
                setData({
                  location: lastRow[1], // עמודה B
                  fun: lastRow[2],      // עמודה C
                  moan: lastRow[3],     // עמודה D
                  shakes: lastRow[4],   // עמודה E
                  massage: lastRow[5],  // עמודה F
                  funny: lastRow[6],    // עמודה G
                  weird: lastRow[7],    // עמודה H
                  image: lastRow[8]     // עמודה I
                });
              }
            }
          });
        })
        .catch(console.error);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-sans">
      <div className="text-center animate-pulse">
        <div className="text-4xl mb-2">🥥</div>
        <div>טוען נתונים מתאילנד...</div>
      </div>
    </div>
  );

  const getImg = (url: string) => {
    if (!url || !url.includes('id=')) return null;
    return `https://drive.google.com/uc?export=view&id=${url.split('id=')[1].split('&')[0]}`;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">תאילנד 2026 🇹🇭</h1>
        <span className="inline-block bg-sky-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
          📍 {data.location}
        </span>
      </header>

      {getImg(data.image) && (
        <div className="mb-6 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
          <img src={getImg(data.image)} className="w-full h-auto block" alt="Daily" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-lg text-center border-b-4 border-orange-400">
          <div className="text-xs font-bold text-slate-400 uppercase mb-1">שייקים 🥥</div>
          <div className="text-5xl font-black text-orange-500 leading-none">{data.shakes}</div>
        </div>
        <div className="bg-emerald-500 p-6 rounded-[2rem] shadow-lg text-center text-white flex flex-col justify-center">
          <div className="text-xs font-bold opacity-80 uppercase mb-1">מסאז' יומי 💆‍♂️</div>
          <div className="text-lg font-bold leading-tight">{data.massage || '-'}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-lg space-y-5">
        <div>
          <div className="flex justify-between font-bold text-sm mb-2">
            <span>מדד ה-FUN 🥳</span>
            <span className="text-green-500">{data.fun}/10</span>
          </div>
          <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full transition-all duration-1000" style={{width: `${data.fun * 10}%`}}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between font-bold text-sm mb-2">
            <span>מדד הקיטורים 😫</span>
            <span className="text-red-500">{data.moan}/10</span>
          </div>
          <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full transition-all duration-1000" style={{width: `${data.moan * 10}%`}}></div>
          </div>
        </div>
      </div>

      {(data.funny || data.weird) && (
        <div className="mt-6 bg-slate-800 text-white p-6 rounded-[2rem] shadow-xl">
          {data.funny && <p className="italic text-lg mb-2">"{data.funny}"</p>}
          {data.weird && <p className="text-sm text-slate-400">👀 מוזר: {data.weird}</p>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
