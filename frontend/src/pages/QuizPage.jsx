import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomSelect from '../components/CustomSelect';
import HomeButton from '../components/HomeButton';

function QuizPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    language: '',
    region: '',
    type: 'all',
    size: 10,
  });

  const languageOptions = [
    { value: '', label: 'جميع اللغات' },
    { value: 'Arabic', label: 'العربية' },
    { value: 'English', label: 'English' },
  ];

  const regionOptions = [
    { value: '', label: 'جميع المناطق' },
    { value: 'general', label: 'عام' },
    { value: 'west', label: 'الغربية' },
    { value: 'east', label: 'الشرقية' },
    { value: 'north', label: 'الشمالية' },
    { value: 'south', label: 'الجنوبية' },
    { value: 'centeral', label: 'الوسطى' },
  ];

  const questionTypes = [
    { value: 'all', label: 'مختلط (كل الأنواع)' },
    { value: 'single_choice', label: 'اختيار  متعدد' },
    { value: 'multiple_choice', label: 'اختيارات متعددة' },
    { value: 'true_false', label: 'صح أو خطأ' },
    { value: 'open_ended', label: 'سؤال مفتوح' },
  ];

  const handleStart = () => {
    // Navigate to quiz taking page with config
    navigate('/quiz/take', { state: { config } });
  };

  const isValid = config.size >= 5 && config.size <= 30;

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-light mb-4">
             <br></br><br></br>
              اختبر معرفتك بالثقافة السعودية
            </h1>
            <p className="text-3xl text-light">
              اختر تفضيلاتك وابدأ التحدي
              
              
            </p>
          </div>

          {/* Configuration Form */}
          <div className="bg-secondary rounded-2xl shadow-xl p-8 mb-8">
            {/* Language Selection */}
            <div className="mb-6">
              <label className="block text-secondary font-bold mb-3 text-lg">
                اللغة (اختياري)
              </label>
              <CustomSelect
                value={config.language}
                onChange={(value) => setConfig({ ...config, language: value })}
                options={languageOptions}
                placeholder="جميع اللغات"
              />
            </div>

            {/* Region Selection */}
            <div className="mb-6">
              <label className="block text-primary font-bold mb-3 text-lg">
                المنطقة (اختياري)
              </label>
              <CustomSelect
                value={config.region}
                onChange={(value) => setConfig({ ...config, region: value })}
                options={regionOptions}
                placeholder="جميع المناطق"
              />
            </div>

            {/* Question Type */}
            <div className="mb-6">
              <label className="block text-primary font-bold mb-3 text-lg">
                نوع الأسئلة
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {questionTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setConfig({ ...config, type: type.value })}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                      config.type === type.value
                        ? 'bg-primary text-secondary border-primary'
                        : 'bg-first text-primary border-secondary hover:border-secondary'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="mb-8">
              <label className="block text-primary font-bold mb-3 text-lg">
                عدد الأسئلة: <span className="text-primary">{config.size}</span>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={config.size}
                onChange={(e) => setConfig({ ...config, size: parseInt(e.target.value) })}
                className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer accent-first "
              />
              <div className="flex justify-between text-sm text-primary mt-2">
                <span>5 أسئلة</span>
                <span>30 سؤال</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              disabled={!isValid}
              className="w-full px-8 py-4 bg-first text-primary text-xl font-bold rounded-lg hover:bg-primary hover:text-first transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              ابدأ الاختبار
            </button>
          </div>

          <HomeButton />
        </div>
      </div>
      <Footer/>
    </div>
    
  );
}

export default QuizPage;
