/**
 * Aurelia Amazon Store - Store Configuration & Sole-Seller Settings
 * All settings can be adjusted in the Seller Central portal.
 */

const STORE_CONFIG = {
  // Brand & Sole Seller Identity
  brandName: "AURELIA JEWELS",
  storeTagline: "Amazon-Style Curated Jewellery Store",
  sellerName: "Aurelia Jewels Official (Direct Manufacturer & Sole Seller)",
  merchantBadge: "Brand Owner & Exclusive Seller",
  sellerRating: "4.9 out of 5 stars (2,840 ratings across India)",
  currencySymbol: "?",
  currencyCode: "INR",

  // Contact & Order Routing Placeholders
  whatsappNumber: "919876543210", // 91 + 10-digit phone
  whatsappDisplay: "+91 98765 43210",
  supportEmail: "orders@aureliajewels.in",
  storeLocation: "Mumbai, Maharashtra, India",
  defaultPincode: "400001",
  defaultCity: "Mumbai",

  // Delivery & Amazon Prime/Express Rules
  expressDeliveryDays: 1, // Next-day delivery for Metro
  standardDeliveryDays: 3, // 3-4 days for Tier 2/3
  freeShippingThreshold: 499, // Free delivery across India on orders above ?499
  standardShippingFee: 49,
  primeDeliveryBadgeText: "Luxe Express | FREE Next-Day Delivery",
  codAvailable: true,

  // Promo & Seller Central Security
  promoDiscountCode: "LUXE10",
  promoDiscountPercent: 10,
  sellerPin: "1234", // PIN for Seller Central / Owner dashboard

  // Indian Payment & Logistics
  upiId: "aureliajewels@upi",
  logisticsPartners: ["Amazon Shipping / Shiprocket", "Delhivery Direct", "Blue Dart Express"]
};

window.STORE_CONFIG = STORE_CONFIG;
