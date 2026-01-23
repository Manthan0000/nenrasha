export const products = [
  {
    id: 1,
    name: 'V-neck cotton T-shirt',
    priceINR: 4999,
    priceUSD: 59.99,
    oldPriceINR: null,
    oldPriceUSD: null,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    isSale: false,
    discount: 0,
    category: 'clothing',
    colors: ['white', 'lightgray']
  },
  {
    id: 2,
    name: 'Polarized sunglasses',
    priceINR: 6599,
    priceUSD: 79.99,
    oldPriceINR: 8099,
    oldPriceUSD: 98.00,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop',
    isSale: true,
    discount: 25,
    category: 'accessories',
    colors: ['white', 'lavender']
  },
  {
    id: 3,
    name: 'Ramie shirt with pockets',
    priceINR: 7499,
    priceUSD: 89.99,
    oldPriceINR: 8099,
    oldPriceUSD: 98.00,
    image: 'https://images.unsplash.com/photo-1594938291221-94f18dd6d0b7?w=600&h=800&fit=crop',
    isSale: true,
    discount: 25,
    category: 'clothing',
    colors: ['orange', 'white']
  },
  {
    id: 4,
    name: 'Ribbed cotton-blend top',
    priceINR: 5799,
    priceUSD: 69.99,
    oldPriceINR: null,
    oldPriceUSD: null,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop',
    isSale: false,
    discount: 0,
    category: 'clothing',
    colors: ['taupe', 'pink', 'lightgray']
  },
  {
    id: 5,
    name: 'Faux-leather trousers',
    priceINR: 6599,
    priceUSD: 79.99,
    oldPriceINR: null,
    oldPriceUSD: null,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
    isSale: false,
    discount: 0,
    category: 'clothing',
    colors: ['orange', 'red']
  },
  {
    id: 6,
    name: 'Belt wrap dress',
    priceINR: 10799,
    priceUSD: 129.99,
    oldPriceINR: 8099,
    oldPriceUSD: 98.00,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
    isSale: true,
    discount: 25,
    category: 'clothing',
    colors: ['sagegreen', 'beige', 'white']
  },
  {
    id: 7,
    name: 'Double-button trench coat',
    priceINR: 18299,
    priceUSD: 219.99,
    oldPriceINR: 8099,
    oldPriceUSD: 98.00,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=800&fit=crop',
    isSale: true,
    discount: 25,
    category: 'clothing',
    colors: ['beige', 'orange', 'white']
  },
  {
    id: 8,
    name: 'Crossbody bag',
    priceINR: 4999,
    priceUSD: 59.99,
    oldPriceINR: null,
    oldPriceUSD: null,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop',
    isSale: false,
    discount: 0,
    category: 'bags',
    colors: ['brown']
  }
];

export const newArrivals = products.slice(0, 4);
export const bestSellers = products.slice(2, 6);
export const onSale = products.filter(p => p.isSale);
