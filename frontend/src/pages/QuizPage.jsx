import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, MapPin, Languages, ListFilter, Play, ArrowRight } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';

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
    { value: 'single_choice', label: 'اختيار متعدد' },
    { value: 'multiple_choice', label: 'اختيارات متعددة' },
    { value: 'true_false', label: 'صح أو خطأ' },
    { value: 'open_ended', label: 'سؤال مفتوح' },
  ];

  const handleStart = () => {
    navigate('/quiz/take', { state: { config } });
  };

  const isValid = config.size >= 5 && config.size <= 30;

  return (
    <div className="min-h-screen bg-cream dark:bg-coffee-dark font-arabic transition-colors duration-300">
      <Navbar />

      <div className="container mx-auto px-4 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center p-4 bg-white dark:bg-coffee-light rounded-full shadow-md mb-6 transition-colors duration-300"
            >
              <Settings className="w-10 h-10 text-clay dark:text-gold" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-coffee dark:text-cream mb-4 transition-colors duration-300">
              إعدادات الاختبار
            </h1>
            <p className="text-xl text-olive dark:text-sand/60 max-w-2xl mx-auto transition-colors duration-300">
              قم بتخصيص تجربتك. اختر المنطقة، نوع الأسئلة، وعددها لتبدأ التحدي.
            </p>
          </div>

          {/* Configuration Card */}
          <Card className="p-8 md:p-10 border-sand dark:border-coffee-dark shadow-2xl bg-white/80 dark:bg-coffee-light/80 backdrop-blur-sm transition-colors duration-300">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Language Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-coffee dark:text-sand font-bold transition-colors duration-300">
                  <Languages className="w-5 h-5 text-clay dark:text-gold" />
                  <label>اللغة</label>
                </div>
                <Select
                  value={config.language}
                  onChange={(e) => setConfig({ ...config, language: e.target.value })}
                  options={languageOptions}
                />
              </div>

              {/* Region Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-coffee dark:text-sand font-bold transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-clay dark:text-gold" />
                  <label>المنطقة</label>
                </div>
                <Select
                  value={config.region}
                  onChange={(e) => setConfig({ ...config, region: e.target.value })}
                  options={regionOptions}
                />
              </div>
            </div>

            {/* Question Type */}
            <div className="mb-10 space-y-4">
              <div className="flex items-center gap-2 text-coffee dark:text-sand font-bold transition-colors duration-300">
                <ListFilter className="w-5 h-5 text-clay dark:text-gold" />
                <label>نوع الأسئلة</label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {questionTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setConfig({ ...config, type: type.value })}
                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${
                      config.type === type.value
                        ? 'bg-clay text-white border-clay shadow-md scale-105 dark:bg-gold dark:text-coffee-dark dark:border-gold'
                        : 'bg-white text-olive border-sand hover:border-clay/50 hover:bg-sand/20 dark:bg-coffee-light dark:text-sand/60 dark:border-coffee-dark dark:hover:border-gold/50 dark:hover:bg-coffee-dark/50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions Slider */}
            <div className="mb-12 space-y-6">
              <div className="flex justify-between items-center text-coffee dark:text-sand font-bold transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <ListFilter className="w-5 h-5 text-clay dark:text-gold" />
                  <label>عدد الأسئلة</label>
                </div>
                <span className="px-4 py-1 bg-sand/50 dark:bg-coffee-dark rounded-lg text-clay dark:text-gold text-xl transition-colors duration-300">
                  {config.size}
                </span>
              </div>
              
              <div className="px-2">
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={config.size}
                  onChange={(e) => setConfig({ ...config, size: parseInt(e.target.value) })}
                  className="w-full h-3 bg-sand dark:bg-coffee-dark rounded-lg appearance-none cursor-pointer accent-clay dark:accent-gold hover:accent-saudi-green dark:hover:accent-cream transition-all"
                />
                <div className="flex justify-between text-sm text-olive dark:text-sand/50 mt-3 font-medium transition-colors duration-300">
                  <span>5 أسئلة</span>
                  <span>30 سؤال</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 border-t border-sand/50 dark:border-coffee-dark pt-8 transition-colors duration-300">
              <Button 
                onClick={() => navigate('/')} 
                variant="ghost" 
                className="order-2 md:order-1"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleStart}
                disabled={!isValid}
                className="flex-1 order-1 md:order-2 py-4 text-lg"
                size="lg"
              >
                <span className="ml-2">ابدأ التحدي</span>
                <ArrowRight className="w-6 h-6 rtl:rotate-180" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default QuizPage;