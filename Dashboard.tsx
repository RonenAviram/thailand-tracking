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

  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWIO-PFUSmBMbPAJ4mLvzCx8f6xy_Qqiy890CUKtd1CArENuFdKxryHP2G0q_Rx97u8nb59TdSFfCT/pub?output=csv';

  // פונקציה שהופכת לינק של גוגל דרייב לתמונה שאפשר להציג
  const formatDriveUrl = (url: string) => {
    if (!url || !url.includes('id=')) return url;
    const id = url.split('id=')[1].split('&')[0];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  };

  useEffect(() => {
    const fetchData = () => {
      Papa.parse(CSV_URL, {
        download: true,
        header: true,
        complete: (results) => {
          const rawData = results.data as any[];
          const cleanData = rawData.filter(row => row['חותמת זמן'] || row['Timestamp']);
          
          if (cleanData.length > 0) {
            const latest = cleanData[cleanData.length - 1];
            
            // לוגיקה גמישה למציאת עמודות (בודק כמה אפשרויות לשמות)
            setData({
              timestamp: latest['חותמת זמן'] || latest['Timestamp'],
              location: latest['איפה אנחנו'] || 'בתאילנד...',
              funIndex: parseInt(latest['מדד ה-FUN'] || latest['מדד FUN'] || latest['FUN']) || 0,
              moanIndex: parseInt(latest['מדד הקיטורים היומי'] || latest['מדד הקיטורים']) || 0,
              shakes: parseInt(latest['כמה שייקים שתינו היום'] || latest['שייקים']) || 0,
              massage: latest['מי עשו היום מסאז\'?'] || 'אף אחד',
              funny: latest['הדבר הכי מצחיק שקרה היום'] || '',
              weird: latest['הדבר הכי מוזר שראינו היום'] || '',
              dailyImage: formatDriveUrl(latest['התמונה היומית'] || latest['תמונה'])
            });

            const total = cleanData.reduce((acc, curr) => 
              acc + (parseInt(curr['כמה שייקים שתינו היום'] || curr['שייקים']) || 0), 0);
            setTotalShakes(total);
          }
        },
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-center p-20 font-sans">מעדכן נתונים מצ'יאנג מאי... 🥥</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-right" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-black text-slate-900">משפחת אבירם בתאילנד</h1>
          <div className="inline-flex items-center bg-sky-500 text-white px-6 py-2 rounded-full font-bold shadow-lg">
            <span className="ml-2">📍</span> {data.location}
          </div>
        </header>

        {/* התמונה היומית */}
        {data.dailyImage && (
          <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white">
            <div className="relative">
              <img 
                src={data.dailyImage} 
                alt="התמונה היומית" 
                className="w-full h-96 object-cover rounded-[2rem]"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-sm font-bold">
                התמונה היומית 📸
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* שייקים */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border-b-8 border-orange-400">
            <span className="text-slate-400 font-bold text-sm block mb-2">שייקים היום 🥥</span>
            <div className="text-7xl font-black text-orange-500">{data.shakes}</div>
            <div className="mt-2 text-slate-500 font-medium italic">סה"כ בטיול: {totalShakes}</div>
          </div>

          {/* מסאז' */}
          <div className="bg-emerald-500 p-8 rounded-[2.5rem] shadow-xl text-white text-center flex flex-col justify-center">
            <span className="text-emerald-100 font-bold text-sm block mb-2">מי עשו היום מסאז'? 💆‍♂️</span>
            <div className="text-3xl font-black">{data.massage}</div>
          </div>

          {/* מדד פאן */}
          <div className="bg-white p-6 rounded-[2rem] shadow-lg">
            <div className="flex justify-between items-center mb-4 font-bold text-slate-600">
              <span>מדד ה-FUN 🥳</span>
              <span className="text-green-500 text-xl">{data.funIndex}/10</span>
            </div>
            <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden border-2 border-slate-50">
              <div className="bg-green-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{width: `${data.funIndex * 10}%`}}></div>
            </div>
          </div>

          {/* מדד קיטורים */}
          <div className="bg-white p-6 rounded-[2rem] shadow-lg">
            <div className="flex justify-between items-center mb-4 font-bold text-slate-600">
              <span>מדד הקיטורים 😫</span>
              <span className="text-red-500 text-xl">{data.moanIndex}/10</span>
            </div>
            <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden border-2 border-slate-50">
              <div className="bg-red-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{width: `${data.moanIndex * 10}%`}}></div>
            </div>
          </div>
        </div>

        {/* פנינים */}
        {(data.funny || data.weird) && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-4 border-r-8 border-sky-300">
            {data.funny && (
              <div className="relative">
                <span className="text-4xl absolute -top-4 -right-2 opacity-20 italic font-serif">"</span>
                <p className="text-slate-800 text-xl font-medium pr-4 italic leading-relaxed">{data.funny}</p>
              </div>
            )}
            {data.weird && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-sky-500 font-bold text-xs block mb-1">משהו מוזר שראינו:</span>
                <p className="text-slate-600">{data.weird}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
