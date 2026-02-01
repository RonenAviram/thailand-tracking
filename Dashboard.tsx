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
  dailyImage: string;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<TravelData | null>(null);
  const [totalShakes, setTotalShakes] = useState(0);

  // הקישור המעודכן והסופי שלך
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWIO-PFUSmBMbPAJ4mLvzCx8f6xy_Qqiy890CUKtd1CArENuFdKxryHP2G0q_Rx97u8nb59TdSFfCT/pub?output=csv';

  // פונקציה להצגת תמונה מקישור של גוגל דרייב
  const formatDriveUrl = (url: string) => {
    if (!url || !url.includes('id=')) return url;
    const id = url.split('id=')[1]?.split('&')[0];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  };

  useEffect(() => {
    const fetchData = () => {
      Papa.parse(CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rawData = results.data as any[];
          // סינון שורות ריקות
          const cleanData = rawData.filter(row => row['חותמת זמן'] || row['Timestamp']);
          
          if (cleanData.length > 0) {
            const latest = cleanData[cleanData.length - 1];
            
            setData({
              timestamp: latest['חותמת זמן'] || latest['Timestamp'],
              location: latest['איפה אנחנו'] || 'בתאילנד',
              funIndex: parseInt(latest['מדד ה-FUN']) || 0,
              moanIndex: parseInt(latest['מדד הקיטורים היומי']) || 0,
              shakes: parseInt(latest['כמה שייקים שתינו היום']) || 0,
              massage: latest['מי עשו היום מסאז\'?'] || 'אף אחד',
              funny: latest['הדבר הכי מצחיק שקרה היום'] || '',
              weird: latest['הדבר הכי מוזר שראינו היום'] || '',
              dailyImage: formatDriveUrl(latest['התמונה היומית'] || '')
            });

            const total = cleanData.reduce((acc, curr) => 
              acc + (parseInt(curr['כמה שייקים שתינו היום']) || 0), 0);
            setTotalShakes(total);
          }
        },
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // רענון כל 30 שניות
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="text-center animate-bounce">
        <span className="text-4xl">🥥</span>
        <p className="mt-4 text-slate-500 font-bold">טוען נתונים ממשפחת אבירם...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-right" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* כותרת */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900 leading-tight">המסע לתאילנד 2026 🌴</h1>
          <div className="inline-block bg-sky-500 text-white px-6 py-1 rounded-full font-bold shadow-lg">
            📍 {data.location}
          </div>
        </header>

        {/* התמונה היומית */}
        {data.dailyImage && (
          <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden group">
            <div className="relative">
              <img 
                src={data.dailyImage} 
                alt="התמונה היומית" 
                className="w-full h-80 object-cover rounded-[1.8rem]"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg">
                התמונה היומית 📸
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* שייקים */}
          <div className="bg-white p-6 rounded-[2rem] shadow-xl text-center border-b-8 border-orange-400">
            <span className="text-slate-400 font-bold text-[10px] block mb-1 uppercase">שייקים היום 🥥</span>
            <div className="text-5xl font-black text-orange-500">{data.shakes}</div>
            <div className="text-slate-400 text-[10px] mt-1">סה"כ: <span className="text-orange-600 font-bold">{totalShakes}</span></div>
          </div>

          {/* מסאז' */}
          <div className="bg-emerald-500 p-6 rounded-[2rem] shadow-xl text-white text-center flex flex-col justify-center overflow-hidden">
            <span className="text-emerald-100 font-bold text-[10px] block mb-1 uppercase">מסאז' יומי 💆‍♂️</span>
            <div className="text-xl font-bold truncate">{data.massage}</div>
          </div>
        </div>

        {/* מדדים */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2 font-bold text-sm">
              <span className="text-slate-500">מדד ה-FUN 🥳</span>
              <span className="text-green-500 text-lg">{data.funIndex}/10</span>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-50">
              <div className="bg-green-500 h-full transition-all duration-1000" style={{width: `${data.funIndex * 10}%`}}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 font-bold text-sm">
              <span className="text-slate-500">מדד הקיטורים 😫</span>
              <span className="text-red-500 text-lg">{data.moanIndex}/10</span>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-50">
              <div className="bg-red-500 h-full transition-all duration-1000" style={{width: `${data.moanIndex * 10}%`}}></div>
            </div>
          </div>
        </div>

        {/* פנינים וחוכמות */}
        {(data.funny || data.weird) && (
          <div className="bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white">
            <div className="relative z-10 space-y-4">
              {data.funny && (
                <div className="border-r-4 border-yellow-400 pr-4 italic text-xl leading-relaxed">
                  "{data.funny}"
                </div>
              )}
              {data.weird && (
                <div className="text-sky-300 text-sm font-medium pr-4">
                  👀 משהו מוזר שראינו: {data.weird}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
      <footer className="text-center mt-12 text-slate-300 text-[10px] uppercase tracking-widest">
        Family Journey Tracker • Built for Neria & Ronen
      </footer>
    </div>
  );
};

export default Dashboard;
