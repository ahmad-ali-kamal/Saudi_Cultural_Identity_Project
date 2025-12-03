import { Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

function Footer() {
  // Placeholder links
  const socialLinks = [
    { label: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: '#' },
    { label: 'Instagram', icon: <Instagram className="w-5 h-5" />, url: '#' },
    { label: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: '#' },
    { label: 'Email', icon: <Mail className="w-5 h-5" />, url: '#' },
  ];

  return (
    <footer className="bg-coffee dark:bg-coffee-dark text-sand dark:text-sand py-16 relative overflow-hidden transition-colors duration-300">
       {/* Pattern Overlay */}
       <div className="absolute inset-0 opacity-5 bg-[url('/images/Sadu_decoration.jpg')] bg-repeat-x bg-top mix-blend-overlay"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-bold text-white dark:text-cream mb-2">هوية المملكة الثقافية</h3>
            <p className="text-sand/60 dark:text-sand/60">نحيي تراثنا .. لنصنع مستقبلنا</p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                aria-label={social.label}
                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-clay dark:hover:bg-gold hover:text-white dark:hover:text-coffee-dark transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 dark:bg-coffee-light my-8 transition-colors duration-300"></div>

        {/* Copyright */}
        <div className="text-center text-sand/50 dark:text-sand/40 text-sm">
          <p>© 2025 هوية المملكة الثقافية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;