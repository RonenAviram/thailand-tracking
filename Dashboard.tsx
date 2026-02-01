import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface TravelData {
  timestamp: string;
  location: string;
  funIndex: number;
  moanIndex: number;
  shakes: number;
  massage: string;
  funny: string;
  weird: string;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<TravelData | null>(null);
  const [totalShakes, setTotalShakes] = useState(0);

  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWIO-PFUSmBMbPAJ4mLvzCx8f6xy_Qqiy890CUKtd1CArENuFdKxryHP2G0q_Rx97u8nb59TdSFfCT/pub?output=csv';

  useEffect(() => {
    const fetchData = () => {
      Papa.parse(CSV_URL, {
        download: true,
        header: true,
        complete: (results) => {
          const rawData = results.data as any[];
          const cleanData = rawData.filter(row => row['חותמת זמן']);
          
          if (cleanData.length > 0) {
            const latest = cleanData[cleanData.length - 1];
            
            // מיפוי מדויק לפי צילום המסך של הגיליון שלך
            setData({
              timestamp: latest['חותמת זמן'],
              location: latest['איפה אנחנו'] || 'בתאילנד...',
              funIndex: parseInt(latest['מדד ה-FUN']) || 0, // תיקון לפורמט הגיליון
              moanIndex: parseInt(latest['מדד הקיטורים היומי']) || 0,
              shakes: parseInt(latest['כמה שייקים שתינו היום']) || 0,
              massage: latest['מי עשו היום מסאז\'?'] || 'אף אחד',
              funny: latest['הדבר הכי מצחיק שקרה היום'] || '',
              weird: latest['הדבר הכי מוזר שראינו היום'] || ''
            });

            const total = cleanData.reduce((acc, curr) => acc + (parseInt(curr['כמה שייקים שתינו היום']) || 0), 0);
            setTotalShakes(total);
          }
        },
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // רענון כל 30 שניות
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-center p-20 font-sans">מעדכן נתונים מצ'יאנג מאי... 🥥</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* כותרת ומיקום */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900">המסע לתאילנד 2026</h1>
          <div className="inline-block bg-sky-500 text-white px-6 py-2 rounded-full font-bold shadow-lg">
            📍 {data.location}
          </div>
        </div>

        {/* שייקים */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border-b-8 border-orange-400">
          <h2 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">שייקים היום</h2>
          <div className="text-7xl font-black text-orange-500 mb-2">{data.shakes}</div>
          <div className="text-slate-400 font-medium">סה"כ בטיול: <span className="text-orange-600 font-bold">{totalShakes}</span></div>
        </div>

        {/* מדדים זוגיים */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* פאן */}
          <div className="bg-white p-6 rounded-[2rem] shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-end mb-4">
              <span className="text-3xl">🥳</span>
              <div className="text-right">
                <div className="text-slate-400 text-xs font-bold">מדד ה-FUN</div>
                <div className="text-3xl font-black text-green-500">{data.funIndex}/10</div>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full">
              <div className="bg-green-500 h-4 rounded-full transition-all duration-1000" style={{width: `${data.funIndex * 10}%`}}></div>
            </div>
          </div>

          {/* קיטורים */}
          <div className="bg-white p-6 rounded-[2rem] shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-end mb-4">
              <span className="text-3xl">😫</span>
              <div className="text-right">
                <div className="text-slate-400 text-xs font-bold">מדד הקיטורים</div>
                <div className="text-3xl font-black text-red-500">{data.moanIndex}/10</div>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full">
              <div className="bg-red-500 h-4 rounded-full transition-all duration-1000" style={{width: `${data.moanIndex * 10}%`}}></div>
            </div>
          </div>
        </div>

        {/* מסאז' וציטוטים */}
        <div className="bg-emerald-500 p-6 rounded-[2rem] shadow-lg text-white">
          <div className="text-emerald-100 text-xs font-bold mb-1">מי עשו היום מסאז'? 💆‍♂️</div>
          <div className="text-2xl font-bold">{data.massage}</div>
        </div>

        {(data.funny || data.weird) && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 mr-2">עדכונים מהשטח ✨</h3>
            {data.funny && (
              <div className="bg-white p-6 rounded-2xl shadow-md border-r-8 border-yellow-400">
                <p className="text-slate-800 text-lg italic">"{data.funny}"</p>
              </div>
            )}
            {data.weird && (
              <div className="bg-slate-800 p-6 rounded-2xl shadow-md text-slate-200">
                <div className="text-sky-400 text-xs font-bold mb-2">ראינו משהו מוזר...</div>
                <p>{data.weird}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
