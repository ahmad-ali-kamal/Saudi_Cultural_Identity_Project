import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import HomeButton from '../components/HomeButton';
import Footer from '../components/Footer';
import CustomSelect from '../components/CustomSelect';
import InfoCard from '../components/InfoCard';
import { apiService } from '../services/api';

function LearnPage() {
  const [filters, setFilters] = useState({
    language: 'Arabic',
    region: '',
    search: '',
  });

  const [searchInput, setSearchInput] = useState(''); // Local search input state
  const [infoItems, setInfoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const hasFetchedRef = useRef(false);
  const filtersRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const pageSize = 21; // Multiple of 3 for 3-column grid (7 rows)

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
    // Check if filters actually changed
    const filtersChanged = JSON.stringify(filtersRef.current) !== JSON.stringify({ ...filters, page: currentPage });

    if (!hasFetchedRef.current || filtersChanged) {
      hasFetchedRef.current = true;
      filtersRef.current = { ...filters, page: currentPage };
      fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to generate page numbers with ellipsis (must be before early returns)
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisible = 7; // Show max 7 page numbers

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, current, and nearby pages with ellipsis
      if (currentPage < 3) {
        // Near beginning: [0, 1, 2, 3, ..., last]
        for (let i = 0; i < 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        // Near end: [0, ..., last-3, last-2, last-1, last]
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        // Middle: [0, ..., current-1, current, current+1, ..., last]
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
      // Fix: Parse pagination from nested 'page' object
      setTotalPages(data.page?.totalPages || 0);
      setTotalElements(data.page?.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch info:', err);
      setError('فشل في تحميل المعلومات. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setCurrentPage(0); // Reset to first page when filters change
    hasFetchedRef.current = false; // Allow new fetch
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search (800ms after user stops typing)
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

  // Initial loading state (first load)
  if (loading && infoItems.length === 0) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="bg-secondary rounded-2xl shadow-xl p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-secondary mx-auto mb-6"></div>
              <p className="text-xl text-primary">جاري تحميل المعلومات...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="bg-secondary border-2 border-primary-400 rounded-2xl shadow-xl p-12 text-center">
              <div className="flex justify-center items-center -my-11"><img className="size-72" src="/images/error.png" alt="Error" /></div>
              <h2 className="text-2xl font-bold text-primary mb-4 ">حدث خطأ</h2>
              <p className="text-lg text-red-700 mb-8">{error}</p>
              <button
                onClick={handleRetry}
                className="px-8 py-3 bg-first text-primary font-bold rounded-lg hover:bg-accent hover:text-primary transition-all duration-300"
              >
                حاول مرة أخرى
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary relative">
      <Navbar />

      {/* Loading Overlay - only shows during data fetch, not initial load */}
      {loading && infoItems.length > 0 && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-secondary rounded-2xl shadow-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-secondary mx-auto mb-4"></div>
            <p className="text-lg text-primary font-bold">جاري التحميل...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-light mb-4">
              تعلم عن الثقافة السعودية
            </h1>
            <p className="text-xl text-accent">
              اكتشف التراث الغني والعادات والتقاليد السعودية
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-secondary rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">فلترة المحتوى</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Language Filter */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  اللغة
                </label>
                <CustomSelect
                  value={filters.language}
                  onChange={(value) => handleFilterChange('language', value)}
                  options={languageOptions}
                  placeholder="اختر اللغة"
                />
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  المنطقة
                </label>
                <CustomSelect
                  value={filters.region}
                  onChange={(value) => handleFilterChange('region', value)}
                  options={regionOptions}
                  placeholder="اختر المنطقة"
                />
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  البحث
                </label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="ابحث في المحتوى..."
                  className="placeholder-secondary w-full px-4 py-4 border-2 border-secondary rounded-xl focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/20 transition-all duration-300 text-lg bg-primary text-secondary font-bold"
                  dir="auto"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-primary/70">
              عرض {infoItems.length} من أصل {totalElements} نتيجة
            </div>
          </div>

          {/* Content Grid */}
          {infoItems.length === 0 ? (
            <div className="bg-secondary border-2 border-accent rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold text-secondary mb-4">لا توجد نتائج</h2>
              <p className="text-lg text-primary">
                لم نجد أي معلومات تطابق البحث. جرب تغيير الفلاتر أو مصطلح البحث.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {infoItems.map((info, index) => (
                  <InfoCard
                    key={info.id || info._id || `${info.questionText || info.term}-${info.region}-${info.language}-${index}`}
                    info={info}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-light/10 rounded-xl p-6">
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="px-5 py-2.5 bg-light text-primary font-bold rounded-lg hover:bg-accent hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      ← السابق
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((pageNum, idx) => (
                      pageNum === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-3 text-light font-bold">
                          ...
                        </span>
                      ) : (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2.5 font-bold rounded-lg transition-all duration-300 ${
                            currentPage === pageNum
                              ? 'bg-secondary text-primary scale-110 shadow-lg'
                              : 'bg-light/50 text-primary hover:bg-light hover:scale-105'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      )
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="px-5 py-2.5 bg-light text-primary font-bold rounded-lg hover:bg-accent hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      التالي →
                    </button>
                  </div>

                  {/* Page Info */}
                  <div className="text-center mt-3 text-light/70 text-sm">
                    صفحة {currentPage + 1} من {totalPages} ({totalElements} نتيجة)
                  </div>
                </div>
              )}

              <HomeButton />
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LearnPage;
