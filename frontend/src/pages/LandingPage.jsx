import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/home-bg.jpg"
            alt="Saudi Cultural Heritage"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <h1
            className="text-7xl md:text-8xl font-extrabold mb-6 drop-shadow-2xl"
            style={{ textShadow: '6px 9px 0px rgba(0,0,0,0.25)' }}
          >
            عزنا بطبعنا
          </h1>
          <p className="text-3xl md:text-4xl mb-12 drop-shadow-lg font-semibold">
            تبي تشوف مستواك في الثقافة السعودية ؟
          </p>
          <Link
            to="/quiz"
            className="inline-block px-12 py-5 bg-saudi-green text-white text-2xl font-bold rounded-xl hover:bg-green-700 transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-saudi-green/50"
          >
            جرب مستواك
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
            <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed text-center font-semibold">
              انغمس في عمق التراث السعودي العريق. استكشف العادات الأصيلة، والمأكولات
              التقليدية، والمهرجانات النابضة بالحياة من خلال تجارب تفاعلية وقصص مرئية
              وتحديات ثقافية ممتعة. حيث يلتقي التاريخ بالإبداع، ويُلهم التراث مستقبل
              الوطن.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Quiz Card */}
            <div className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Card Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/images/quiz-card-img.jpg"
                  alt="Saudi Traditional Dance"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Card Content */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">تحس انك سعودي؟</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6 whitespace-pre-line">
                  {`اذا تحس نفسك فاهم في\nالثقافة السعودية فــــــــــــــــــــــ`}
                </p>

                {/* CTA Button */}
                <Link
                  to="/quiz"
                  className="inline-block px-8 py-3 bg-saudi-green text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  تحدى نفسك!
                </Link>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-saudi-green to-green-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </div>

            {/* Learn Card */}
            <div className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Card Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/images/info-card-img.jpg"
                  alt="Saudi Cultural Learning"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Card Content */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">منت فاهم لثقافتنا؟</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6 whitespace-pre-line">
                  {`بسيطة!\nبنعلمك كل شي تحتاجه عن ثقافتنا\nاذا ضغطت على الزر اللي تحت`}
                </p>

                {/* CTA Button */}
                <Link
                  to="/learn"
                  className="inline-block px-8 py-3 bg-saudi-green text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  تعلم
                </Link>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-saudi-green to-green-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
