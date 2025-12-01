import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, MapPin, Globe, Tag } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';

function LearnPage() {
  const [filters, setFilters] = useState({
    language: 'Arabic',
    region: '',
    search: '',
  });

  const [searchInput, setSearchInput] = useState('');
  const [infoItems, setInfoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const hasFetchedRef = useRef(false);
  const filtersRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const pageSize = 21;

  const languageOptions = [
    { value: 'Arabic', label: 'العربية' },
    { value: 'English', label: 'English' },
  ];

  const regionOptions = [
    { value: '', label: 'جميع المناطق' },
    { value: 'general', label: 'عام' },
    { value: 'west', label: 'الغربية' },
    { value: 'east', label: 'الشرقية' },
    { value: 'north', label: 'الشمالية' },
    { value: 'south', label: 'الجنوبية' },
    { value: 'centeral', label: 'الوسطى' },
  ];

  useEffect(() => {
    const filtersChanged = JSON.stringify(filtersRef.current) !== JSON.stringify({ ...filters, page: currentPage });

    if (!hasFetchedRef.current || filtersChanged) {
      hasFetchedRef.current = true;
      filtersRef.current = { ...filters, page: currentPage };
      fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (currentPage < 3) {
        for (let i = 0; i < 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  const fetchInfo = async () => {
    try {
      // Clear items immediately to prevent ghost content and force skeleton
      setInfoItems([]); 
      setLoading(true);
      setError(null);

      const params = {
        language: filters.language,
        page: currentPage,
        size: pageSize,
      };

      if (filters.region) params.region = filters.region;
      if (filters.search && filters.search.trim()) params.search = filters.search.trim();

      const data = await apiService.getInfo(params);

      setInfoItems(data.content || []);
      
      // Handle different Spring Page serialization formats (standard vs HATEOAS)
      const totalElements = data.totalElements ?? data.page?.totalElements ?? 0;
      setTotalElements(totalElements);

      // Calculate total pages manually to ensure consistency with frontend pageSize
      setTotalPages(Math.ceil(totalElements / pageSize));
    } catch (err) {
      console.error('Failed to fetch info:', err);
      setError('فشل في تحميل المعلومات. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setCurrentPage(0);
    hasFetchedRef.current = false;
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setFilters((prevFilters) => ({ ...prevFilters, search: value }));
      setCurrentPage(0);
      hasFetchedRef.current = false;
    }, 800);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    hasFetchedRef.current = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    hasFetchedRef.current = false;
    fetchInfo();
  };

  // Item Card Component (Inline)
  const InfoItem = ({ info }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const getImageSrc = () => {
      if (info.imageBase64 && info.imageMimeType) {
        return `data:${info.imageMimeType};base64,${info.imageBase64}`;
      }
      return null;
    };
    const imageSrc = getImageSrc();
    const hasLongAnswer = info.answer && info.answer.length > 200;
    const isEnglish = info.language?.toLowerCase() === 'english';
    const textDir = isEnglish ? 'ltr' : 'rtl';
    const textAlign = isEnglish ? 'text-left' : 'text-right';

    return (
      <Card className="h-full flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        {imageSrc && (
          <div className="relative h-48 w-full overflow-hidden bg-sand/20 border-b border-sand/50">
            <img
              src={imageSrc}
              alt="Visual"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="p-6 flex flex-col flex-grow">
          {/* Meta Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {info.term && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-clay/10 text-clay border border-clay/20">
                مصطلح
              </span>
            )}
            {info.region && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sand text-olive">
                <MapPin className="w-3 h-3" />
                {info.region}
              </span>
            )}
            {info.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sand text-olive">
                <Tag className="w-3 h-3" />
                {info.category}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-grow">
            {info.term && (
              <div className="mb-3">
                <h3 className={`text-2xl font-bold text-coffee mb-1 ${textAlign}`} dir={textDir}>
                  {info.term}
                </h3>
                {info.termMeaning && (
                  <p className={`text-olive text-sm ${textAlign}`} dir={textDir}>
                    {info.termMeaning}
                  </p>
                )}
              </div>
            )}

            {info.questionText && (
              <h3 className={`text-xl font-bold text-coffee mb-3 ${textAlign}`} dir={textDir}>
                {info.questionText}
              </h3>
            )}

            {info.answer && (
              <div className={`text-olive/80 leading-relaxed ${textAlign}`} dir={textDir}>
                <p className={!isExpanded && hasLongAnswer ? 'line-clamp-4' : ''}>
                  {info.answer}
                </p>
                {hasLongAnswer && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-clay hover:text-saudi-green text-sm font-bold mt-2 transition-colors"
                  >
                    {isExpanded ? (isEnglish ? 'Show Less' : 'عرض أقل') : (isEnglish ? 'Read More' : 'اقرأ المزيد')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-cream font-arabic">
      <Navbar />

      {/* Header Section with Pattern */}
      <div className="relative bg-white border-b border-sand pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/images/Sadu_decoration.jpg')] bg-repeat-x bg-contain"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-coffee mb-4"
          >
            تعلم عن الثقافة السعودية
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-olive max-w-2xl mx-auto"
          >
            اكتشف التراث الغني والعادات والتقاليد السعودية من خلال مكتبتنا المتنامية
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* Filters & Search */}
        <div className="mb-10 bg-white rounded-2xl p-6 shadow-sm border border-sand">
          <div className="flex items-center gap-2 mb-6 text-coffee font-bold text-lg border-b border-sand pb-4">
            <Filter className="w-5 h-5 text-clay" />
            تصفية المحتوى
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="البحث"
              placeholder="ابحث عن مصطلح، سؤال..."
              value={searchInput}
              onChange={handleSearchChange}
              startIcon={<Search className="w-5 h-5" />}
            />

            <Select
              label="المنطقة"
              options={regionOptions}
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            />

            <Select
              label="اللغة"
              options={languageOptions}
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            />
          </div>
          
          <div className="mt-4 flex justify-between items-center text-sm text-olive">
             <span>عرض {infoItems.length} من أصل {totalElements} نتيجة</span>
             {loading && <span className="flex items-center gap-2 text-clay"><RefreshCw className="w-4 h-4 animate-spin"/> جاري التحديث...</span>}
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          // Loading Skeleton Grid - Always show when loading to prevent flash
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: pageSize }).map((_, n) => (
              <div key={n} className="h-80 bg-white rounded-[2rem] border border-sand animate-pulse flex flex-col p-6">
                <div className="w-full h-48 bg-sand/30 rounded-xl mb-4"></div>
                <div className="w-24 h-6 bg-sand/50 rounded-full mb-4"></div>
                <div className="w-3/4 h-8 bg-sand/50 rounded-xl mb-4"></div>
                <div className="space-y-2 flex-grow">
                  <div className="w-full h-4 bg-sand/30 rounded"></div>
                  <div className="w-2/3 h-4 bg-sand/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-20 bg-white rounded-[2rem] border border-sand">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-coffee mb-2">حدث خطأ في تحميل البيانات</h2>
            <p className="text-olive mb-6">{error}</p>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="w-4 h-4 ml-2" />
              حاول مرة أخرى
            </Button>
          </div>
        ) : infoItems.length === 0 ? (
          // Empty State
          <div className="text-center py-20 bg-white rounded-[2rem] border border-sand">
            <div className="w-20 h-20 bg-sand/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-olive" />
            </div>
            <h2 className="text-2xl font-bold text-coffee mb-2">لا توجد نتائج</h2>
            <p className="text-olive max-w-md mx-auto">
              لم نجد أي معلومات تطابق بحثك. جرب تغيير كلمات البحث أو الفلاتر.
            </p>
          </div>
        ) : (
          // Results Grid
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {infoItems.map((info, index) => (
              <motion.div key={info.id || index} variants={itemVariants}>
                <InfoItem info={info} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="bg-white p-2 rounded-2xl border border-sand shadow-sm flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-xl hover:bg-sand/50 text-coffee disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-6 h-6" /> {/* RTL Flip */}
              </button>

              {getPageNumbers().map((pageNum, idx) => (
                pageNum === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-3 text-olive font-bold">...</span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                      currentPage === pageNum
                        ? 'bg-clay text-white shadow-md'
                        : 'text-coffee hover:bg-sand/50'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                )
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-xl hover:bg-sand/50 text-coffee disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-6 h-6" /> {/* RTL Flip */}
              </button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default LearnPage;
