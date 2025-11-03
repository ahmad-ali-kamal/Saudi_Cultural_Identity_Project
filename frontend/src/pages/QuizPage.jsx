import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function QuizPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    category: '',
    region: '',
    type: 'all',
    size: 10,
  });

  const categories = [
    'Traditional Food',
    'Clothing',
    'Festivals',
    'Music & Dance',
    'Architecture',
    'Customs & Traditions',
    'History',
    'Geography',
  ];

  const regions = [
    { value: 'GENERAL', label: 'عام' },
    { value: 'WEST', label: 'الغربية' },
    { value: 'EAST', label: 'الشرقية' },
    { value: 'NORTH', label: 'الشمالية' },
    { value: 'SOUTH', label: 'الجنوبية' },
    { value: 'CENTRAL', label: 'الوسطى' },
  ];

  const questionTypes = [
    { value: 'all', label: 'مختلط (كل الأنواع)' },
    { value: 'MCQ', label: 'اختيار من متعدد' },
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
            <p className="text-xl text-light">
              اختر تفضيلاتك وابدأ التحدي
            </p>
          </div>

          {/* Configuration Form */}
          <div className="bg-light rounded-2xl shadow-xl p-8 mb-8">
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-secondary font-bold mb-3 text-lg">
                الفئة (اختياري)
              </label>
              <select
                value={config.category}
                onChange={(e) => setConfig({ ...config, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:border-secondary focus:outline-none transition-colors text-lg bg-white"
              >
                <option value="">جميع الفئات</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Selection */}
            <div className="mb-6">
              <label className="block text-secondary font-bold mb-3 text-lg">
                المنطقة (اختياري)
              </label>
              <select
                value={config.region}
                onChange={(e) => setConfig({ ...config, region: e.target.value })}
                className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:border-secondary focus:outline-none transition-colors text-lg bg-white"
              >
                <option value="">جميع المناطق</option>
                {regions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Type */}
            <div className="mb-6">
              <label className="block text-secondary font-bold mb-3 text-lg">
                نوع الأسئلة
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {questionTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setConfig({ ...config, type: type.value })}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                      config.type === type.value
                        ? 'bg-secondary text-light border-secondary'
                        : 'bg-white text-primary border-accent hover:border-secondary'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="mb-8">
              <label className="block text-secondary font-bold mb-3 text-lg">
                عدد الأسئلة: <span className="text-secondary">{config.size}</span>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={config.size}
                onChange={(e) => setConfig({ ...config, size: parseInt(e.target.value) })}
                className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-secondary"
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
              className="w-full px-8 py-4 bg-secondary text-light text-xl font-bold rounded-lg hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              ابدأ الاختبار
            </button>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-light hover:text-accent hover:underline font-semibold text-lg transition-colors"
            >
              ← العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default QuizPage;
