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

  // פונקציה לתיקון לינק של גוגל דרייב לתצוגה ישירה
  const formatDriveUrl = (url: string) => {
    if (!url) return '';
    const id = url.split('id=')[1] || url.split('/d/')[1]?.split('/')[0];
    return id ? `https://lh3.googleusercontent.com/u/0/d/${id}` : '';
  };

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
            
            setData({
              timestamp: latest['חותמת זמן'],
              location: latest['איפה אנחנו'] || 'בתאילנד...',
              funIndex: parseInt(latest['מדד ה-FUN']) || 0,
              moanIndex: parseInt(latest['מדד הקיטורים היומי']) || 0,
              shakes: parseInt(latest['כמה שייקים שתינו היום']) || 0,
              massage: latest['מי עשו היום מסאז\'?'] || 'אף אחד',
              funny: latest['הדבר הכי מצחיק שקרה היום'] || '',
              weird: latest['הדבר הכי מוזר שראינו היום'] || '',
              dailyImage: formatDriveUrl(latest['התמונה היומית'] || '')
            });

            const total = cleanData.reduce((acc, curr) => acc + (parseInt(curr['כמה שייקים שתינו היום']) || 0), 0);
            setTotalShakes(total);
          }
        },
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-center p-20 font-sans">מעדכן נתונים... 🥥</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* כותרת */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900 leading-tight">המסע של משפחת אבירם</h1>
          <div className="inline-block bg-sky-500 text-white px-6 py-2 rounded-full font-bold shadow-md">
            📍 {data.location}
          </div>
        </div>

        {/* התמונה היומית - החלק החדש! */}
        {data.dailyImage && (
          <div className="bg-white p-3 rounded-[2.5rem] shadow-xl overflow-hidden border-4 border-white">
             <div className="relative group">
                <img 
                  src={data.dailyImage} 
                  alt="התמונה היומית" 
                  className="w-full h-80 object-cover rounded-[2rem]"
                />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  התמונה היומית 📸
                </div>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* שייקים */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border-b-8 border-orange-400">
                <h2 className="text-slate-400 font-bold text-sm mb-2">שייקים היום 🥥</h2>
                <div className="text-7xl font-black text-orange-500 mb-2">{data.shakes}</div>
                <div className="text-slate-400 text-sm">סה"כ בטיול: <span className="text-orange-600 font-bold">{totalShakes}</span></div>
            </div>

            {/* מסאז' */}
            <div className="bg-emerald-500 p-8 rounded-[2.5rem] shadow-xl text-white flex flex-col justify-center text-center">
                <h2 className="text-emerald-100 font-bold text-sm mb-2 italic">מי עשו היום מסאז'? 💆‍♂️</h2>
                <div className="text-3xl font-black">{data.massage}</div>
            </div>

            {/* פאן */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-500 font-bold">מדד ה-FUN 🥳</span>
                    <span className="text-green-500 font-black text-xl">{data.funIndex}/10</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full transition-all duration-1000" style={{width: `${data.funIndex * 10}%`}}></div>
                </div>
            </div>

            {/* קיטורים */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-500 font-bold">מדד הקיטורים 😫</span>
                    <span className="text-red-500 font-black text-xl">{data.moanIndex}/10</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full transition-all duration-1000" style={{width: `${data.moanIndex * 10}%`}}></div>
                </div>
            </div>
        </div>

        {/* ציטוטים */}
        {(data.funny || data.weird) && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-4">
            {data.funny && (
              <div className="border-r-8 border-yellow-400 pr-4">
                <p className="text-slate-800 text-xl font-medium italic">"{data.funny}"</p>
              </div>
            )}
            {data.weird && (
              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="text-xs font-bold text-sky-500 block mb-1 uppercase tracking-tighter">מוזר אבל נכון:</span>
                <p className="text-slate-600">{data.weird}</p>
              </div>
            )}
          </div>
        )}

      </div>
      <footer className="text-center mt-12 text-slate-300 text-[10px] uppercase tracking-[0.2em]">
        Family Journey Dashboard • 2026
      </footer>
    </div>
  );
};

export default Dashboard;
