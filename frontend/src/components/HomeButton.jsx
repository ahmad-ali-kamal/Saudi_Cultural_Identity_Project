function HomeButton() {
  const handleClick = () => {
    window.location.href = '/home';
  };

    return ( 
    <div className="text-center mt-12"> 
        <a
            href="/" /* link to homepage */ 
            className="inline-block px-8 py-3 bg-red-800 text-primary font-bold rounded-lg hover:bg-accent transition-all duration-300 hover:scale-105 shadow-lg">
            العودة للصفحة الرئيسية
        </a>
    </div>
  );
}

export default HomeButton;