import { useState } from 'react';

function InfoCard({ info }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Decode base64 image if available
  const getImageSrc = () => {
    if (info.imageBase64 && info.imageMimeType) {
      return `data:${info.imageMimeType};base64,${info.imageBase64}`;
    }
    return null;
  };

  const imageSrc = getImageSrc();
  const hasLongAnswer = info.answer && info.answer.length > 200;

  return (
    <div className="bg-light rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-102">
      {/* Image */}
      {imageSrc && (
        <div className="rounded-lg overflow-hidden shadow-lg mb-4 bg-gray-50">
          <img
            src={imageSrc}
            alt="Info visual"
            className="w-full max-h-64 object-contain"
          />
        </div>
      )}

      {/* Question/Term */}
      {info.term && (
        <div className="mb-3">
          <span className="inline-block bg-secondary text-light px-3 py-1 rounded-full text-sm font-bold mb-2">
            مصطلح
          </span>
          <h3 className="text-xl font-bold text-primary">{info.term}</h3>
          {info.termMeaning && (
            <p className="text-primary/70 mt-1">{info.termMeaning}</p>
          )}
        </div>
      )}

      {info.questionText && (
        <h3 className="text-xl font-bold text-primary mb-3">
          {info.questionText}
        </h3>
      )}

      {/* Answer */}
      {info.answer && (
        <div className="mb-4">
          <p className={`text-primary leading-relaxed ${!isExpanded && hasLongAnswer ? 'line-clamp-4' : ''}`}>
            {info.answer}
          </p>
          {hasLongAnswer && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-secondary hover:text-accent font-semibold mt-2 transition-colors duration-300"
            >
              {isExpanded ? '← عرض أقل' : 'عرض المزيد →'}
            </button>
          )}
        </div>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {info.category && (
          <span className="bg-accent/20 text-primary px-3 py-1 rounded-lg text-sm font-semibold border border-accent">
            {info.category}
          </span>
        )}
        {info.region && (
          <span className="bg-secondary/20 text-primary px-3 py-1 rounded-lg text-sm font-semibold border border-secondary">
            {info.region}
          </span>
        )}
        {info.language && (
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">
            {info.language}
          </span>
        )}
      </div>
    </div>
  );
}

export default InfoCard;
