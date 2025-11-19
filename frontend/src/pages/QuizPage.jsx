import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomSelect from '../components/CustomSelect';

function QuizPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    category: '',
    region: '',
    type: 'all',
    size: 10,
  });

  const categoryOptions = [
    { value: '', label: 'جميع الفئات' },
    { value: 'Traditional Food', label: 'Traditional Food' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Festivals', label: 'Festivals' },
    { value: 'Music & Dance', label: 'Music & Dance' },
    { value: 'Architecture', label: 'Architecture' },
    { value: 'Customs & Traditions', label: 'Customs & Traditions' },
    { value: 'History', label: 'History' },
    { value: 'Geography', label: 'Geography' },
  ];

  const regionOptions = [
    { value: '', label: 'جميع المناطق' },
    { value: 'GENERAL', label: 'عام' },
    { value: 'WEST', label: 'الغربية' },
    { value: 'EAST', label: 'الشرقية' },
    { value: 'NORTH', label: 'الشمالية' },
    { value: 'SOUTH', label: 'الجنوبية' },
    { value: 'CENTRAL', label: 'الوسطى' },
  ];

  const questionTypes = [
    { value: 'all', label: 'مختلط (كل الأنواع)' },
    { value: 'MCQ', label: 'اختيار متعدد' },
    { value: 'True/False', label: 'صح أو خطأ' },
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
              اختبر معرفتك بالثقافة السعودية
            </h1>
            <p className="text-3xl text-light">
              اختر تفضيلاتك وابدأ التحدي
            </p>
          </div>

          {/* Configuration Form */}
          <div className="bg-secondary rounded-2xl shadow-xl p-8 mb-8">
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-primary font-bold mb-3 text-lg">
                الفئة (اختياري)
              </label>
              <CustomSelect
                value={config.category}
                onChange={(value) => setConfig({ ...config, category: value })}
                options={categoryOptions}
                placeholder="جميع الفئات"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

          {/* Back Link */}
          <div className="text-center mt-12">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg"
            >
              العودة للصفحة الرئيسية
            </a>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default QuizPage;
