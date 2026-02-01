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
          // מסננים שורות ריקות לפי חותמת זמן
          const cleanData = rawData.filter(row => row['חותמת זמן']);
          
          if (cleanData.length > 0) {
            const latest = cleanData[cleanData.length - 1];
            
            // מיפוי שמות העמודות בדיוק לפי הגיליון שלכם
            setData({
              timestamp: latest['חותמת זמן'],
              location: latest['איפה אנחנו'] || 'בתנועה...',
              funIndex: parseInt(latest['מדד ה-FUN']) || 0,
              moanIndex: parseInt(latest['מדד הקיטורים היומי']) || 0,
              shakes: parseInt(latest['כמה שייקים שתינו היום']) || 0,
              massage: latest['מי עשו היום מסאז\'?'] || 'אף אחד...',
              funny: latest['הדבר הכי מצחיק שקרה היום'] || '',
              weird: latest['הדבר הכי מוזר שראינו היום'] || ''
            });

            // חישוב סה"כ שייקים מצטבר
            const total = cleanData.reduce((acc, curr) => acc + (parseInt(curr['כמה שייקים שתינו היום']) || 0), 0);
            setTotalShakes(total);
          }
        },
      });
    };

    fetchData();
    // רענון אוטומטי כל 5 דקות אם הדף פתוח
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-center p-10 font-sans">טוען את החופשה של משפחת אבירם... 🌴</div>;

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-8 font-sans" dir="rtl">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-black text-sky-900 mb-2">תאילנד 2026 🇹🇭</h1>
        <p className="text-sky-600 font-medium text-lg">נריה, רונן והילדים בדרכים</p>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* כרטיס שייקים - המדד הכי חשוב */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-8 border-orange-400 text-center">
          <span className="text-gray-400 text-sm font-bold block mb-1">שייקים היום 🥥</span>
          <div className="text-6xl font-black text-orange-500 mb-2">{data.shakes}</div>
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold">
            סה"כ בטיול: {totalShakes}
          </div>
        </div>

        {/* כרטיס מיקום */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-8 border-sky-400 text-center flex flex-col justify-center">
          <span className="text-gray-400 text-sm font-bold block mb-1">איפה אנחנו? 📍</span>
          <div className="text-3xl font-black text-sky-800 leading-tight">{data.location}</div>
          <div className="text-gray-400 text-[10px] mt-4 italic">עדכון אחרון: {data.timestamp}</div>
        </div>

        {/* מדד פאן (FUN) */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-bold text-sm">מדד ה-FUN 🥳</span>
            <span className="text-green-600 font-black">{data.funIndex}/10</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden border border-gray-100">
            <div 
              className="bg-gradient-to-l from-green-400 to-green-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${data.funIndex * 10}%` }}
            ></div>
          </div>
        </div>

        {/* מדד קיטורים */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-bold text-sm">מדד הקיטורים 😫</span>
            <span className="text-red-600 font-black">{data.moanIndex}/10</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden border border-gray-100">
            <div 
              className="bg-gradient-to-l from-red-400 to-red-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${data.moanIndex * 10}%` }}
            ></div>
          </div>
        </div>

        {/* מסאז' יומי */}
        <div className="bg-emerald-50 p-6 rounded-[2rem] shadow-md md:col-span-2 border-r-8 border-emerald-400">
          <span className="text-emerald-700 text-sm font-bold block mb-1">מי עשו היום מסאז'? 💆‍♂️</span>
          <div className="text-xl font-bold text-emerald-900">{data.massage}</div>
        </div>

        {/* פיד פנינים וציטוטים */}
        <div className="md:col-span-2 space-y-4 pt-4">
          <h3 className="text-sky-900 font-black text-xl mr-2">הפנינים של הטיול ✨</h3>
          
          {data.funny && (
            <div className="bg-white p-5 rounded-2xl shadow-md border-r-4 border-yellow-400 relative">
              <span className="absolute -top-3 right-4 bg-yellow-400 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">משהו מצחיק</span>
              <p className="text-gray-800 text-lg leading-relaxed">"{data.funny}"</p>
            </div>
          )}

          {data.weird && (
            <div className="bg-white p-5 rounded-2xl shadow-md border-r-4 border-purple-400 relative">
              <span className="absolute -top-3 right-4 bg-purple-400 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">משהו מוזר</span>
              <p className="text-gray-600 italic">"ראינו {data.weird}"</p>
            </div>
          )}
        </div>
      </div>
      
      <footer className="text-center mt-12 text-sky-300 text-xs">
        Thailand 2026 Dashboard | ❤️
      </footer>
    </div>
  );
};

export default Dashboard;
