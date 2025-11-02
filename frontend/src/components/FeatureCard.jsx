import { Link } from 'react-router-dom';

function FeatureCard({ title, description, buttonText, buttonLink, imageUrl, imageAlt }) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Card Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Card Content */}
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-6 whitespace-pre-line">
          {description}
        </p>

        {/* CTA Button */}
        <Link
          to={buttonLink}
          className="inline-block px-8 py-3 bg-saudi-green text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          {buttonText}
        </Link>
      </div>

      {/* Decorative Element */}
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-saudi-green to-green-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
    </div>
  );
}

export default FeatureCard;
