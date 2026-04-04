const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition transform hover:-translate-y-1 h-full flex flex-col">
      <div className="flex justify-center mb-4 shrink-0">
        <div className="bg-primary-50 p-4 rounded-full">
          <Icon className="w-12 h-12 text-primary-600" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 shrink-0">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed flex-1 min-h-[4.5rem] line-clamp-6" title={description}>
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
