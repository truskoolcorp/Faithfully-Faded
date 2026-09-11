export const PRODUCTS = [
  {
    id: 'hooded-baseball-jersey-dress',
    name: 'Hooded Baseball Jersey Dress',
    category: 'Signature Collection',
    price: 69,
    badge: 'Bestseller',
    emoji: '👗',
    image: '/images/products/hooded-baseball-jersey-dress-product.png',
    description: 'The piece that started it all. Our signature hooded baseball jersey dress blends streetwear attitude with feminine energy — oversized fit, embroidered butterfly mark, and an attached hood that elevates every silhouette.',
    details: ['Premium poly-mesh construction', 'Embroidered FF butterfly logo', 'Attached hood with drawstring', 'Side-seam pockets', 'Oversized relaxed fit', 'Machine wash cold, hang dry'],
    colors: [
      { name: 'Maroon', hex: '#420420' },
      { name: 'Midnight', hex: '#1a1a6b' },
      { name: 'Onyx', hex: '#1a1a1a' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'signature-crop-hoodie',
    name: 'Signature Crop Hoodie',
    category: 'Streetwear',
    price: 54,
    badge: null,
    emoji: '👕',
    image: 'data:image/webp;base64,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',
    description: 'Heavyweight French terry meets cropped silhouette. The Signature Crop Hoodie is boxy, bold, and built for layering. Dropped shoulders, raw-cut hem, and the butterfly embroidered at the chest.',
    details: ['380gsm heavyweight French terry', 'Cropped boxy fit', 'Dropped shoulder seams', 'Raw-cut hem finish', 'Kangaroo pocket', 'Embroidered butterfly chest logo'],
    colors: [
      { name: 'Maroon', hex: '#420420' },
      { name: 'Charcoal', hex: '#2d2d2d' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'butterfly-varsity-tee',
    name: 'Butterfly Varsity Tee',
    category: 'Essentials',
    price: 38,
    badge: 'New',
    emoji: '✦',
    image: '/images/products/butterfly-varsity-tee.png',
    description: 'The everyday essential. Garment-dyed with a vintage wash that feels broken in from day one. The oversized butterfly print on the back with "Faithfully Faded" varsity lettering makes this tee a statement.',
    details: ['100% ring-spun cotton', 'Garment-dyed vintage wash', 'Oversized back graphic', 'Unisex relaxed fit', 'Ribbed crew neck', 'Pre-shrunk'],
    colors: [
      { name: 'Blush', hex: '#fff0fb' },
      { name: 'Maroon', hex: '#420420' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'ff-dad-cap',
    name: 'FF Butterfly Dad Cap',
    category: 'Accessories',
    price: 32,
    badge: null,
    emoji: '🧢',
    image: '/images/products/ff-butterfly-dad-cap.png',
    description: 'Unstructured low-profile dad cap with the FF butterfly embroidered front and center. "Just be Blunt" stitched on the back strap. Brass buckle closure for that premium feel.',
    details: ['100% washed cotton twill', 'Unstructured low-profile crown', 'Embroidered butterfly logo', '"Just be Blunt" back strap text', 'Brass buckle closure', 'One size fits most'],
    colors: [
      { name: 'Maroon', hex: '#420420' },
      { name: 'Black', hex: '#111111' },
      { name: 'Sage', hex: '#8fa68f' },
    ],
    sizes: ['One Size'],
  },
  {
    id: 'culture-joggers',
    name: 'Culture Joggers',
    category: 'Streetwear',
    price: 62,
    badge: null,
    emoji: '👖',
    image: 'data:image/webp;base64,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',
    description: 'Tapered French terry joggers built for the culture. Embroidered FF mark at the hip, ribbed ankle cuffs, and a fit that transitions from studio to street without missing a beat.',
    details: ['340gsm French terry', 'Tapered slim fit', 'Elastic waistband with drawstring', 'Ribbed ankle cuffs', 'Side pockets + back welt pocket', 'Embroidered FF mark at hip'],
    colors: [
      { name: 'Onyx', hex: '#1a1a1a' },
      { name: 'Maroon', hex: '#420420' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'verde-pullover',
    name: 'Verde Edition Pullover',
    category: 'Limited Edition',
    price: 78,
    badge: 'Limited',
    emoji: '🦋',
    image: '/images/products/verde-edition-pullover.png',
    description: 'Limited to 100 units worldwide. The Verde Edition features our green butterfly embroidery on 420gsm heavyweight cotton. Each piece carries a numbered interior tag. When they\'re gone, they\'re gone.',
    details: ['420gsm heavyweight cotton', 'Verde (green) butterfly embroidery', 'Numbered interior tag (1-100)', 'Oversized relaxed fit', 'Ribbed cuffs and hem', 'Limited to 100 units'],
    colors: [
      { name: 'Forest', hex: '#1a3a1a' },
      { name: 'Onyx', hex: '#1a1a1a' },
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
  },
]

export function getProduct(slug) {
  return PRODUCTS.find(p => p.id === slug) || null
}

export function getRelatedProducts(slug, count = 3) {
  return PRODUCTS.filter(p => p.id !== slug).slice(0, count)
}
