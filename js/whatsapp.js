/**
 * Aurelia Amazon Store - Amazon-Style WhatsApp Order Generator
 * Formats customer shopping cart and address details into a clean Amazon-style invoice.
 */

class WhatsAppService {
  constructor() {
    this.phone = window.STORE_CONFIG.whatsappNumber || "919876543210";
  }

  getPhoneNumber() {
    return window.STORE_CONFIG.whatsappNumber || "919876543210";
  }

  formatAmazonOrderMessage(customerDetails, cartItems, cartSummary) {
    const brand = window.STORE_CONFIG.brandName || "AURELIA JEWELS";
    const seller = window.STORE_CONFIG.sellerName || "Aurelia Jewels Official";
    const orderId = "AMZ-IN-" + Date.now().toString().slice(-6);
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    let msg = `??? *ORDER ENQUIRY - ${brand.toUpperCase()} STORE* ???\n`;
    msg += `?? *Sold By:* ${seller}\n`;
    msg += `?? *Reference ID:* #${orderId}\n`;
    msg += `?? *Order Date:* ${dateStr}\n`;
    msg += `==============================\n\n`;

    msg += `?? *DELIVERY ADDRESS:*\n`;
    msg += `? *Name:* ${customerDetails.name}\n`;
    msg += `? *Mobile:* ${customerDetails.phone}\n`;
    msg += `? *Address:* ${customerDetails.address}\n`;
    msg += `? *City, State:* ${customerDetails.city}, ${customerDetails.state}\n`;
    msg += `? *Pincode:* ${customerDetails.pincode}\n`;
    if (customerDetails.landmark) {
      msg += `? *Landmark:* ${customerDetails.landmark}\n`;
    }
    msg += `? *Payment Method:* ${customerDetails.paymentMethod}\n\n`;

    msg += `?? *ORDER ITEMS (${cartSummary.selectedCount} item${cartSummary.selectedCount > 1 ? "s" : ""}):*\n`;
    cartItems.forEach((item, index) => {
      const sampleTag = item.isSample ? " [Sample Item]" : "";
      msg += `${index + 1}. *${item.name}*${sampleTag}\n`;
      msg += `   ? Finish: ${item.variant}\n`;
      msg += `   ? Qty: ${item.quantity} ? ?${item.price} (M.R.P. ?${item.originalPrice})\n`;
      msg += `   ? Item Total: *?${item.quantity * item.price}*\n`;
    });
    msg += `\n==============================\n`;

    msg += `?? *PAYMENT SUMMARY:*\n`;
    msg += `? Items Subtotal: ?${cartSummary.subtotal}\n`;
    if (cartSummary.mrpSavings > 0) {
      msg += `? Total M.R.P. Savings: -?${cartSummary.mrpSavings}\n`;
    }
    if (cartSummary.promoDiscount > 0) {
      msg += `? Coupon (${cartSummary.appliedCoupon.code}): -?${cartSummary.promoDiscount}\n`;
    }
    msg += `? All-India Delivery: ${cartSummary.shippingFee === 0 ? "FREE (Luxe Express)" : "?" + cartSummary.shippingFee}\n`;
    msg += `? *ORDER TOTAL:* *?${cartSummary.finalTotal}*\n`;
    msg += `==============================\n\n`;

    msg += `?? *Note:* This is an order confirmation enquiry sent to the sole brand maker. Please confirm stock availability and share payment QR code (UPI/GPay/PhonePe) or COD dispatch details. Thank you!`;

    return { msg, orderId };
  }

  generateWhatsAppUrl(message) {
    const phone = this.getPhoneNumber();
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
  }

  // Quick single product buy (Amazon 1-Click Buy Now)
  generateSingleBuyUrl(product, variantName) {
    const brand = window.STORE_CONFIG.brandName || "AURELIA JEWELS";
    const chosenVariant = variantName || (product.variants && product.variants[0] ? product.variants[0].name : "Standard");
    const sampleTag = product.isSample ? " [Sample Item]" : "";

    let msg = `? *1-CLICK BUY ENQUIRY - ${brand.toUpperCase()}* ?\n\n`;
    msg += `Hi! I would like to purchase this jewellery piece directly from your store:\n`;
    msg += `? *Product:* ${product.name}${sampleTag}\n`;
    msg += `? *Finish/Variant:* ${chosenVariant}\n`;
    msg += `? *Deal Price:* ?${product.price} (M.R.P. ?${product.originalPrice} - ${product.discountPercent}% OFF)\n`;
    msg += `? *Sold By:* ${window.STORE_CONFIG.sellerName}\n\n`;
    msg += `Please confirm if this is available for fast delivery to my pincode!`;

    return this.generateWhatsAppUrl(msg);
  }

  sendOrderEnquiry(customerDetails, cartItems, cartSummary) {
    const { msg, orderId } = this.formatAmazonOrderMessage(customerDetails, cartItems, cartSummary);
    const url = this.generateWhatsAppUrl(msg);

    // Record order in Seller Central
    if (window.adminService && typeof window.adminService.recordOrderInquiry === "function") {
      window.adminService.recordOrderInquiry({ ...customerDetails, orderId }, cartItems, cartSummary);
    }

    window.open(url, "_blank");
    return orderId;
  }
}

window.whatsappService = new WhatsAppService();
