import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              تعلم عن الثقافة السعودية
            </h1>
            <p className="text-xl text-gray-600">
              اكتشف التراث الغني والعادات والتقاليد السعودية
            </p>
          </div>

          {/* Learning Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">قريباً...</h2>
            <p className="text-gray-600 text-lg">
              جاري العمل على محتوى التعليم. ستجد هنا قريباً:
            </p>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <span className="text-saudi-green text-2xl">✓</span>
                معلومات شاملة عن الثقافة السعودية
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saudi-green text-2xl">✓</span>
                شرح للعادات والتقاليد في مختلف المناطق
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saudi-green text-2xl">✓</span>
                تعرف على الأطعمة التقليدية والملابس التراثية
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saudi-green text-2xl">✓</span>
                معلومات عن المهرجانات والفعاليات الثقافية
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saudi-green text-2xl">✓</span>
                صور وفيديوهات توضيحية
              </li>
            </ul>
          </div>

          {/* Back Button */}
          <div className="text-center mt-12">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-secondary text-light font-bold rounded-lg hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg"
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

export default LearnPage;
