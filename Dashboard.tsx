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
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const rawData = results.data as any[];
        // ניקוי שורות ריקות
        const cleanData = rawData.filter(row => row['חותמת זמן']);
        
        if (cleanData.length > 0) {
          const latest = cleanData[cleanData.length - 1];
          
          // מיפוי הנתונים לפי השמות המדויקים בגיליון שלך
          setData({
            timestamp: latest['חותמת זמן'],
            location: latest['איפה אנחנו'] || 'בתנועה...',
            funIndex: parseInt(latest['מדד הפאן היום']) || 0,
            moanIndex: parseInt(latest['מדד הקיטורים היומי']) || 0,
            shakes: parseInt(latest['כמה שייקים שתינו היום']) || 0,
            massage: latest['מי עשו היום מסאז\'?'] || 'אף אחד...',
            funny: latest['הדבר הכי מצחיק שקרה היום'] || '',
            weird: latest['הדבר הכי מוזר שראינו'] || ''
          });

          // חישוב סה"כ שייקים
          const total = cleanData.reduce((acc, curr) => acc + (parseInt(curr['כמה שייקים שתינו היום']) || 0), 0);
          setTotalShakes(total);
        }
      },
    });
  }, []);

  if (!data) return <div className="text-center p-10 font-sans">טוען את החופשה בתאילנד... 🌴</div>;

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-8 font-sans" dir="rtl">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-sky-800">תאילנד 2026 | יומן מסע</h1>
        <p className="text-sky-600">משפחת אבירם נהנית (ומקטרת)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        
        {/* כרטיסיית שייקים */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-orange-400">
          <h2 className="text-gray-500 text-sm">כמה שייקים היום? 🥥</h2>
          <div className="text-5xl font-black text-orange-500">{data.shakes}</div>
          <p className="text-xs text-gray-400 mt-2">סה"כ עד כה: {totalShakes}</p>
        </div>

        {/* כרטיסיית מיקום */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-sky-400">
          <h2 className="text-gray-500 text-sm">איפה אנחנו? 📍</h2>
          <div className="text-2xl font-bold text-sky-800 mt-2">{data.location}</div>
          <p className="text-xs text-gray-400 mt-2">מעודכן ל: {data.timestamp}</p>
        </div>

        {/* מדדי פאן וקיטורים */}
        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-gray-500 text-sm mb-4">מדד הפאן (1-10) 🥳</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-green-500 h-4 rounded-full transition-all" style={{width: `${data.funIndex * 10}%`}}></div>
          </div>
          <div className="text-left text-xs font-bold mt-1 text-green-600">{data.funIndex}/10</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-gray-500 text-sm mb-4">מדד הקיטורים (1-10) 😫</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-red-500 h-4 rounded-full transition-all" style={{width: `${data.moanIndex * 10}%`}}></div>
          </div>
          <div className="text-left text-xs font-bold mt-1 text-red-600">{data.moanIndex}/10</div>
        </div>

        {/* מסאז' */}
        <div className="bg-white p-6 rounded-3xl shadow-lg md:col-span-2 border-r-4 border-emerald-400">
          <h2 className="text-gray-500 text-sm">מי עשו היום מסאז'? 💆‍♂️</h2>
          <div className="text-lg font-medium text-emerald-800 mt-1">{data.massage}</div>
        </div>

        {/* ציטוטים */}
        {(data.funny || data.weird) && (
          <div className="bg-sky-100 p-6 rounded-3xl shadow-inner md:col-span-2 italic text-sky-900">
            {data.funny && <p className="mb-2">" {data.funny} "</p>}
            {data.weird && <p className="text-sm text-sky-700">- ראינו גם: {data.weird}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
