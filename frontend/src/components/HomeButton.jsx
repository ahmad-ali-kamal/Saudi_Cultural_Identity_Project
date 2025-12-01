function HomeButton() {
  const handleClick = () => {
    window.location.href = '/home';
  };

    return ( 
    <div className="text-center mt-12"> 
        <a
            href="/" /* link to homepage */ 
            className="inline-block px-8 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-primary hover:text-secondary hover:text-xl border-secondary border-2 transition-all duration-300 hover:scale-105 shadow-2xl">
            العودة للصفحة الرئيسية
        </a>
    </div>
  );
}

export default HomeButton;