import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiService } from '../services/api';

function QuizPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              اختبر معرفتك بالثقافة السعودية
            </h1>
            <p className="text-xl text-gray-600">
              اختر الفئة والمنطقة التي ترغب في اختبار معرفتك فيها
            </p>
          </div>

          {/* Quiz Options */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">قريباً...</h2>
            <p className="text-gray-600 text-lg">
              جاري العمل على صفحة الاختبار. ستتمكن قريباً من:
            </p>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <span className="text-saudi-green text-2xl">✓</span>
                اختيار فئة الأسئلة (الطعام التقليدي، الملابس، المهرجانات، إلخ)
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saudi-green text-2xl">✓</span>
                اختيار المنطقة (الغربية، الشرقية، الشمالية، الجنوبية، الوسطى)
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saudi-green text-2xl">✓</span>
                حل الأسئلة والحصول على النتيجة الفورية
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saudi-green text-2xl">✓</span>
                مراجعة الإجابات الصحيحة والخاطئة
              </li>
            </ul>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all duration-300"
            >
              العودة للصفحة الرئيسية
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default QuizPage;
