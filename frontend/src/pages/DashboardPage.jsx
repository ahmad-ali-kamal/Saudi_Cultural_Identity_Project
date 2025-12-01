import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Activity, Trophy, CheckCircle2, HelpCircle, TrendingUp, Calendar, AlertTriangle, BarChart2, Globe, CheckSquare } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiService } from '../services/api';
import { authService } from '../services/auth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Modern Heritage Chart Palette
const CHART_COLORS = ['#855D38', '#D4AF37', '#5A614E', '#1D2F1F', '#EFE5D5', '#3E2B1D'];

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchStats();
  }, []);

  const checkAuthAndFetchStats = async () => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      const userData = await authService.getUserAttributes();
      setUser(userData);
      await fetchStats();
    } catch (err) {
      console.error('Error checking auth:', err);
      setError('فشل في التحقق من الهوية');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUserStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('فشل في تحميل الإحصائيات. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Stat Card Component
  const StatItem = ({ label, value, icon: Icon, color }) => (
    <Card className="p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
      <div className={`p-4 rounded-2xl ${color}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div>
        <p className="text-olive text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-coffee">{value}</h3>
      </div>
    </Card>
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-cream font-arabic">
        <Navbar />
        <div className="container mx-auto px-6 py-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-sand"></div>
              ))}
            </div>
            <div className="h-96 bg-white rounded-3xl animate-pulse border border-sand"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-cream font-arabic">
        <Navbar />
        <div className="container mx-auto px-6 py-32 text-center">
          <Card className="max-w-lg mx-auto p-10">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-coffee mb-2">حدث خطأ</h2>
            <p className="text-olive mb-6">{error}</p>
            <Button onClick={fetchStats}>حاول مرة أخرى</Button>
          </Card>
        </div>
      </div>
    );
  }

  // Empty State
  if (stats && stats.overall.totalQuestionsAnswered === 0) {
    return (
      <div className="min-h-screen bg-cream font-arabic">
        <Navbar />
        <div className="container mx-auto px-6 py-32 text-center">
          <Card className="max-w-2xl mx-auto p-12">
            <div className="w-24 h-24 bg-sand/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart2 className="w-12 h-12 text-clay" />
            </div>
            <h2 className="text-3xl font-bold text-coffee mb-4">لا توجد بيانات بعد</h2>
            <p className="text-lg text-olive mb-8">
              ابدأ رحلتك في استكشاف الثقافة السعودية. حل الاختبارات لرؤية إحصائياتك وتقدمك هنا.
            </p>
            <Link to="/quiz">
              <Button size="lg">ابدأ أول اختبار</Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const scoreTrendData = stats.recentSubmissions.map(sub => ({
    date: new Date(sub.submittedAt).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
    score: sub.percentage,
  })).reverse();

  return (
    <div className="min-h-screen bg-cream font-arabic">
      <Navbar />

      <div className="container mx-auto px-4 py-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-coffee mb-2">لوحة التحكم</h1>
              <p className="text-olive text-lg">أهلاً بك، {user?.name || user?.email?.split('@')[0]}</p>
            </div>
            <Link to="/quiz">
              <Button variant="outline" size="sm">اختبار جديد +</Button>
            </Link>
          </div>

          {/* Summary Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatItem 
              label="عدد الاختبارات" 
              value={stats.overall.totalSubmissions} 
              icon={Activity} 
              color="bg-clay" 
            />
            <StatItem 
              label="المعدل العام" 
              value={`${stats.overall.averageScore.toFixed(1)}%`} 
              icon={Trophy} 
              color="bg-[#D4AF37]" 
            />
            <StatItem 
              label="إجابات صحيحة" 
              value={stats.overall.totalCorrect} 
              icon={CheckCircle2} 
              color="bg-saudi-green" 
            />
            <StatItem 
              label="إجمالي الأسئلة" 
              value={stats.overall.totalQuestionsAnswered} 
              icon={HelpCircle} 
              color="bg-olive" 
            />
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Score Trend */}
            {scoreTrendData.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-6 border-b border-sand pb-4">
                    <div className="p-2 bg-sand/30 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-clay" />
                    </div>
                    <h2 className="text-xl font-bold text-coffee">تطور مستواك</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={scoreTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EFE5D5" />
                      <XAxis dataKey="date" stroke="#5A614E" fontSize={12} tickMargin={10} />
                      <YAxis stroke="#5A614E" domain={[0, 100]} fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EFE5D5', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#855D38', fontWeight: 'bold' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#855D38" 
                        strokeWidth={3} 
                        dot={{ fill: '#855D38', r: 4, strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            )}

            {/* Region Performance */}
            {stats.byRegion.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-6 border-b border-sand pb-4">
                    <div className="p-2 bg-sand/30 rounded-lg">
                      <BarChart2 className="w-5 h-5 text-clay" />
                    </div>
                    <h2 className="text-xl font-bold text-coffee">الأداء حسب المنطقة</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.byRegion}
                        dataKey="total"
                        nameKey="region"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                      >
                        {stats.byRegion.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Legend 
                        verticalAlign="bottom" 
                        iconType="circle"
                        formatter={(value, entry) => (
                          <span className="text-coffee text-sm font-medium ml-2">
                            {value} ({entry.payload.accuracy.toFixed(0)}%)
                          </span>
                        )}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EFE5D5' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            )}

            {/* Question Type Performance */}
            {stats.byQuestionType && stats.byQuestionType.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-6 border-b border-sand pb-4">
                    <div className="p-2 bg-sand/30 rounded-lg">
                      <CheckSquare className="w-5 h-5 text-clay" />
                    </div>
                    <h2 className="text-xl font-bold text-coffee">الأداء حسب نوع السؤال</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.byQuestionType}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EFE5D5" />
                      <XAxis dataKey="type" stroke="#5A614E" fontSize={12} tickMargin={10} />
                      <YAxis stroke="#5A614E" domain={[0, 100]} fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EFE5D5' }}
                        itemStyle={{ color: '#855D38', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="accuracy" fill="#855D38" radius={[8, 8, 0, 0]} name="الدقة %" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            )}

            {/* Language Performance */}
            {stats.byLanguage && stats.byLanguage.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-6 border-b border-sand pb-4">
                    <div className="p-2 bg-sand/30 rounded-lg">
                      <Globe className="w-5 h-5 text-clay" />
                    </div>
                    <h2 className="text-xl font-bold text-coffee">الأداء حسب اللغة</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.byLanguage}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EFE5D5" />
                      <XAxis dataKey="language" stroke="#5A614E" fontSize={12} tickMargin={10} />
                      <YAxis stroke="#5A614E" domain={[0, 100]} fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EFE5D5' }}
                        itemStyle={{ color: '#1D2F1F', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="accuracy" fill="#1D2F1F" radius={[8, 8, 0, 0]} name="الدقة %" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Strengths & Weaknesses */}
            {(stats.strengths.length > 0 || stats.weaknesses.length > 0) && (
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <Card className="p-6 h-full">
                  <h2 className="text-xl font-bold text-coffee mb-6 border-b border-sand pb-4">تحليل الأداء</h2>
                  
                  <div className="space-y-6">
                    {stats.strengths.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-saudi-green mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> نقاط القوة
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {stats.strengths.map((s, i) => (
                            <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-lg font-medium border border-green-100">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {stats.weaknesses.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-amber-600 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> يحتاج لتحسين
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {stats.weaknesses.map((w, i) => (
                            <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-lg font-medium border border-amber-100">
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Recent Activity List */}
            {stats.recentSubmissions.length > 0 && (
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="p-6 h-full">
                  <h2 className="text-xl font-bold text-coffee mb-6 border-b border-sand pb-4">النشاط الأخير</h2>
                  <div className="space-y-3">
                    {stats.recentSubmissions.slice(0, 5).map((sub) => (
                      <div 
                        key={sub.id} 
                        className="flex items-center justify-between p-4 rounded-xl bg-sand/20 hover:bg-sand/40 transition-colors border border-sand/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${sub.percentage >= 80 ? 'bg-green-100 text-green-700' : sub.percentage >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-coffee text-lg">
                              {sub.score} <span className="text-olive/60 text-sm">/ {sub.totalQuestions}</span>
                            </p>
                            <div className="flex items-center gap-1 text-xs text-olive mt-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(sub.submittedAt).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <span className={`text-lg font-bold ${sub.percentage >= 80 ? 'text-green-600' : sub.percentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                            {sub.percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardPage;
