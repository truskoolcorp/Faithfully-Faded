export const PRODUCTS = [
  {
    id: 'hooded-baseball-jersey-dress',
    name: 'Hooded Baseball Jersey Dress',
    category: 'Signature Collection',
    price: 69,
    badge: 'Bestseller',
    emoji: '👗',
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
