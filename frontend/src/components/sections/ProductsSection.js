import ProductCard from '../common/ProductCard';

const ProductsSection = () => {
  const products = [
    { name: 'Black Pepper', image: 'https://images.pexels.com/photos/4198933/pexels-photo-4198933.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'black-pepper' },
    { name: 'Turmeric', image: 'https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'turmeric' },
    { name: 'Cardamom', image: 'https://images.pexels.com/photos/4198943/pexels-photo-4198943.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'cardamom' },
    { name: 'Dried Chillies', image: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'dried-red-chillies' },
    { name: 'Cinnamon', image: 'https://images.pexels.com/photos/4198951/pexels-photo-4198951.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'cinnamon' },
    { name: 'Cloves', image: 'https://images.pexels.com/photos/4198948/pexels-photo-4198948.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'cloves' },
    { name: 'Cumin Seeds', image: 'https://images.pexels.com/photos/4198939/pexels-photo-4198939.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'cumin-seeds' },
    { name: 'Ginger', image: 'https://images.pexels.com/photos/1002543/pexels-photo-1002543.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'ginger' }
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Premium Spices</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          We export a wide range of authentic Indian spices, carefully selected for their quality, aroma, and flavor
        </p>
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-[0_1_100%] w-full max-w-[280px] sm:flex-[0_1_calc(50%-12px)] sm:max-w-[calc(50%-12px)] md:flex-[0_1_calc(33.333%-16px)] md:max-w-[calc(33.333%-16px)] lg:flex-[0_1_260px] lg:max-w-[260px] lg:w-[260px]"
            >
              <ProductCard name={product.name} image={product.image} slug={product.slug} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
