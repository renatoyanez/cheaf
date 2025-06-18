import { ProductsProvider } from '../context/productsContext';
import Products from '../pages/products';

const ProductsLayout = () => {
  return (
    <ProductsProvider>
      <Products />
    </ProductsProvider>
  );
}

export default ProductsLayout;