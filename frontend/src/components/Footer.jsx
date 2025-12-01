function Footer() {
  const socialLinks = [];

  return (
    
    <footer className="bg-black text-light ">
      <div className=" ">
         <div className="scroll-py-7 overflow-hidden" >
                <img
                  src="/images/FooterBg.jpg"
                  alt="Saudi Cultural Learning"
                  className="
                    object-cover
                  lg:w-full lg:h-full "
                />
               
              </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-accent mb-8"></div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              aria-label={social.label}
              className="w-12 h-12 flex items-center justify-center bg-primary rounded-lg hover:bg-accent hover:scale-110 transition-all duration-300 text-2xl"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-primary text-sm">
          <p>© 2025 هوية المملكة الثقافية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
