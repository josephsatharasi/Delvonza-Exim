import { Link } from 'react-router-dom';

const ProductCard = ({ name, image, slug }) => {
  const fallbackImage = 'https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <Link to={`/products/${slug}`} onClick={() => window.scrollTo(0, 0)}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl cursor-pointer">
        <div className="h-56 overflow-hidden">
          <img 
            src={image || fallbackImage}
            alt={name}
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.src = fallbackImage;
            }}
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
