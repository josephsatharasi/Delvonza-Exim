import { Link } from 'react-router-dom';

const ProductCard = ({ name, image, slug }) => {
  return (
    <Link to={`/products/${slug}`} onClick={() => window.scrollTo(0, 0)}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl cursor-pointer">
        <div className="h-56 overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 text-center bg-gradient-to-br from-primary-50 to-white">
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-primary-600 mt-2">View Details →</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
