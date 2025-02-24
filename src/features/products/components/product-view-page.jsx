import { fakeProducts } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';

export default async function ProductViewPage({
  productId
}) {
  let product = null;
  let pageTitle = 'Create New Service';

  if (productId !== 'new') {
    const data = await fakeProducts.getProductById(Number(productId));
    product = data.product;
    if (!product) {
      notFound();
    }
    pageTitle = `Edit Service`;
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}
