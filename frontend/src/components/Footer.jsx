function Footer() {
  const socialLinks = [
    { icon: '📘', label: 'Facebook', url: '#' },
    { icon: '🐦', label: 'Twitter', url: '#' },
    { icon: '📷', label: 'Instagram', url: '#' },
    { icon: '▶️', label: 'YouTube', url: '#' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12">
      <div className="container mx-auto px-6">
        {/* Divider Line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-saudi-green to-transparent mb-8"></div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              aria-label={social.label}
              className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg hover:bg-saudi-green hover:scale-110 transition-all duration-300 text-2xl"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>© 2025 هوية المملكة الثقافية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
