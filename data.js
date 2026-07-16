/* ==========================================================================
   GILBO SPORTS STORE - SITE DATA
   This is the ONLY file that needs to change when the admin adds a product,
   updates a price, or changes stock/availability. No database, no PHP.

   PRICE RANGES: some items are sold at a range of prices (e.g. different
   sizes). Set "price" to the lowest price and "priceMax" to the highest.
   If there's only one price, just leave priceMax out (or equal to price).
   The exact amount for a specific size/variant is always confirmed with
   the customer on WhatsApp before the order is finalized.

   HOW THE ADMIN UPDATES THIS SITE:
   1. Open admin.html on the live site (or locally) and log in.
   2. Add/edit products, prices, and stock using the on-screen editor.
   3. Click "Download data.js".
   4. Go to the GitHub repository in a browser, open assets/js/data.js,
      click the pencil (edit) icon, delete everything, paste in the
      downloaded file's contents, and commit the change.
   5. GitHub Pages rebuilds automatically within about a minute.
   ========================================================================== */

/* Hero banner background slideshow - list your own photos here, in the order
   they should play. Add/replace files in assets/images/banner/ and list
   them here (top to bottom = play order). Any number of images works. */
const BANNER_IMAGES = [
  "assets/images/banner/banner-1.jpg",
  "assets/images/banner/banner-2.png",
  "assets/images/banner/banner-3.png",
   "assets/images/banner/banner-4.jpg",
"assets/images/banner/banner-5.jpg",
"assets/images/banner/banner-6.png",
"assets/images/banner/banner-7.jpg",
"assets/images/banner/banner-8.jpg"
];

const SHOP = {
  name: "Gilbo Sports Store",
  tagline: "Retail Clothing, Home Essentials & More — Kakira, Jinja, Uganda",
  currency: "UGX",
  whatsapp: "256754454502",      // digits only, used for WhatsApp links (country code + number, no leading 0)
  phoneDisplay: "0754 454 502",  // shown to customers as-is
  email: "graciousJr4@gmail.com",
  location: "Kakira, Jinja, Uganda",
  hours: "8:00 AM - 8:00 PM, Monday - Saturday"
};

const CATEGORIES = [
  { id: 1, name: "Men Wear" },
  { id: 2, name: "Women Wear" },
  { id: 3, name: "Kids Wear" },
  { id: 4, name: "Unisex Wear & Accessories" },
  { id: 5, name: "Home & Bedding" },
  { id: 6, name: "Bags" },
  { id: 7, name: "Baby Items" }
];

/* stock: a single number - this is a one-shop retail store.
   priceMax is optional - only set it when the item is sold across a range
   of prices (e.g. by size). */
