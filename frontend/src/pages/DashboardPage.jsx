import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatCard from '../components/dashboard/StatCard';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

// Chart colors matching heritage theme
const CHART_COLORS = ['#8B5A3C', '#CD9B6D', '#D4A574', '#A67C52', '#6B4423', '#D9BFA0'];

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
      // Check authentication
      const isAuthenticated = await authService.isAuthenticated();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      // Get user info
      const userData = await authService.getUserAttributes();
      setUser(userData);

      // Fetch stats
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="bg-light rounded-2xl shadow-xl p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-secondary mx-auto mb-6"></div>
              <p className="text-xl text-primary">جاري تحميل الإحصائيات...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="bg-secondary border-2 border-red-400 rounded-2xl shadow-xl p-12 text-center">
              <div className="flex justify-center items-center -my-11"><img className="size-72" src="/images/error.png" alt="Error" /></div>
              <h2 className="text-2xl font-bold text-primary mb-4">حدث خطأ</h2>
              <p className="text-lg text-red-700 mb-8">{error}</p>
              <button
                onClick={fetchStats}
                className="px-8 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-accent transition-all duration-300"
              >
                حاول مرة أخرى
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - no quiz data
  if (stats && stats.overall.totalQuestionsAnswered === 0) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="bg-light rounded-2xl shadow-xl p-12 text-center">
              <div className="text-8xl mb-6">📊</div>
              <h2 className="text-3xl font-bold text-primary mb-4">لا توجد بيانات بعد</h2>
              <p className="text-xl text-primary mb-8">ابدأ بحل الاختبارات لرؤية إحصائياتك هنا</p>
              <Link
                to="/quiz"
                className="inline-block px-8 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg"
              >
                ابدأ اختباراً
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Prepare chart data
  const scoreTrendData = stats.recentSubmissions.map(sub => ({
    date: new Date(sub.submittedAt).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
    score: sub.percentage,
  })).reverse(); // Reverse to show chronological order

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-light mb-4">لوحة التحكم</h1>
            <p className="text-xl text-accent">مرحباً، {user?.name || user?.email}</p>
          </div>

          {/* Summary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 text-primary">
            <StatCard
              value={stats.overall.totalSubmissions}
              label="عدد الاختبارات"
            />
            <StatCard
              value={`${stats.overall.averageScore.toFixed(1)}%`}
              label="المعدل"
            />
            <StatCard
              value={stats.overall.totalCorrect}
              label="إجابات صحيحة"
            />
            <StatCard
              value={stats.overall.totalQuestionsAnswered}
              label="إجمالي الأسئلة"
            />
          </div>

          {/* Strengths & Weaknesses Badges */}
          {(stats.strengths.length > 0 || stats.weaknesses.length > 0) && (
            <div className="bg-light rounded-2xl shadow-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">نقاط القوة والضعف</h2>

              <div className="flex flex-wrap gap-4 justify-center mb-6">
                {stats.strengths.map((strength, index) => (
                  <div
                    key={`strength-${index}`}
                    className="px-6 py-3 bg-green-100 text-green-800 rounded-full font-semibold border-2 border-green-400 flex items-center gap-2"
                  >
                    <span>✓</span>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>

              {stats.weaknesses.length > 0 && (
                <div className="flex flex-wrap gap-4 justify-center">
                  {stats.weaknesses.map((weakness, index) => (
                    <div
                      key={`weakness-${index}`}
                      className="px-6 py-3 bg-amber-100 text-amber-800 rounded-full font-semibold border-2 border-amber-400 flex items-center gap-2"
                    >
                      <span>⚠</span>
                      <span>{weakness}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

            {/* Score Trend Chart */}
            {scoreTrendData.length > 0 && (
              <div className="bg-light rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">تطور النتائج</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scoreTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FFDBBA" />
                    <XAxis dataKey="date" stroke="#FFDBBA" style={{ fontSize: '14px' }} />
                    <YAxis stroke="#FFDBBA" domain={[0, 100]} style={{ fontSize: '14px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFDBBA',
                        border: '2px solid #FFDBBA',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#FFDBBA"
                      strokeWidth={3}
                      dot={{ fill: '#FFDBBA', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Question Type Performance */}
            {stats.byQuestionType.length > 0 && (
              <div className="bg-light rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">الأداء حسب نوع السؤال</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.byQuestionType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FFDBBA" />
                    <XAxis dataKey="type" stroke="#FFDBBA" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#FFDBBA" domain={[0, 100]} style={{ fontSize: '14px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFDBBA',
                        border: '2px solid #FFDBBA',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="accuracy" fill="#FFDBBA" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Region Performance */}
            {stats.byRegion.length > 0 && (
              <div className="bg-light rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">الأداء حسب المنطقة</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.byRegion}
                      dataKey="total"
                      nameKey="region"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                    >
                      {stats.byRegion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ color: '#FFDBBA' }}>
                          {value} ({entry.payload.accuracy.toFixed(0)}%)
                        </span>
                      )}
                      wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFDBBA',
                        border: '2px solid #FFDBBA',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Language Performance */}
            {stats.byLanguage.length > 0 && (
              <div className="bg-light rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">الأداء حسب اللغة</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.byLanguage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FFDBBA" />
                    <XAxis dataKey="language" stroke="#FFDBBA" style={{ fontSize: '14px' }} />
                    <YAxis stroke="#FFDBBA" domain={[0, 100]} style={{ fontSize: '14px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFDBBA',
                        border: '2px solid #FFDBBA',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="accuracy" fill="#FFDBBA" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          {stats.recentSubmissions.length > 0 && (
            <div className="bg-light rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">النشاط الأخير</h2>
              <div className="space-y-4">
                {stats.recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-accent/20 rounded-lg p-4 border border-accent hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-primary">
                          {submission.score} / {submission.totalQuestions}
                        </span>
                        <span className="text-primary font-semibold mr-4">
                          ({submission.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <p className="text-sm text-primary/70">
                        {new Date(submission.submittedAt).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default DashboardPage;
