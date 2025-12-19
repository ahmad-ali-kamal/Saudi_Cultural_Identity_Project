import { motion } from 'framer-motion';
import { Database, ExternalLink, BookOpen, Award } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

function AttributionPage() {
  const datasets = [
    {
      name: 'PEARL: Multimodal Culturally-Aware Arabic Instruction Dataset',
      description: 'مجموعة بيانات PEARL للتعليمات العربية متعددة الوسائط مع وعي ثقافي، تتضمن أسئلة بصرية متعددة اللغات حول الثقافة السعودية مع صور تغطي العمارة، الطعام، الجغرافيا، والتقاليد.',
      descriptionEn: 'A multimodal culturally-aware Arabic instruction dataset with visual questions about Saudi culture, covering architecture, food, geography, and traditions.',
      url: 'https://arxiv.org/abs/2505.21979',
      usage: 'أسئلة الاختبارات التفاعلية مع الصور',
      citation: `Alwajih, F., Magdy, S. M., Mekki, A. E., Nacar, O., Nafea, Y., Abdelfadil, S. T., ... & Abdul-Mageed, M. (2025). Pearl: A Multimodal Culturally-Aware Arabic Instruction Dataset. arXiv preprint arXiv:2505.21979.`,
      bibtex: `@article{alwajih2025pearl,
  title={PEARL: A Multimodal Culturally-Aware Arabic Instruction Dataset},
  author={Alwajih, F. and Magdy, S. M. and Mekki, A. E. and Nacar, O. and Nafea, Y. and Abdelfadil, S. T. and others and Abdul-Mageed, M.},
  journal={arXiv preprint arXiv:2505.21979},
  year={2025}
}`
    },
    {
      name: 'Saudiculture: Cultural Competence Benchmark',
      description: 'معيار قياسي لتقييم الكفاءة الثقافية للنماذج اللغوية الكبيرة ضمن المملكة العربية السعودية، يتضمن أسئلة متخصصة حول الثقافة والتقاليد والعادات السعودية.',
      descriptionEn: 'A benchmark for evaluating large language models\' cultural competence within Saudi Arabia, including specialized questions about Saudi culture, traditions, and customs.',
      url: 'https://link.springer.com/article/10.1007/s44443-025-00137-9',
      usage: 'أسئلة الكفاءة الثقافية والمعرفة بالتقاليد السعودية',
      citation: `Ayash, L., Alhuzali, H., Alasmari, A., & Aloufi, S. (2025). Saudiculture: A benchmark for evaluating large language models' cultural competence within saudi arabia. Journal of King Saud University Computer and Information Sciences, 37(6), 123.`,
      bibtex: `@article{ayash2025saudiculture,
  title={Saudiculture: A benchmark for evaluating large language models' cultural competence within Saudi Arabia},
  author={Ayash, L. and Alhuzali, H. and Alasmari, A. and Aloufi, S.},
  journal={Journal of King Saud University Computer and Information Sciences},
  volume={37},
  number={6},
  pages={123},
  year={2025}
}`
    },
    {
      name: 'Absher: Saudi Dialects Understanding Benchmark',
      description: 'معيار قياسي لتقييم فهم النماذج اللغوية الكبيرة للهجات السعودية، يغطي اللهجات المختلفة عبر مناطق المملكة ويساعد في الحفاظ على التنوع اللغوي.',
      descriptionEn: 'A benchmark for evaluating large language models\' understanding of Saudi dialects, covering different dialects across regions of the Kingdom and helping preserve linguistic diversity.',
      url: 'https://arxiv.org/abs/2507.10216',
      usage: 'أسئلة تتعلق باللهجات السعودية والتنوع اللغوي الإقليمي',
      citation: `Al-Monef, R., Alhuzali, H., Alturayeif, N., & Alasmari, A. (2025). Absher: A benchmark for evaluating large language models understanding of saudi dialects. arXiv preprint arXiv:2507.10216.`,
      bibtex: `@article{almonef2025absher,
  title={Absher: A benchmark for evaluating large language models understanding of Saudi dialects},
  author={Al-Monef, R. and Alhuzali, H. and Alturayeif, N. and Alasmari, A.},
  journal={arXiv preprint arXiv:2507.10216},
  year={2025}
}`
    }
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-coffee-dark font-arabic transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white dark:bg-clay/55 border-b border-sand dark:border-coffee-dark pt-32 pb-16 transition-colors duration-300">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Database className="w-10 h-10 text-clay dark:text-gold" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-coffee dark:text-cream transition-colors duration-300">
              توثيق مصادر البيانات
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-olive dark:text-sand/70 max-w-3xl mx-auto leading-relaxed transition-colors duration-300"
          >
            نقدر جهود الباحثين والمؤسسات التي أتاحت مجموعات البيانات المستخدمة في هذا المشروع
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 space-y-8 max-w-6xl">

        {/* Introduction Card */}
        <Card className="p-8 dark:bg-clay/55 dark:border-coffee-dark transition-colors duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-sand/30 dark:bg-coffee-dark w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <Award className="w-6 h-6 text-clay dark:text-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-coffee dark:text-cream mb-3 transition-colors duration-300">
                شكر وتقدير
              </h2>
              <p className="text-olive dark:text-sand/70 leading-relaxed transition-colors duration-300">
                يعتمد هذا المشروع على مجموعات بيانات عالية الجودة تم إتاحتها من قبل مؤسسات بحثية
                رائدة في مجال الذكاء الاصطناعي والحفاظ على الثقافة واللغة العربية.
                نحن ممتنون لجهودهم في توفير هذه الموارد للأغراض التعليمية والبحثية.
                جميع المصادر مذكورة أدناه مع الاستشهادات الكاملة.
              </p>
            </div>
          </div>
        </Card>

        {/* Datasets Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-coffee dark:text-cream text-center mb-8 transition-colors duration-300">
            مجموعات البيانات المستخدمة
          </h2>

          {datasets.map((dataset, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 dark:bg-clay/55 dark:border-coffee-dark transition-colors duration-300 hover:shadow-lg">
                {/* Dataset Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-coffee dark:text-cream transition-colors duration-300">
                      {dataset.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={dataset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-sand/30 dark:bg-coffee-dark rounded-lg hover:bg-sand/50 dark:hover:bg-coffee transition-colors duration-300 text-coffee dark:text-cream"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm font-semibold">المصدر</span>
                    </a>
                    {dataset.arxiv && (
                      <a
                        href={dataset.arxiv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-clay/20 dark:bg-gold/20 rounded-lg hover:bg-clay/30 dark:hover:bg-gold/30 transition-colors duration-300 text-coffee dark:text-cream"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-semibold">المصدر</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Dataset Description */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-bold text-olive dark:text-sand mb-1 transition-colors duration-300">
                      الوصف:
                    </h4>
                    <p className="text-olive dark:text-sand/70 leading-relaxed transition-colors duration-300">
                      {dataset.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-olive dark:text-sand mb-1 transition-colors duration-300">
                      الاستخدام في المشروع:
                    </h4>
                    <p className="text-olive dark:text-sand/70 transition-colors duration-300">
                      {dataset.usage}
                    </p>
                  </div>
                </div>

                {/* Citation Section */}
                <div className="border-t border-sand dark:border-coffee-dark pt-6 space-y-4 transition-colors duration-300">
                  {/* APA Citation */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-clay dark:text-gold" />
                      <h4 className="text-sm font-bold text-coffee dark:text-cream transition-colors duration-300">
                        APA Citation:
                      </h4>
                    </div>
                    <div className="bg-sand/20 dark:bg-coffee-dark/50 p-4 rounded-lg transition-colors duration-300">
                      <p className="text-sm text-olive dark:text-sand/80 leading-relaxed transition-colors duration-300" dir="ltr">
                        {dataset.citation}
                      </p>
                    </div>
                  </div>

                  {/* BibTeX Citation */}
                  {dataset.bibtex && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-clay dark:text-gold" />
                        <h4 className="text-sm font-bold text-coffee dark:text-cream transition-colors duration-300">
                          BibTeX:
                        </h4>
                      </div>
                      <div className="bg-sand/20 dark:bg-coffee-dark/50 p-4 rounded-lg transition-colors duration-300">
                        <pre className="text-xs text-olive dark:text-sand/80 font-mono leading-relaxed overflow-x-auto transition-colors duration-300" dir="ltr">
{dataset.bibtex}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <Card className="p-6 bg-sand/30 dark:bg-clay/55 border-sand dark:border-coffee-dark transition-colors duration-300">
          <p className="text-center text-olive dark:text-sand/70 text-sm leading-relaxed transition-colors duration-300">
            إذا كنت تستخدم هذا المشروع أو بياناته في بحثك، يرجى الاستشهاد بمصادر البيانات الأصلية المذكورة أعلاه
          </p>
        </Card>

        {/* Back Button */}
        <div className="flex justify-center pt-4">
          <Button onClick={() => window.location.href = '/'} size="lg" variant="outline">
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AttributionPage;
