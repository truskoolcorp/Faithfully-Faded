const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { createHash } = require('node:crypto')
const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const output = {}
vm.runInNewContext(read('lib/products.js').replace(/export /g, '') + '; output.products = PRODUCTS', { output })
const dress = JSON.parse(JSON.stringify(output.products[0]))
const image = '/images/products/hooded-baseball-jersey-dress-front-back-v2.jpg'
const oldImages = ['hooded-baseball-jersey-dress-product.png', 'hooded-baseball-jersey-dress.png', 'file_000000008b54820db3cfd85e7a0d6c51.jpg']

test('reviewed dress photo is the exact unaltered owner-supplied JPEG', () => {
  const bytes = fs.readFileSync(path.join(root, 'public', image))
  assert.equal(bytes.length, 419757)
  assert.equal(createHash('sha256').update(bytes).digest('hex'), 'cd89448c0271455cfc3fc2035e3184d060f239796a816db1ba66de002b1ba461')
  assert.equal(dress.image, image)
  assert.equal(dress.featuredImage, image)
  assert.equal(dress.imageFit, 'contain')
  assert.match(dress.imageAlt, /Front and back/)
})
test('dress copy omits all pocket wording without changing sale terms', () => {
  assert.doesNotMatch(dress.details.join(' ') + ' ' + dress.description, /pocket/i)
  assert.equal(dress.price, 69)
  assert.deepEqual(dress.sizes, ['S', 'M', 'L', 'XL'])
  assert.equal(dress.inventoryModel, 'owned-stock')
  assert.deepEqual(dress.colors, [{ name: 'Maroon', hex: '#420420' }])
})
test('active sales surfaces do not reference superseded dress images', () => {
  function walk(dir) {
    for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (/\.(js|mjs|css)$/.test(file)) {
        for (const old of oldImages) assert.ok(!read(file).includes(old), `${file} still uses ${old}`)
      }
    }
  }
  for (const dir of ['app', 'components', 'lib']) walk(dir)
})
test('hero, dress product and related cards retain contain rendering', () => {
  const home = read('app/home-original.js')
  assert.match(home, /className="ff-hero-photo" src=\{heroProduct.image\}/)
  assert.match(home, /ff-hero-photo\{object-fit:contain!important/)
  assert.doesNotMatch(home, /className="ff-hero-shade"/)
  assert.match(home, /ff-hero\{[^}]*flex-direction:column!important/)
  const product = read('app/shop/[slug]/page.js')
  assert.match(product, /objectFit:product.imageFit \|\| 'cover'/)
  assert.match(product, /objectFit:p.imageFit \|\| 'cover'/)
  assert.match(product, /data-item-image=\{activeImage \? `https:\/\/www.faithfully-faded.com\$\{activeImage\}`/)
  const css = read('app/globals.css')
  const card = css.match(/#shop a\[href='\/shop\/hooded-baseball-jersey-dress'\] > div:first-child \{([^}]+)\}/)[1]
  assert.ok(card.includes(image))
  assert.match(card, /background-size: contain !important/)
  assert.match(css, /ff-dress-product-page \.ff-product-layout \{ grid-template-columns: minmax\(0, 1fr\)/)
})
test('feed and Meta checkout use only the corrected photo and omit pocket wording', async () => {
  const feed = await import('../lib/meta-product-feed.mjs')
  const checkout = await import('../lib/meta-checkout.mjs')
  const verified = feed.verifyProduct(dress)
  assert.equal(verified.image, 'https://www.faithfully-faded.com' + image)
  for (const old of oldImages) assert.throws(() => feed.verifyProduct({ ...dress, image: '/images/products/' + old }), /Unreviewed catalog image/)
  const rows = feed.META_VARIANTS.map(v => ({ sku: v.sku, on_hand: 2, reserved: 1 }))
  const xml = feed.renderMetaFeed(verified, feed.validateInventory(rows))
  assert.equal((xml.match(/<item>/g) || []).length, 4)
  assert.equal((xml.match(/front-back-v2.jpg/g) || []).length, 4)
  assert.doesNotMatch(xml, /pocket/i)
  const result = checkout.resolveCheckout(checkout.parseCheckoutQuery(new URLSearchParams('products=FF-JERSEY-DRESS-M:1')), dress, rows)
  assert.equal(result.items[0].image, verified.image)
  assert.doesNotMatch(result.items[0].description, /pocket/i)
  assert.equal(result.items[0].price, 69)
  assert.equal(result.items[0].maxQuantity, 1)
})
