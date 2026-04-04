import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ name, image, slug, description = '' }) => {
  const { t } = useTranslation();
  const fallbackImage = 'https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <Link to={`/products/${slug}`} onClick={() => window.scrollTo(0, 0)}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl cursor-pointer h-full flex flex-col min-h-[320px] sm:min-h-[340px]">
        <div className="h-40 sm:h-44 md:h-48 overflow-hidden shrink-0 bg-gray-100">
          <img 
            src={image || fallbackImage}
            alt={name}
            className="w-full h-full object-cover object-center"
            onError={(event) => {
              event.currentTarget.src = fallbackImage;
            }}
          />
        </div>
        <div className="p-4 text-left bg-gradient-to-br from-primary-50 to-white flex-1 flex flex-col min-h-0">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">{name}</h3>
          {description ? (
            <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-1" title={description}>
              {description}
            </p>
          ) : (
            <div className="flex-1" aria-hidden />
          )}
          <p className="text-sm text-primary-600 mt-auto pt-3">{t('productCard.viewDetails')}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
