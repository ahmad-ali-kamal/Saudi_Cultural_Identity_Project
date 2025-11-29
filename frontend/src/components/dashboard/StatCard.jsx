import PropTypes from 'prop-types';

/**
 * Reusable stat card component for displaying key metrics
 * Used in the dashboard to show totals, averages, and other stats
 */
function StatCard({ value, label }) {
  return (
    <div className="bg-light rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <h3 className="text-3xl font-bold text-primary mb-2">{value}</h3>
      <p className="text-primary font-semibold">{label}</p>
    </div>
  );
}

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
};

export default StatCard;
