import { Link } from 'react-router-dom';

const ProductCard = ({ name, image, slug, description = '' }) => {
  const fallbackImage = 'https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <Link to={`/products/${slug}`} onClick={() => window.scrollTo(0, 0)}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl cursor-pointer h-full flex flex-col">
        <div className="h-56 overflow-hidden shrink-0">
          <img 
            src={image || fallbackImage}
            alt={name}
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.src = fallbackImage;
            }}
          />
        </div>
        <div className="p-4 text-left bg-gradient-to-br from-primary-50 to-white flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
          {description ? (
            <p className="text-sm text-gray-600 mt-2 line-clamp-3" title={description}>
              {description}
            </p>
          ) : null}
          <p className="text-sm text-primary-600 mt-3">View Details →</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
