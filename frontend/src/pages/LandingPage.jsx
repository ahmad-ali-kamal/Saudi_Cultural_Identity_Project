import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Trophy, BookOpen, ArrowLeft } from 'lucide-react';

function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-coffee-dark font-arabic overflow-x-hidden transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like feel */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/home-bg.jpg"
            alt="Saudi Cultural Heritage"
            className="w-full h-full object-cover scale-105"
          />
          {/* Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-cream dark:to-coffee-dark"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-6 text-white drop-shadow-xl tracking-wide"
          >
            عزنا بطبعنا
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-2xl md:text-4xl text-white/90 mb-12 font-medium drop-shadow-md max-w-3xl mx-auto leading-relaxed"
          >
            تبي تشوف مستواك في الثقافة السعودية؟
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/quiz"
              className="group inline-flex items-center gap-3 px-10 py-6 bg-clay text-white text-2xl md:text-3xl font-bold rounded-2xl shadow-lg hover:bg-saudi-green transition-all duration-300 ring-4 ring-white/20 hover:ring-saudi-green/40"
            >
              <span>جرب مستواك</span>
              <ArrowLeft className="w-8 h-8 transition-transform group-hover:-translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Decorative Sadu Divider */}
      <div className="relative h-24 bg-cream dark:bg-coffee-dark overflow-hidden transition-colors duration-300">
        <div 
          className="absolute inset-0 opacity-20 mix-blend-multiply dark:mix-blend-normal dark:opacity-10"
          style={{ 
            backgroundImage: "url('/images/Sadu_decoration.jpg')",
            backgroundSize: "contain",
            backgroundRepeat: "repeat-x"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-transparent to-cream dark:from-coffee-dark dark:to-coffee-dark"></div>
      </div>

      {/* About Section */}
      <section className="relative py-20 px-6 bg-cream dark:bg-coffee-dark transition-colors duration-300">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="space-y-12 text-coffee dark:text-sand text-xl md:text-2xl lg:text-3xl leading-loose font-medium">
            <p>
              انغمس في عمق التراث السعودي العريق، وتجول بين أصالته وروعة تنوعه. اكتشف العادات والتقاليد التي توارثتها الأجيال، وتعرّف على القيم التي شكّلت هوية المجتمع السعودي عبر التاريخ.
            </p>
            <p>
              عِش تجربة المأكولات الشعبية بنكهاتها الفريدة التي تحمل في كل لقمة حكاية من أرض الخير والكرم. واستمتع بالمهرجانات والاحتفالات الضخمة التي تملأ المدن والقرى حياةً وحيوية.
            </p>
            <p className="font-bold text-clay dark:text-gold">
              هنا، يلتقي التاريخ بالإبداع، ويزدهر الشغف بالهوية، ويولد الإلهام ليصنع غدًا أجمل.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-24 px-6 bg-cream dark:bg-coffee-dark relative overflow-hidden transition-colors duration-300">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sand/50 dark:bg-sand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-clay/10 dark:bg-clay/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10"></div>

        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Quiz Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative bg-white dark:bg-clay/55 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-sand dark:border-coffee-dark"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src="/images/quiz-card-img.jpg"
                  alt="Saudi Quiz"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 right-6 text-white">
                  <div className="p-3 bg-clay rounded-xl inline-block mb-3 shadow-lg">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-bold">تحس انك سعودي؟</h2>
                </div>
              </div>

              <div className="p-10">
                <p className="text-coffee/80 dark:text-sand/80 text-xl leading-relaxed mb-8 font-medium">
                  اذا تحس نفسك فاهم في الثقافة السعودية، جرب هذا الاختبار وتحدى نفسك!
                </p>
                <Link
                  to="/quiz"
                  className="inline-flex items-center justify-center w-full py-4 bg-clay text-white text-xl font-bold rounded-xl hover:bg-button-hover transition-colors duration-300"
                >
                  تحدى نفسك
                </Link>
              </div>
            </motion.div>

            {/* Learn Card */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative bg-white dark:bg-clay/55 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-sand dark:border-coffee-dark"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src="/images/info-card-img.jpg"
                  alt="Saudi Learn"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 right-6 text-white">
                  <div className="p-3 bg-clay rounded-xl inline-block mb-3 shadow-lg">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-bold">ودك تتعلم؟</h2>
                </div>
              </div>

              <div className="p-10">
                <p className="text-coffee/80 dark:text-sand/80 text-xl leading-relaxed mb-8 font-medium">
                  بنعلمك كل شي تحتاجه عن ثقافتنا العريقة، من الأزياء إلى الأمثال الشعبية.
                </p>
                <Link
                  to="/learn"
                  className="inline-flex items-center justify-center w-full py-4 bg-clay text-white text-xl font-bold rounded-xl hover:bg-button-hover transition-colors duration-300"
                >
                  ابدأ التعلم
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
