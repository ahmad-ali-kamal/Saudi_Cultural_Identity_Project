import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-primary">
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
        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
          <h1
            className="text-7xl md:text-9xl py-10 font-extrabold mb-6 bg-gradient-to-t from-green-400 to-green-1000 bg-clip-text drop-shadow-2xl text-white"
          >
            عزنا بطبعنا
          </h1>

          <p
            className="text-2xl md:text-4xl text-primary mb-12 font-semibold  drop-shadow-lg"
          >
            تبي تشوف مستواك في الثقافة السعودية ؟
          </p>
          <Link
            to="/quiz"
            className="inline-block px-10 py-8 bg-secondary text-primary text-4xl font-bold rounded-xl hover:bg-accent transition-all duration-300 hover:scale-110 shadow-2xl"
          >
            جرب مستواك
          </Link>
        </div>
      </section>
      
      {/* About Section */}
      

  {/* Decorative Divider */}
  <div
  className=" h-20 bg-sadu-pattern bg-repeat-x "
  style={{ backgroundImage: "url('/images/Sadu_decoration.jpg')" }}
>  </div>

      <section className="py-0 px-20 bg-primary">
      
        <div className="max-w-7xl mx-auto ">
         <br/><br/>
          <p className="text-3xl text-light leading-relaxed text-right font-semibold">
          انغمس في عمق التراث السعودي العريق، وتجول بين أصالته وروعة تنوعه. اكتشف العادات والتقاليد التي توارثتها الأجيال، وتعرّف على القيم التي شكّلت هوية المجتمع السعودي عبر التاريخ. عِش تجربة المأكولات الشعبية بنكهاتها الفريدة التي تحمل في كل لقمة حكاية من أرض الخير والكرم.         </p>
         <p className="text-3xl text-light leading-relaxed text-right font-semibold mt-14">
       واستمتع بالمهرجانات والاحتفالات الضخمة التي تملأ المدن والقرى حياةً وحيوية، حيث تمتزج الموسيقى الشعبية بالفنون الحرفية والرقصات الفلكلورية في مشهد يجسد الفخر والانتماء.
       </p>
       <p className="text-3xl text-light leading-relaxed text-right font-semibold mt-14">
        من خلال تجارب تفاعلية مبتكرة، وقصص مرئية نابضة بالحياة، وتحديات ثقافية ممتعة، سنأخذك في رحلة لا تُنسى عبر الزمن، رحلة يتلاقى فيها الماضي مع الحاضر، ويُلهِم فيها التراث مستقبل الوطن. فهنا، يلتقي التاريخ بالإبداع، ويزدهر الشغف بالهوية، ويولد الإلهام ليصنع غدًا أجمل.
        </p>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-28 px-6 bg-primary">
        <div className="container mx-auto max-w-9xl">
          <div className="grid md:grid-cols-2 gap-32">
            {/* Quiz Card */}
            <div className="group relative bg-secondary rounded-2xl  overflow-hidden shadow-xl ">
              {/* Card Image */}

              <div className="relative h-96 overflow-hidden">

                <img
                  src="/images/quiz-card-img.jpg"
                  alt="Saudi Traditional Dance"
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Card Content */}
              <div className="p-8">


                <h2 className="text-4xl font-bold text-primary mb-4">تحس انك سعودي؟</h2>
                <p className="text-primary text-2xl leading-relaxed mb-7">

                  اذا تحس نفسك فاهم في الثقافة السعودية
                </p>

                {/* CTA Button */}
                <Link
                  to="/quiz"


                  className="inline-block px-12 py-5 bg-primary text-secondary text-3xl font-bold rounded-lg hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg"

                >
                  تحدى نفسك!
                </Link>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-0 left-0  h-full bg-secondary "></div>
            </div>

            {/* Learn Card */}
            <div className="group relative bg-secondary rounded-2xl overflow-hidden ">
              {/* Card Image */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src="/images/info-card-img.jpg"
                  alt="Saudi Cultural Learning"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 "></div>
              </div>

              {/* Card Content */}
              <div className="p-8">

                <h2 className="text-4xl font-bold text-primary mb-4">منت فاهم لثقافتنا؟</h2>
                <p className=" text-primary text-2xl leading-relaxed mb-7">
                  بنعلمك كل شي تحتاجه عن ثقافتنا
                </p>

                {/* CTA Button */}
                <Link
                  to="/learn"
                  className="inline-block px-12 py-5 bg-primary text-secondary text-3xl font-bold rounded-lg hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  تعلم الأن
                </Link>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-0 left-0  h-full bg-secondary "></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
