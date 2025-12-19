import { Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

function Footer() {
  // Placeholder links
  
  return (
    <footer className="bg-coffee dark:bg-gold-dark text-sand dark:text-sand py-16 relative overflow-hidden transition-colors duration-300">
       {/* Pattern Overlay */}
       <div className="absolute inset-0 opacity-5 bg-[url('/images/Sadu_decoration.jpg')] bg-repeat-x bg-top mix-blend-overlay"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-bold text-white dark:text-cream mb-2">هوية المملكة الثقافية</h3>
            <p className="text-sand/60 dark:text-sand/60">نحيي تراثنا .. لنصنع مستقبلنا</p>
          </div>

          {/* Quick Links */}
          <div className="flex gap-6 text-center">
            <a
              href="/attribution"
              className="text-sand/80 dark:text-sand/70 hover:text-white dark:hover:text-cream transition-colors duration-300 font-semibold"
            >
              مصادر البيانات
            </a>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 dark:bg-clay/55 my-8 transition-colors duration-300"></div>

        {/* Copyright */}
        <div className="text-center text-sand/50 dark:text-sand/40 text-sm">
          <p>© 2025 هوية المملكة الثقافية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;