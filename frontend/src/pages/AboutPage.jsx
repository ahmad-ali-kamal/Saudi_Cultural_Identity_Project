import { motion } from 'framer-motion';
import { Linkedin, Target, Eye, Lightbulb, Users } from 'lucide-react';

import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

function AboutPage() {
  const teamMembers = [
    { name: 'أحمد علي كمال', role: 'إدارة المشروع والتوثيق', linkedin: 'https://www.linkedin.com/in/ahmad-ali-kamal/' },
    { name: 'محمد ابراهيم حسن', role: 'تطوير الواجهة الخلفية (Backend)', linkedin: 'https://www.linkedin.com/in/mohammed-alhaig/' },
    { name: 'نواف ابراهيم الخديدي', role: 'تطوير الواجهة الأمامية (Frontend)', linkedin: 'https://www.linkedin.com/in/nawaf-alkhudaydi/' },
    { name: 'عبدالله بدر باجعيفر', role: 'تصميم وتطوير الواجهة', linkedin: 'https://www.linkedin.com/in/abdullah-bajuayfir-5223b238a/' },
    { name: 'طلال ابراهيم العميري', role: 'تصميم وتطوير الواجهة', linkedin: 'https://www.linkedin.com/in/talal-al-omairi-031b90303/' },
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-coffee-dark font-arabic transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white dark:bg-clay/55 border-b border-sand dark:border-coffee-dark pt-32 pb-16 transition-colors duration-300">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-coffee dark:text-cream mb-6 transition-colors duration-300"
          >
            مشروع هوية المملكة الثقافية
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-olive dark:text-sand/70 max-w-3xl mx-auto leading-relaxed transition-colors duration-300"
          >
            منصة رقمية تفاعلية تهدف لتعريف الشباب بهويتنا الثقافية السعودية الأصيلة
            بأسلوب عصري ومبتكر.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 space-y-12 max-w-5xl">
        
        {/* Vision & Mission Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 dark:bg-clay/55 dark:border-coffee-dark transition-colors duration-300">
            <div className="bg-sand/30 dark:bg-coffee-dark w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
              <Target className="w-6 h-6 text-clay dark:text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-coffee dark:text-cream mb-4 transition-colors duration-300">الهدف</h2>
            <p className="text-olive dark:text-sand/70 leading-relaxed transition-colors duration-300">
              نحن نؤمن بأهمية الحفاظ على الهوية الثقافية السعودية ونقلها للأجيال القادمة.
              يهدف هذا المشروع إلى تعريف الشباب بالتراث والعادات والتقاليد السعودية من خلال
              تجربة تفاعلية وممتعة.
            </p>
          </Card>

          <Card className="p-8 dark:bg-clay/55 dark:border-coffee-dark transition-colors duration-300">
            <div className="bg-sand/30 dark:bg-coffee-dark w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
              <Eye className="w-6 h-6 text-clay dark:text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-coffee dark:text-cream mb-4 transition-colors duration-300">رؤيتنا</h2>
            <p className="text-olive dark:text-sand/70 leading-relaxed transition-colors duration-300">
              بناء جيل واعي بهويته الثقافية، يقدّر التراث السعودي الأصيل ويساهم في الحفاظ عليه
              وتطويره. نسعى لجعل الثقافة السعودية حاضرة في حياة الشباب بطرق حديثة وجذابة.
            </p>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="p-8 md:p-10 dark:bg-clay/55 dark:border-coffee-dark transition-colors duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-sand/30 dark:bg-coffee-dark w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300">
              <Lightbulb className="w-6 h-6 text-clay dark:text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-coffee dark:text-cream transition-colors duration-300">ما يقدمه المشروع</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'اختبارات ثقافية تفاعلية', desc: 'اختبر معلوماتك عن الثقافة السعودية من خلال أسئلة متنوعة وممتعة.' },
              { title: 'محتوى تعليمي غني', desc: 'تعلم عن العادات والتقاليد والمأكولات والملابس التراثية.' },
              { title: 'تجربة جذابة وحديثة', desc: 'واجهة تفاعلية وسهلة الاستخدام توفر تجربة ممتعة للجميع.' },
              { title: 'تحدى نفسك', desc: 'اختبر نفسك وتنافس مع الآخرين للحصول على اعلى قدر من الاجابات الصحيحة.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-sand/10 dark:bg-clay/30 hover:bg-sand/20 dark:hover:bg-coffee-dark/70 transition-colors duration-300">
                <div className="w-2 h-2 mt-2.5 rounded-full bg-clay dark:bg-gold flex-shrink-0 transition-colors duration-300"></div>
                <div>
                  <h3 className="font-bold text-coffee dark:text-cream mb-1 transition-colors duration-300">{item.title}</h3>
                  <p className="text-olive dark:text-sand/60 text-sm transition-colors duration-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-coffee dark:text-cream mb-8 transition-colors duration-300">فريق المشروع</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6 hover:-translate-y-2 transition-transform duration-300 dark:bg-clay/55 dark:border-coffee-dark">
                <div className="w-20 h-20 bg-sand dark:bg-coffee-dark rounded-full mx-auto mb-4 overflow-hidden border-2 border-white dark:border-clay/80 shadow-md transition-colors duration-300">
                   {/* Placeholder avatar or keep linkedin icon */}
                   <div className="w-full h-full flex items-center justify-center bg-coffee dark:bg-coffee-dark text-white dark:text-gold text-2xl font-bold transition-colors duration-300">
                      {member.name.charAt(0)}
                   </div>
                </div>
                <h3 className="font-bold text-coffee dark:text-cream text-sm mb-1 transition-colors duration-300">{member.name}</h3>
                <p className="text-olive dark:text-sand/60 text-xs mb-4 h-8 transition-colors duration-300">{member.role}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 bg-[#0077b5] text-white rounded-full hover:scale-110 transition-transform"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </Card>
            ))}
          </div>
        </div>

        {/* Mentor Section */}
        <Card className="p-8 text-center bg-gradient-to-b bg-white/80  to-sand/20 dark:bg-clay/55 border-sand dark:border-coffee-dark transition-colors duration-300">
          <h2 className="text-2xl font-bold text-coffee dark:text-cream mb-4 transition-colors duration-300">شكر خاص</h2>
          <div className="w-24 h-24 bg-coffee dark:bg-coffee-dark text-white dark:text-gold rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-clay/80 shadow-lg transition-colors duration-300">
            د
          </div>
          <h3 className="text-xl font-bold text-coffee dark:text-cream mb-2 transition-colors duration-300">الدكتور حسن الهذلي</h3>
          <p className="text-olive dark:text-sand/70 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
            نقدم شكرنا للدكتور حسن على طرح فكرة المشروع وإعطائنا فرصة لتطبيق ما تعلمناه.
            دعمه كان سبباً في ظهور هذا العمل.
          </p>
          <div className="mt-4">
             <a
                href="https://www.linkedin.com/in/hassan-alhuzali-a33888267/"
                className="inline-flex items-center gap-2 text-clay dark:text-gold font-bold hover:underline transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
          </div>
        </Card>

        <div className="flex justify-center">
          <Button onClick={() => window.location.href = '/'} size="lg" variant="outline">
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AboutPage;