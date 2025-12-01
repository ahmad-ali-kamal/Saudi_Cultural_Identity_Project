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
    <div className="min-h-screen bg-cream font-arabic">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white border-b border-sand pt-32 pb-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-coffee mb-6"
          >
            مشروع هوية المملكة الثقافية
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-olive max-w-3xl mx-auto leading-relaxed"
          >
            منصة رقمية تفاعلية تهدف لتعريف الشباب بهويتنا الثقافية السعودية الأصيلة
            بأسلوب عصري ومبتكر.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 space-y-12 max-w-5xl">
        
        {/* Vision & Mission Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <div className="bg-sand/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-clay" />
            </div>
            <h2 className="text-2xl font-bold text-coffee mb-4">الهدف</h2>
            <p className="text-olive leading-relaxed">
              نحن نؤمن بأهمية الحفاظ على الهوية الثقافية السعودية ونقلها للأجيال القادمة.
              يهدف هذا المشروع إلى تعريف الشباب بالتراث والعادات والتقاليد السعودية من خلال
              تجربة تفاعلية وممتعة.
            </p>
          </Card>

          <Card className="p-8">
            <div className="bg-sand/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-clay" />
            </div>
            <h2 className="text-2xl font-bold text-coffee mb-4">رؤيتنا</h2>
            <p className="text-olive leading-relaxed">
              بناء جيل واعي بهويته الثقافية، يقدّر التراث السعودي الأصيل ويساهم في الحفاظ عليه
              وتطويره. نسعى لجعل الثقافة السعودية حاضرة في حياة الشباب بطرق حديثة وجذابة.
            </p>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-sand/30 w-12 h-12 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-clay" />
            </div>
            <h2 className="text-2xl font-bold text-coffee">ما يقدمه المشروع</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'اختبارات ثقافية تفاعلية', desc: 'اختبر معلوماتك عن الثقافة السعودية من خلال أسئلة متنوعة وممتعة.' },
              { title: 'محتوى تعليمي غني', desc: 'تعلم عن العادات والتقاليد والمأكولات والملابس التراثية.' },
              { title: 'تجربة جذابة وحديثة', desc: 'واجهة تفاعلية وسهلة الاستخدام توفر تجربة ممتعة للجميع.' },
              { title: 'تحدى نفسك', desc: 'اختبر نفسك وتنافس مع الآخرين للحصول على اعلى قدر من الاجابات الصحيحة.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-sand/10 hover:bg-sand/20 transition-colors">
                <div className="w-2 h-2 mt-2.5 rounded-full bg-clay flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-coffee mb-1">{item.title}</h3>
                  <p className="text-olive text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-coffee mb-8">فريق المشروع</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 bg-sand rounded-full mx-auto mb-4 overflow-hidden border-2 border-white shadow-md">
                   {/* Placeholder avatar or keep linkedin icon */}
                   <div className="w-full h-full flex items-center justify-center bg-coffee text-white text-2xl font-bold">
                      {member.name.charAt(0)}
                   </div>
                </div>
                <h3 className="font-bold text-coffee text-sm mb-1">{member.name}</h3>
                <p className="text-olive text-xs mb-4 h-8">{member.role}</p>
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
        <Card className="p-8 text-center bg-gradient-to-b from-white to-sand/20">
          <h2 className="text-2xl font-bold text-coffee mb-4">شكر خاص</h2>
          <div className="w-24 h-24 bg-coffee text-white rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
            د
          </div>
          <h3 className="text-xl font-bold text-coffee mb-2">الدكتور حسن الهذلي</h3>
          <p className="text-olive max-w-2xl mx-auto leading-relaxed">
            نقدم شكرنا للدكتور حسن على طرح فكرة المشروع وإعطائنا فرصة لتطبيق ما تعلمناه.
            دعمه كان سبباً في ظهور هذا العمل.
          </p>
          <div className="mt-4">
             <a
                href="https://www.linkedin.com/in/hassan-alhuzali-a33888267/"
                className="inline-flex items-center gap-2 text-clay font-bold hover:underline"
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