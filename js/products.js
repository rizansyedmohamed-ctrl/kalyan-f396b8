/**
 * Aurelia Amazon Store - Product Repository & Amazon Catalogue
 * Every product is sold exclusively by the store owner (sole-seller).
 */

const DEFAULT_PRODUCTS = [
  // 1. HOOP EARRINGS (Initial demo price: ?250 as required)
  {
    id: "prod_hoop_01",
    name: "Classic French Chunky Croissant Hoop Earrings - 18K Gold Plated 316L Stainless Steel",
    category: "Hoop earrings",
    categorySlug: "hoop-earrings",
    price: 250,
    originalPrice: 499,
    discountPercent: 50,
    isSample: true,
    isBestseller: true,
    isAmazonChoice: true,
    isDealOfDay: true,
    dealEndsInHours: 6,
    rating: 4.8,
    reviewsCount: 142,
    ratingBreakdown: { 5: 82, 4: 12, 3: 4, 2: 1, 1: 1 },
    metalType: "18K Gold Plated",
    style: "Daily Wear",
    inStock: true,
    stockCount: 38,
    sampleNote: "Sample product for demonstration. Replace with verified supplier items in Seller Central.",
    description: "Sculptural French croissant ribbed chunky hoop earrings. Crafted with medical-grade 316L stainless steel and finished with vacuum PVD 18K real gold tone. 100% waterproof, sweatproof, and guaranteed anti-tarnish for sensitive ears.",
    aboutBullets: [
      "ANTI-TARNISH PVD TECHNOLOGY: Vacuum PVD coating bonds 18K real gold to 316L stainless steel for 10x longer durability than normal fashion jewellery.",
      "100% SHOWER & GYM PROOF: Wear them in hot showers, swimming pools, or daily workouts without green skin marks or peeling.",
      "SKIN-FRIENDLY & HYPOALLERGENIC: Certified nickel-free and lead-free. Gentle on the most sensitive earlobes.",
      "LIGHTWEIGHT COMFORT: Ultra-hollow lightweight design (only 4.2g per hoop) for all-day painless wear.",
      "SECURE SNAP LATCH: Snaps firmly in place with audible click to prevent accidental loss."
    ],
    specs: {
      "Brand": "Aurelia Jewels (Sole Maker)",
      "Collection": "Parisian Everyday Elegance",
      "Base Metal": "316L Marine-Grade Stainless Steel",
      "Surface Plating": "18K PVD Anti-Tarnish Gold",
      "Diameter": "22 mm",
      "Thickness": "5 mm",
      "Clasp Type": "Secure Snap Bar Latch",
      "Water Resistance": "100% Waterproof & Sweatproof",
      "Warranty": "1-Year Anti-Tarnish Assurance"
    },
    variants: [
      { name: "18K Yellow Gold", sku: "HOOP-01-GLD", inStock: true },
      { name: "Rose Gold", sku: "HOOP-01-RSG", inStock: true },
      { name: "Silver Tone", sku: "HOOP-01-SLV", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611591475853-29f7988365df?q=80&w=800&auto=format&fit=crop"
    ],
    frequentlyBoughtWith: "prod_neck_01",
    privateDropshipping: {
      supplierCost: 95,
      shippingCost: 45,
      supplierName: "Artisan Wholesale Unit Alpha",
      supplierLink: "",
      stockStatus: "Verified Sample Supplier"
    }
  },
  {
    id: "prod_hoop_02",
    name: "Celestial Starburst Huggie Hoops with AAA Cubic Zirconia Drops",
    category: "Hoop earrings",
    categorySlug: "hoop-earrings",
    price: 250,
    originalPrice: 450,
    discountPercent: 44,
    isSample: true,
    isBestseller: false,
    isAmazonChoice: false,
    isDealOfDay: false,
    dealEndsInHours: 0,
    rating: 4.7,
    reviewsCount: 88,
    ratingBreakdown: { 5: 75, 4: 18, 3: 5, 2: 2, 1: 0 },
    metalType: "18K Gold Plated",
    style: "Office Wear",
    inStock: true,
    stockCount: 24,
    sampleNote: "Sample product for demonstration.",
    description: "Dainty 12mm huggie hoops featuring a radiant starburst crystal charm. Hugs your earlobe comfortably with zero snagging on clothing or hair.",
    aboutBullets: [
      "AAA GRADE ZIRCONIA: Brilliant micro-faceted sparkle that mirrors natural diamonds.",
      "ANTI-DISCOLORATION: Stainless steel core prevents fading or black spots over time.",
      "EVERYDAY SLEEP-SAFE: Flat huggie closure comfortable enough to sleep in.",
      "PERFECT GIFT: Packaged in signature Aurelia luxury pouch."
    ],
    specs: {
      "Brand": "Aurelia Jewels (Sole Maker)",
      "Collection": "Celestial Night Sky",
      "Base Metal": "Hypoallergenic Stainless Steel",
      "Stone": "AAA Brilliant Cut Cubic Zirconia",
      "Hoop Diameter": "12 mm",
      "Closure": "Seamless Clicker Clasp"
    },
    variants: [
      { name: "18K Yellow Gold", sku: "HOOP-02-GLD", inStock: true },
      { name: "Silver Tone", sku: "HOOP-02-SLV", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
    ],
    frequentlyBoughtWith: "prod_ring_01",
    privateDropshipping: {
      supplierCost: 90,
      shippingCost: 45,
      supplierName: "Wholesale Sparkle Ltd",
      supplierLink: "",
      stockStatus: "Sample Stock Placeholder"
    }
  },

  // 2. STUD EARRINGS
  {
    id: "prod_stud_01",
    name: "Solitaire Emerald-Cut Crystal Stud Earrings in 4-Prong 18K Gold Setting",
    category: "Stud earrings",
    categorySlug: "stud-earrings",
    price: 299,
    originalPrice: 599,
    discountPercent: 50,
    isSample: true,
    isBestseller: true,
    isAmazonChoice: true,
    isDealOfDay: true,
    dealEndsInHours: 8,
    rating: 4.9,
    reviewsCount: 194,
    ratingBreakdown: { 5: 86, 4: 10, 3: 3, 2: 1, 1: 0 },
    metalType: "18K Gold Plated",
    style: "Office Wear",
    inStock: true,
    stockCount: 50,
    sampleNote: "Sample product for demonstration.",
    description: "Understated elegance. Step-cut rectangular emerald zirconia encased in four rounded prongs with medical-grade hypoallergenic surgical steel posts.",
    aboutBullets: [
      "VINTAGE STEP CUT: Clean optical symmetry providing crisp white light refraction.",
      "SILICONE SECURITY BACKS: Includes both butterfly metal backings and silicone comfort discs.",
      "100% NON-RUSTING: Resists sweat, perfumes, and bath water without color degradation."
    ],
    specs: {
      "Brand": "Aurelia Jewels (Sole Maker)",
      "Stone Cut": "Emerald Step Cut (7x5 mm)",
      "Setting": "4-Prong Basket Setting",
      "Post Metal": "316L Surgical Grade Steel"
    },
    variants: [
      { name: "Champagne Gold", sku: "STUD-01-GLD", inStock: true },
      { name: "Classic Silver", sku: "STUD-01-SLV", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
    ],
    frequentlyBoughtWith: "prod_neck_02",
    privateDropshipping: {
      supplierCost: 110,
      shippingCost: 45,
      supplierName: "Prism Jewels Supplier",
      supplierLink: "",
      stockStatus: "Sample Stock Placeholder"
    }
  },

  // 3. JHUMKAS
  {
    id: "prod_jhumka_01",
    name: "Meenakari Lotus Dome Traditional Jhumkas with Anti-Tarnish Sealing",
    category: "Jhumkas",
    categorySlug: "jhumkas",
    price: 499,
    originalPrice: 999,
    discountPercent: 50,
    isSample: true,
    isBestseller: true,
    isAmazonChoice: true,
    isDealOfDay: true,
    dealEndsInHours: 12,
    rating: 5.0,
    reviewsCount: 218,
    ratingBreakdown: { 5: 92, 4: 6, 3: 2, 2: 0, 1: 0 },
    metalType: "18K Gold Plated",
    style: "Festive",
    inStock: true,
    stockCount: 42,
    sampleNote: "Sample product for demonstration.",
    description: "Royal dome jhumkas featuring delicate floral filigree and hand-enamelled ivory Meenakari petals. Sealed with a clear micro-lacquer shield to resist humidity during Indian festive celebrations.",
    aboutBullets: [
      "ROYAL HERITAGE DESIGN: Inspired by Jaipur royal court filigree with dancing pearl bells.",
      "ANTI-OXIDATION COATING: Specially coated to prevent monsoon dampness and oxidation.",
      "FEATHERLIGHT: Weighted to avoid stretching pierced earlobes."
    ],
    specs: {
      "Brand": "Aurelia Jewels (Sole Maker)",
      "Craftsmanship": "Hand Enamelling & Filigree",
      "Drop Length": "5.5 cm",
      "Dome Width": "2.2 cm",
      "Occasion": "Weddings, Diwali, Festivals, Ethnic Wear"
    },
    variants: [
      { name: "Ivory & Antique Gold", sku: "JHM-01-IVR", inStock: true },
      { name: "Blush Rose & Gold", sku: "JHM-01-ROSE", inStock: true },
      { name: "Mint Green & Gold", sku: "JHM-01-MNT", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop"
    ],
    frequentlyBoughtWith: "prod_set_01",
    privateDropshipping: {
      supplierCost: 190,
      shippingCost: 45,
      supplierName: "Jaipur Heritage Arts",
      supplierLink: "",
      stockStatus: "Sample Stock Placeholder"
    }
  },

  // 4. NECKLACES
  {
    id: "prod_neck_01",
    name: "Herringbone Snake Chain Layered Flat Necklace - 18K Gold PVD 316L Steel",
    category: "Necklaces",
    categorySlug: "necklaces",
    price: 399,
    originalPrice: 799,
    discountPercent: 50,
    isSample: true,
    isBestseller: true,
    isAmazonChoice: true,
    isDealOfDay: true,
    dealEndsInHours: 4,
    rating: 4.9,
    reviewsCount: 310,
    ratingBreakdown: { 5: 88, 4: 9, 3: 2, 2: 1, 1: 0 },
    metalType: "316L Stainless Steel",
    style: "Daily Wear",
    inStock: true,
    stockCount: 65,
    sampleNote: "Sample product for demonstration.",
    description: "The internet's favorite liquid gold chain necklace. Silky smooth flexible herringbone links that contour smoothly over collarbones without pinching or tangling hair.",
    aboutBullets: [
      "LIQUID GOLD DRAPE: Smooth interlocking herringbone weave lays perfectly flat.",
      "100% WATERPROOF: Shower, sweat, and swim without tarnishing or fading.",
      "EXTENDER INCLUDED: 40 cm base length + 5 cm adjustable extension chain."
    ],
    specs: {
      "Brand": "Aurelia Jewels (Sole Maker)",
      "Chain Type": "Herringbone Ribbon Snake Chain",
      "Width": "3.2 mm",
      "Length": "40 cm + 5 cm extender",
      "Clasp": "Heavy-Duty Lobster Claw Clasp"
    },
    variants: [
      { name: "18K Yellow Gold", sku: "NCK-01-GLD", inStock: true },
      { name: "Silver Polish", sku: "NCK-01-SLV", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop"
    ],
    frequentlyBoughtWith: "prod_hoop_01",
    privateDropshipping: {
      supplierCost: 150,
      shippingCost: 45,
      supplierName: "Steel Chain Specialists",
      supplierLink: "",
      stockStatus: "Sample Stock Placeholder"
    }
  },
  {
    id: "prod_neck_02",
    name: "Solitaire Evil Eye Talisman Pendant Necklace with Azure Mother of Pearl",
    category: "Necklaces",
    categorySlug: "necklaces",
    price: 349,
    originalPrice: 699,
    discountPercent: 50,
    isSample: true,
    isBestseller: false,
    isAmazonChoice: false,
    isDealOfDay: false,
    dealEndsInHours: 0,
    rating: 4.8,
    reviewsCount: 112,
    ratingBreakdown: { 5: 80, 4: 14, 3: 4, 2: 2, 1: 0 },
    metalType: "18K Gold Plated",
    style: "Daily Wear",
    inStock: true,
    stockCount: 28,
    sampleNote: "Sample product for demonstration.",
    description: "Protective amulet medallion centered with natural azure shell and crystal iris. Lightweight cable chain that layers gracefully.",
    aboutBullets: [
      "PROTECTION AMULET: Symbol of good luck and shield against negative energies.",
      "REAL MOTHER OF PEARL: Natural luminous sheen that catches daylight.",
      "TARNISH RESISTANT: Tested in salt water and humidity."
    ],
    specs: {
      "Brand": "Aurelia Jewels (Sole Maker)",
      "Pendant Diameter": "14 mm",
      "Chain Length": "42 cm + 5 cm",
      "Stone": "Natural Mother of Pearl & Sapphire Blue CZ"
    },
    variants: [
      { name: "Gold & Azure Blue", sku: "NCK-02-GLD", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1611591475853-29f7988365df?q=80&w=800&auto=format&fit=crop"
    ],
    frequentlyBoughtWith: "prod_brac_02",
    privateDropshipping: {
      supplierCost: 130,
      shippingCost: 45,
      supplierName: "Amulet Craft Supplier",
      supplierLink: "",
      stockStatus: "Sample Stock Placeholder"
    }
  },

  // 5. RINGS
  {
    id: "prod_ring_01",
    name: "Croissant Dome Sculptural Stacking Ring - Adjustable Size (Indian 12 to 18)",
    category: "Rings",
    categorySlug: "rings",
    price: 299,
    originalPrice: 599,
    discountPercent: 50,
    isSample: true,
    isBestseller: true,
    isAmazonChoice: true,
    isDealOfDay: false,
    dealEndsInHours: 0,
    rating: 4.9,
    reviewsCount: 167,
    ratingBreakdown: { 5: 85, 4: 11, 3: 3, 2: 1, 1: 0 },
    metalType: "18K Gold Plated",
    style: "Daily Wear",
    inStock: true,
    stockCount: 45,
    sampleNote: "Sample product for demonstration.",
    description: "Chic ribbed croissant dome statement ring. Hand-buffed mirror shine with an adjustable back band that comfortably fits Indian ring sizes 12 through 18.",
    aboutBullets: [
      "HAND-WASH & SANITIZER SAFE: Solid stainless steel core will not tarnish from hand soaps, sanitizers, or lotions.",
      "ADJUSTABLE OPEN BACK: Fits virtually any finger without measuring.",
      "BOLD STACKING DESIGN: Looks stunning worn solo on index or middle finger."
    ],
    specs: {
      "Brand": "Aurelia Jewels (Sole Maker)",
      "Dome Width": "7.5 mm",
      "Ring Size": "Adjustable (Indian 12 to 18 / US 6 to 9)",
      "Finish": "High-Gloss Mirror Buffed 18K PVD"
    },
    variants: [
      { name: "18K Yellow Gold", sku: "RNG-01-GLD", inStock: true },
      { name: "Silver Tone", sku: "RNG-01-SLV", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"
    ],
    frequentlyBoughtWith: "prod_hoop_01",
    privateDropshipping: {
      supplierCost: 110,
      shippingCost: 45,
      supplierName: "Ring Foundry Unit",
      supplierLink: "",
      stockStatus: "Sample Stock Placeholder"
    }
  },

  // 6. BRACELETS
  {
    id: "prod_brac_01",
    name: "Roman Numeral Hinged Oval Bangle Cuff with Micro-Pave Crystal Accents",
    category: "Bracelets",
    categorySlug: "bracelets",
    price: 449,
    originalPrice: 899,
    discountPercent: 50,
    isSample: true,
    isBestseller: true,
    isAmazonChoice: true,
    isDealOfDay: true,
    dealEndsInHours: 5,
    rating: 4.9,
    reviewsCount: 226,
    ratingBreakdown: { 5: 87, 4: 9, 3: 3, 2: 1, 1: 0 },
    metalType: "18K Gold Plated",
    style: "Party",
    inStock: true,
    stockCount: 30,
    sampleNote: "Sample product for demonstration.",
    description: "Luxury oval contour wrist bangle engraved with timeless Roman numerals and set with glistening micro-crystals. Engineered with a hidden press-and-pull safety clasp.",
    aboutBullets: [
      "ERGONOMIC OVAL SHAPE: Follows wrist anatomy so it won't spin around while typing or writing.",
      "CONCEALED SAFETY LOCK: Never catches on silk clothing or scarves.",
      "HIGH-GRADE ELECTRO-PVD: Keeps its vibrant champagne gold hue for years."
    ],
    specs: {
      "Brand": "Aurelia Jewels (Sole Maker)",
      "Inner Circumference": "17.5 cm (Fits wrists up to 6.8 inches)",
      "Clasp": "Concealed Pressure Latch",
      "Width": "6 mm"
    },
    variants: [
      { name: "Champagne Gold", sku: "BRC-01-GLD", inStock: true },
      { name: "Rose Gold", sku: "BRC-01-RSG", inStock: true },
      { name: "Silver Tone", sku: "BRC-01-SLV", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1611591475853-29f7988365df?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    frequentlyBoughtWith: "prod_neck_01",
    privateDropshipping: {
      supplierCost: 175,
      shippingCost: 45,
      supplierName: "Bangle Artisans Co",
      supplierLink: "",
      stockStatus: "Sample Stock Placeholder"
    }
  },
  {
    id: "prod_brac_02",
    name: "Dainty Paperclip Elongated Link Chain Bracelet with Lobster Lock",
    category: "Bracelets",
    categorySlug: "bracelets",
    price: 349,
    originalPrice: 650,
    discountPercent: 46,
    isSample: true,
    isBestseller: false,
    isAmazonChoice: false,
    isDealOfDay: false,
    dealEndsInHours: 0,
    rating: 4.8,
    reviewsCount: 79,
    ratingBreakdown: { 5: 79, 4: 15, 3: 4, 2: 2, 1: 0 },
    metalType: "316L Stainless Steel",
    style: "Daily Wear",
    inStock: true,
    stockCount: 40,
    sampleNote: "Sample product for demonstration.",
    description: "Sleek elongated rectangular paperclip link chain. Clean minimalist staple that pairs effortlessly with watches.",
    aboutBullets: [
      "VERSATILE LAYERING: Looks stunning beside your smartwatch or ethnic bangles.",
      "ADJUSTABLE CLASP: Fasten at any link for a custom snug fit.",
      "SWEAT & PERFUME RESISTANT: Zero oxidation."
    ],
    specs: {
      "Brand": "Aurelia Jewels (Sole Maker)",
      "Link Dimension": "4 x 10 mm",
      "Length": "16 cm + 4 cm extension"
    },
    variants: [
      { name: "18K Yellow Gold", sku: "BRC-02-GLD", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    frequentlyBoughtWith: "prod_ring_01",
    privateDropshipping: {
      supplierCost: 130,
      shippingCost: 45,
      supplierName: "Chain Links Ltd",
      supplierLink: "",
      stockStatus: "Sample Stock Placeholder"
    }
  },

  // 7. JEWELLERY SETS
  {
    id: "prod_set_01",
    name: "The Royal Rajwada Festive Kundan Polki Choker Necklace & Jhumka Earrings Bridal Set",
    category: "Jewellery sets",
    categorySlug: "jewellery-sets",
    price: 899,
    originalPrice: 1799,
    discountPercent: 50,
    isSample: true,
    isBestseller: true,
    isAmazonChoice: true,
    isDealOfDay: true,
    dealEndsInHours: 10,
    rating: 5.0,
    reviewsCount: 284,
    ratingBreakdown: { 5: 94, 4: 5, 3: 1, 2: 0, 1: 0 },
    metalType: "18K Gold Plated",
    style: "Festive",
    inStock: true,
    stockCount: 18,
    sampleNote: "Sample product for demonstration.",
    description: "Grand bridal and wedding choker necklace suite featuring precision hydro-polki uncut crystals, hand-finished Meenakari backing, and matching statement drop earrings. Protected by an anti-tarnish micro-seal.",
    aboutBullets: [
      "COMPLETE FESTIVE SET: Includes 1x Grand Choker Necklace + 1x Pair Statement Drop Earrings.",
      "ADJUSTABLE ZARI DORI: Handwoven gold cord fits all neck circumferences comfortably.",
      "MICRO-LACQUER COAT: Safeguards against sweat, haldi, and moisture during Indian wedding ceremonies."
    ],
    specs: {
      "Brand": "Aurelia Jewels (Sole Maker)",
      "Set Contents": "1 Choker Necklace, 2 Drop Earrings",
      "Stone": "Precision Hydro Polki Kundan with Emerald Beads",
      "Backing": "Traditional Hand-Painted Meenakari"
    },
    variants: [
      { name: "Emerald Green & Gold", sku: "SET-01-EMR", inStock: true },
      { name: "Ruby Red & Gold", sku: "SET-01-RBY", inStock: true },
      { name: "Classic Pearl Ivory", sku: "SET-01-IVR", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=800&auto=format&fit=crop"
    ],
    frequentlyBoughtWith: "prod_brac_01",
    privateDropshipping: {
      supplierCost: 380,
      shippingCost: 65,
      supplierName: "Rajasthan Royal Jewels",
      supplierLink: "",
      stockStatus: "Sample Stock Placeholder"
    }
  },
  {
    id: "prod_set_02",
    name: "Everyday Glow Duo Bundle: Croissant Hoops + Herringbone Snake Chain",
    category: "Jewellery sets",
    categorySlug: "jewellery-sets",
    price: 599,
    originalPrice: 1199,
    discountPercent: 50,
    isSample: true,
    isBestseller: true,
    isAmazonChoice: true,
    isDealOfDay: false,
    dealEndsInHours: 0,
    rating: 4.9,
    reviewsCount: 148,
    ratingBreakdown: { 5: 89, 4: 8, 3: 2, 2: 1, 1: 0 },
    metalType: "18K Gold Plated",
    style: "Daily Wear",
    inStock: true,
    stockCount: 35,
    sampleNote: "Sample product for demonstration.",
    description: "Curated 2-piece starter bundle pairing our #1 bestselling 22mm Croissant Hoops with the 3mm Herringbone Chain. Instant coordinated luxury.",
    aboutBullets: [
      "BEST VALUE COMBO: Save ?50 additional compared to buying pieces individually.",
      "100% MATCHING 18K PVD FINISH: Guaranteed identical warm champagne gold luster.",
      "SHOWER & WORKOUT READY: Solid stainless steel construction."
    ],
    specs: {
      "Brand": "Aurelia Jewels (Sole Maker)",
      "Includes": "1x Croissant Hoops (22mm), 1x Herringbone Necklace (40+5cm)",
      "Base Metal": "316L Surgical Stainless Steel"
    },
    variants: [
      { name: "18K Yellow Gold Duo", sku: "SET-02-GLD", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    frequentlyBoughtWith: "prod_ring_01",
    privateDropshipping: {
      supplierCost: 230,
      shippingCost: 45,
      supplierName: "Aurelia Assembly Hub",
      supplierLink: "",
      stockStatus: "Sample Stock Placeholder"
    }
  }
];

class ProductRepository {
  constructor() {
    this.storageKey = "aurelia_amazon_products_v2";
    this.init();
  }

  init() {
    const existing = localStorage.getItem(this.storageKey);
    if (!existing) {
      localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_PRODUCTS));
    }
  }

  // Returns public products with private dropshipping and wholesale costs stripped out
  getAllPublic() {
    const raw = this.getAllRaw();
    return raw.map(item => {
      const { privateDropshipping, ...publicItem } = item;
      return publicItem;
    });
  }

  // Returns raw products including private dropshipping fields (FOR SELLER CENTRAL ONLY)
  getAllRaw() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
    } catch (e) {
      return DEFAULT_PRODUCTS;
    }
  }

  getById(id) {
    const items = this.getAllRaw();
    return items.find(p => p.id === id) || null;
  }

  // Seller Central: Add New Product
  addProduct(newProduct) {
    const items = this.getAllRaw();
    // Generate clean id
    const id = "prod_user_" + Date.now();
    const discountPercent = newProduct.originalPrice > newProduct.price 
      ? Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)
      : 0;

    const formatted = {
      id,
      name: newProduct.name,
      category: newProduct.category,
      categorySlug: newProduct.category.toLowerCase().replace(/\s+/g, "-"),
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice || newProduct.price),
      discountPercent,
      isSample: false,
      isBestseller: Boolean(newProduct.isBestseller),
      isAmazonChoice: Boolean(newProduct.isAmazonChoice),
      isDealOfDay: Boolean(newProduct.isDealOfDay),
      dealEndsInHours: newProduct.isDealOfDay ? 12 : 0,
      rating: 5.0,
      reviewsCount: 1,
      ratingBreakdown: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
      metalType: newProduct.metalType || "18K Gold Plated",
      style: newProduct.style || "Daily Wear",
      inStock: true,
      stockCount: Number(newProduct.stockCount || 25),
      description: newProduct.description,
      aboutBullets: newProduct.aboutBullets && newProduct.aboutBullets.length ? newProduct.aboutBullets : [
        "18K PVD Anti-Tarnish Vacuum Plating on surgical grade metal.",
        "100% Shower and sweat proof everyday comfort.",
        "Skin safe, hypoallergenic, nickel and lead free."
      ],
      specs: {
        "Brand": window.STORE_CONFIG.brandName + " (Sole Maker)",
        "Collection": "Signature Collection",
        "Base Metal": newProduct.baseMetal || "316L Stainless Steel",
        "Surface Finish": newProduct.metalType || "18K Gold Plated",
        "Water Resistance": "100% Waterproof"
      },
      variants: newProduct.variants && newProduct.variants.length ? newProduct.variants : [
        { name: "18K Yellow Gold", sku: id + "-GLD", inStock: true }
      ],
      images: newProduct.images && newProduct.images.length ? newProduct.images : [
        "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
      ],
      frequentlyBoughtWith: items[0] ? items[0].id : null,
      privateDropshipping: {
        supplierCost: Number(newProduct.supplierCost || 0),
        shippingCost: Number(newProduct.shippingCost || 45),
        supplierName: newProduct.supplierName || "Direct Workshop",
        supplierLink: "",
        stockStatus: "Owner Stock Confirmed"
      }
    };

    items.unshift(formatted);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return formatted;
  }

  // Seller Central: Update Product
  updateProduct(id, updatedFields) {
    const items = this.getAllRaw();
    const index = items.findIndex(p => p.id === id);
    if (index >= 0) {
      if (updatedFields.price && updatedFields.originalPrice) {
        updatedFields.discountPercent = Math.round(((updatedFields.originalPrice - updatedFields.price) / updatedFields.originalPrice) * 100);
      }
      items[index] = { ...items[index], ...updatedFields };
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      return true;
    }
    return false;
  }

  // Seller Central: Delete Product
  deleteProduct(id) {
    const items = this.getAllRaw().filter(p => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return true;
  }

  resetToDefault() {
    localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_PRODUCTS));
  }
}

window.productRepo = new ProductRepository();
window.DEFAULT_CATEGORIES = [
  "All Categories",
  "Hoop earrings",
  "Stud earrings",
  "Jhumkas",
  "Necklaces",
  "Rings",
  "Bracelets",
  "Jewellery sets"
];