const PRODUCTS = [
  { id: 1, categoryId: 1, name: "Men Jersey", description: "Sports jersey in various club and plain designs.", gender: "men", price: 15000, priceMax: 20000, image: "assets/images/products/men-jersey.jpg", active: true, stock: 30 },
  { id: 2, categoryId: 3, name: "Kids Jersey", description: "Durable, colorful jersey for kids.", gender: "kids", price: 15000, priceMax: 18000, image: "assets/images/products/kids-jersey.jpg", active: true, stock: 25 },
  { id: 3, categoryId: 1, name: "Men Casual T-Shirt", description: "Everyday casual t-shirt for men.", gender: "men", price: 15000, priceMax: 20000, image: "assets/images/products/men-tshirt.jpg", active: true, stock: 30 },
  { id: 4, categoryId: 1, name: "Men Inner Wear", description: "Everyday men's inner wear, various sizes.", gender: "men", price: 5000, priceMax: 8000, image: "assets/images/products/men-innerwear.jpg", active: true, stock: 40 },
  { id: 5, categoryId: 4, name: "Belts", description: "Durable belts for everyday and formal wear.", gender: "unisex", price: 5000, image: "assets/images/products/belts.jpg", active: true, stock: 50 },
    { id: 15, categoryId: 4, name: "Jeans", description: "Durable jeans for everyday and formal wear.", gender: "unisex",price: 25000, pricemax: 35000, image: "assets/images/products/jeans.jpg", active: true, stock: 50 },
{ id: 6, categoryId: 4, name: "Unisex Shorts", description: "Comfortable everyday shorts for men and women.", gender: "unisex", price: 20000, priceMax: 30000, image: "assets/images/products/unisex-shorts.jpg", active: true, stock: 35 },
  { id: 7, categoryId: 4, name: "Socks", description: "Everyday socks, various colors.", gender: "unisex", price: 2000, image: "assets/images/products/socks.jpg", active: true, stock: 100 },
  { id: 8, categoryId: 2, name: "Women Inner Wear", description: "Everyday women's inner wear, various sizes.", gender: "women", price: 4000, image: "assets/images/products/women-innerwear.jpg", active: true, stock: 40 },
  { id: 9, categoryId: 5, name: "Bedsheets", description: "Soft, durable bedsheets for home use.", gender: "unisex", price: 12000, image: "assets/images/products/bedsheets.jpg", active: true, stock: 20 },
  { id: 10, categoryId: 5, name: "Curtains", description: "Quality curtains in various sizes and designs.", gender: "unisex", price: 10000, priceMax: 15000, image: "assets/images/products/curtains.jpg", active: true, stock: 15 },
  { id: 11, categoryId: 5, name: "Bedcovers", description: "Warm and stylish bedcovers.", gender: "unisex", price: 20000, image: "assets/images/products/bedcovers.jpg", active: true, stock: 15 },
  { id: 12, categoryId: 5, name: "Blankets", description: "Warm blankets in various sizes and thicknesses.", gender: "unisex", price: 25000, priceMax: 50000, image: "assets/images/products/blankets.jpg", active: true, stock: 12 },
  { id: 13, categoryId: 6, name: "School & Office Bags", description: "Durable bags for school and office use, various sizes.", gender: "unisex", price: 20000, priceMax: 50000, image: "assets/images/products/bags.jpg", active: true, stock: 18 },
  { id: 14, categoryId: 7, name: "Baby Shower Sets", description: "Baby shower gift sets, ready for gifting.", gender: "unisex", price: 30000, image: "assets/images/products/baby-shower.jpg", active: true, stock: 10 }
];

/* Automatic feedback: keyword -> instant reply shown to the customer.
   Checked in priority order (highest first); first match wins. */
const AUTO_RESPONSES = [
  { keyword: "price", response: "Thank you for asking about our prices! All prices are shown in Ugandan Shillings (UGX) on each product page - some items are shown as a price range depending on size. Send this message on WhatsApp and our team will confirm the exact price you need.", priority: 10 },
  { keyword: "delivery", response: "Thanks for reaching out about delivery! We offer pickup at our Kakira, Jinja shop and delivery within Jinja and surrounding areas. Delivery fees depend on your location and will be confirmed by our team on WhatsApp.", priority: 9 },
  { keyword: "stock", response: "Thank you for checking on stock! The website shows live stock for each item. If an item shows as available, it is ready for pickup or delivery. Send us your item on WhatsApp and we'll confirm exact availability.", priority: 8 },
  { keyword: "payment", response: "Thanks for asking about payment! We accept MTN Mobile Money, Airtel Money, and Cash on Delivery/Pickup. Complete your order details and send them to us on WhatsApp to arrange payment.", priority: 8 },
  { keyword: "size", response: "Thanks for your sizing question! Gilbo Sports Store stocks a range of sizes across our clothing, bedding and bags. Send us your usual size and preferred item on WhatsApp and our team will confirm availability and exact price.", priority: 7 },
  { keyword: "location", response: "We are located in Kakira, Jinja, Uganda. Send us a message on WhatsApp and we'll share directions to help you find us easily.", priority: 6 },
  { keyword: "hello", response: "Hello and welcome to Gilbo Sports Store! Thank you for reaching out. Tap the button below to continue this conversation with our team directly on WhatsApp.", priority: 1 },
  { keyword: "hi", response: "Hi there! Thanks for contacting Gilbo Sports Store. Tap the button below to continue this conversation with our team directly on WhatsApp.", priority: 1 }
];
