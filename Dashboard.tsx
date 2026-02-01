import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [debugRow, setDebugRow] = useState<any>(null); // כדי שנראה מה המחשב רואה

  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWIO-PFUSmBMbPAJ4mLvzCx8f6xy_Qqiy890CUKtd1CArENuFdKxryHP2G0q_Rx97u8nb59TdSFfCT/pub?output=csv';

  useEffect(() => {
    const fetchData = () => {
      fetch(`${CSV_URL}&t=${Date.now()}`)
        .then(res => res.text())
        .then(csvText => {
          Papa.parse(csvText, {
            header: false, // מתעלמים מכותרות
            skipEmptyLines: true, // מדלגים על שורות ריקות לגמרי
            complete: (results) => {
              const rows = results.data as any[];
              
              // התיקון הלוגי: מסננים שורות שאין בהן תאריך (טור 0) או מיקום (טור 1)
              // זה מונע מהקוד לקחת שורה ריקה בסוף הגיליון
              const validRows = rows.filter(row => row[0] && row[1] && row[0] !== 'חותמת זמן');

              if (validRows.length > 0) {
                const lastRow = validRows[validRows.length - 1];
                setDebugRow(lastRow); // שומרים את השורה הגולמית להצגה

                setData({
                  location: lastRow[1],
                  fun: parseInt(lastRow[2]) || 0, // המרה בטוחה למספר
                  moan: parseInt(lastRow[3]) || 0,
                  shakes: parseInt(lastRow[4]) || 0,
                  massage: lastRow[5],
                  funny: lastRow[6],
                  weird: lastRow[7],
                  image: lastRow[8]
                });
              }
            }
          });
        })
        .catch(err => console.error(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-center p-10">טוען...</div>;

  const getImg = (url: string) => {
    if (!url || !url.includes('id=')) return null;
    return `https://drive.google.com/uc?export=view&id=${url.split('id=')[1].split('&')[0]}`;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800 pb-20">
      
      {/* כותרת */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-black text-slate-900">תאילנד 2026 🇹🇭</h1>
        <div className="inline-block bg-sky-500 text-white px-4 py-1 rounded-full text-sm font-bold mt-2">
          📍 {data.location}
        </div>
      </header>

      {/* תמונה */}
      {getImg(data.image) && (
        <div className="mb-6 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
          <img src={getImg(data.image)} className="w-full h-auto block" alt="Daily" />
        </div>
      )}

      {/* מדדים */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-lg text-center border-b-4 border-orange-400">
          <div className="text-xs font-bold text-slate-400">שייקים 🥥</div>
          <div className="text-4xl font-black text-orange-500">{data.shakes}</div>
        </div>
        <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg text-center text-white flex flex-col justify-center">
          <div className="text-xs font-bold opacity-80">מסאז' 💆‍♂️</div>
          <div className="text-md font-bold">{data.massage || '-'}</div>
        </div>
      </div>

      {/* ברים */}
      <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
        <div>
          <div className="flex justify-between font-bold text-sm mb-2">
            <span>FUN 🥳</span>
            <span className="text-green-500">{data.fun}/10</span>
          </div>
          <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full" style={{width: `${data.fun * 10}%`}}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between font-bold text-sm mb-2">
            <span>קיטורים 😫</span>
            <span className="text-red-500">{data.moan}/10</span>
          </div>
          <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full" style={{width: `${data.moan * 10}%`}}></div>
          </div>
        </div>
      </div>

      {/* ציטוטים */}
      {(data.funny || data.weird) && (
        <div className="mt-6 bg-slate-800 text-white p-5 rounded-2xl shadow-lg">
          <p className="italic">"{data.funny}"</p>
          {data.weird && <p className="text-xs text-slate-400 mt-2">מוזר: {data.weird}</p>}
        </div>
      )}

      {/* איזור דיבאג - זה יגלה לנו את האמת */}
      <div className="mt-10 p-4 bg-gray-200 rounded-lg text-left ltr text-xs font-mono break-all border-2 border-red-500">
        <p className="font-bold text-red-600 mb-2">DEBUG INFO (מה באמת מגיע):</p>
        {JSON.stringify(debugRow, null, 2)}
      </div>

    </div>
  );
};

export default Dashboard;
