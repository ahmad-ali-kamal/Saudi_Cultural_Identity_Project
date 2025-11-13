import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br bg-primary to-gray-100">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-light mb-4">مشروع هوية المملكة الثقافة</h1>
            <p className="text-xl text-light">
              تعريف الشباب بهويتنا الثقافية السعودية الأصيلة
            </p>
          </div>

          
          <div className="space-y-8">
            
            <div className="bg-light rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-secondary mb-6">الهدف</h2>
              <p className="text-primary text-lg leading-relaxed">
                نحن نؤمن بأهمية الحفاظ على الهوية الثقافية السعودية ونقلها للأجيال القادمة.
                يهدف هذا المشروع إلى تعريف الشباب بالتراث والعادات والتقاليد السعودية من خلال
                تجربة تفاعلية وممتعة، حيث يمكنهم اختبار معلوماتهم وتعلم المزيد عن ثقافتهم.
              </p>
            </div>

            
            <div className="bg-light rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-secondary mb-6">رؤيتنا</h2>
              <p className="text-primary text-lg leading-relaxed">
                بناء جيل واعٍ بهويته الثقافية، يقدّر التراث السعودي الأصيل ويساهم في الحفاظ عليه
                وتطويره. نسعى لجعل الثقافة السعودية حاضرة في حياة الشباب بطرق حديثة وجذابة.
              </p>
            </div>

            
            <div className="bg-light rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-secondary mb-6">ما يقدمه المشروع</h2>
              <ul className="space-y-4 text-primary">
                <li className="flex items-start gap-4">
                  <span className="text-accent text-3xl flex-shrink-0">🎯</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">اختبارات ثقافية تفاعلية</h3>
                    <p>اختبر معلوماتك عن الثقافة السعودية من خلال أسئلة متنوعة وممتعة</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-accent text-3xl flex-shrink-0">📚</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">محتوى تعليمي غني</h3>
                    <p>تعلم عن العادات والتقاليد والمأكولات والملابس التراثية</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-accent text-3xl flex-shrink-0">🎨</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">تجربة جذابة وحديثة</h3>
                    <p>واجهة تفاعلية وسهلة الاستخدام توفر تجربة ممتعة للجميع</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-accent text-3xl flex-shrink-0">🌟</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">تحدى نفسك واصدقائك</h3>
                    <p>اختبر نفسك وتنافس مع الآخرين للحصول على اعلى قدر من الاجابات الصحيحة</p>
                  </div>
                </li>
              </ul>
            </div>

            
            <div className="bg-light rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-secondary mb-6">فريق المشروع</h2>
              <p className="text-primary text-lg leading-relaxed mb-6">
                يتألف فريقنا من خمسة أعضاء متحمسين يعملون معًا للحفاظ على الهوية الثقافية السعودية وتطويرها بطرق حديثة وجذابة.
              </p>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                {/* احمد */}
                <div>
                  <a
                    href="https://www.linkedin.com/in/ahmad-ali-kamal/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/images/linkedin_icon.png"
                      alt="LinkedIn"
                      className="w-16 h-16 rounded-full mx-auto mb-3 transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:brightness-110"
                    />
                  </a>
                  <h3 className="font-bold text-secondary">أحمد علي كمال</h3>
                  <p className="text-primary text-sm"> منظم ملفات المشروع وملفات Excal</p>
                </div>

                {/* محمد */}
                <div>
                  <a
                    href="https://www.linkedin.com/in/mohammed-alhaig/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/images/linkedin_icon.png"
                      alt="LinkedIn"
                      className="w-16 h-16 rounded-full mx-auto mb-3 transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:brightness-110"
                    />
                  </a>
                  <h3 className="font-bold text-secondary">محمد ابراهيم حسن</h3>
                  <p className="text-primary text-sm"> مسؤول البرمجة الخلفية (BackEnd)ومساعد تطوير البرمجة الامامية(FrontEnd) </p>
                </div>

                {/* نواف */}
                <div>
                  <a
                    href="https://www.linkedin.com/in/nawaf-alkhudaydi/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/images/linkedin_icon.png"
                      alt="LinkedIn"
                      className="w-16 h-16 rounded-full mx-auto mb-3 transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:brightness-110"
                    />
                  </a>
                  <h3 className="font-bold text-secondary">نواف ابراهيم الخديدي</h3>
                  <p className="text-primary text-sm">     مطور البرمجة الامامية (FrontEnd)وساعد في ترتيب الملفات وتصميم الموقع</p>
                </div>

                {/* عبدالله */}
                <div>
                  <a
                    href="https://www.linkedin.com/in/abdullah-bajuayfir-5223b238a/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/images/linkedin_icon.png"
                      alt="LinkedIn"
                      className="w-16 h-16 rounded-full mx-auto mb-3 transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:brightness-110"
                    />
                  </a>
                  <h3 className="font-bold text-secondary"> عبدالله بدر باجعيفر</h3>
                  <p className="text-primary text-sm"> مطور البرمجة الامامية (FrontEnd)وساهم في تصميم الشكل العام للموقع </p>
                </div>

                {/* طلال */}
                <div>
                  <a
                    href="https://www.linkedin.com/in/talal-al-omairi-031b90303/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/images/linkedin_icon.png"
                      alt="LinkedIn"
                      className="w-16 h-16 rounded-full mx-auto mb-3 transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:brightness-110"
                    />
                  </a>
                  <h3 className="font-bold text-secondary"> طلال ابراهيم العميري</h3>
                  <p className="text-primary text-sm">مطور البرمجة الامامية (FrontEnd)وساهم في تصميم الشكل العام للموقع </p>
                </div>
              </div>
            </div>
          </div>

          
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

export default AboutPage;

