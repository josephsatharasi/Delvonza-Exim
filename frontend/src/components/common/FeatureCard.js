const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition transform hover:-translate-y-1">
      <div className="flex justify-center mb-4">
        <div className="bg-primary-50 p-4 rounded-full">
          <Icon className="w-12 h-12 text-primary-600" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
