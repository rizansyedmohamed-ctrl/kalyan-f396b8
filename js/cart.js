/**
 * Aurelia Amazon Store - Amazon-Style Shopping Cart
 * Handles item selection, quantities (1-10), saved-for-later, and discount calculations.
 */

class CartManager {
  constructor() {
    this.storageKey = "aurelia_amazon_cart_v2";
    this.savedKey = "aurelia_amazon_saved_v2";
    this.couponKey = "aurelia_amazon_coupon_v2";
    this.items = [];
    this.savedItems = [];
    this.appliedCoupon = null;
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      this.items = saved ? JSON.parse(saved) : [];
      const savedLater = localStorage.getItem(this.savedKey);
      this.savedItems = savedLater ? JSON.parse(savedLater) : [];
      const savedCoupon = localStorage.getItem(this.couponKey);
      this.appliedCoupon = savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch (e) {
      console.error("Cart load error", e);
      this.items = [];
      this.savedItems = [];
      this.appliedCoupon = null;
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      localStorage.setItem(this.savedKey, JSON.stringify(this.savedItems));
      if (this.appliedCoupon) {
        localStorage.setItem(this.couponKey, JSON.stringify(this.appliedCoupon));
      } else {
        localStorage.removeItem(this.couponKey);
      }
      this.dispatchUpdate();
    } catch (e) {
      console.error("Cart save error", e);
    }
  }

  dispatchUpdate() {
    const event = new CustomEvent("aurelia:cart-updated", {
      detail: {
        summary: this.getSummary(),
        items: this.items,
        savedItems: this.savedItems
      }
    });
    window.dispatchEvent(event);
  }

  addItem(productId, variantName = null, quantity = 1) {
    const product = window.productRepo.getById(productId);
    if (!product) return false;

    const chosenVariant = variantName || (product.variants && product.variants[0] ? product.variants[0].name : "Standard");
    const cartItemId = `${productId}__${chosenVariant.replace(/\s+/g, "_")}`;

    const existingIndex = this.items.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex >= 0) {
      this.items[existingIndex].quantity = Math.min(10, this.items[existingIndex].quantity + quantity);
      this.items[existingIndex].selected = true;
    } else {
      this.items.push({
        cartItemId,
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.images[0] || "",
        variant: chosenVariant,
        quantity: Math.min(10, Math.max(1, quantity)),
        selected: true,
        isSample: product.isSample || false,
        metalType: product.metalType || "18K Gold Plated"
      });
    }

    this.save();
    return true;
  }

  // Quick bundle add (e.g. Frequently Bought Together)
  addBundle(productId1, productId2) {
    this.addItem(productId1, null, 1);
    this.addItem(productId2, null, 1);
    return true;
  }

  updateQuantity(cartItemId, newQuantity) {
    const index = this.items.findIndex(item => item.cartItemId === cartItemId);
    if (index >= 0) {
      if (newQuantity <= 0) {
        this.items.splice(index, 1);
      } else {
        this.items[index].quantity = Math.min(10, newQuantity);
      }
      this.save();
    }
  }

  toggleItemSelection(cartItemId) {
    const item = this.items.find(i => i.cartItemId === cartItemId);
    if (item) {
      item.selected = !item.selected;
      this.save();
    }
  }

  selectAll(select = true) {
    this.items.forEach(i => i.selected = select);
    this.save();
  }

  removeItem(cartItemId) {
    this.items = this.items.filter(item => item.cartItemId !== cartItemId);
    this.save();
  }

  saveForLater(cartItemId) {
    const index = this.items.findIndex(item => item.cartItemId === cartItemId);
    if (index >= 0) {
      const [item] = this.items.splice(index, 1);
      this.savedItems.push(item);
      this.save();
    }
  }

  moveToCart(cartItemId) {
    const index = this.savedItems.findIndex(item => item.cartItemId === cartItemId);
    if (index >= 0) {
      const [item] = this.savedItems.splice(index, 1);
      item.selected = true;
      this.items.push(item);
      this.save();
    }
  }

  removeSavedItem(cartItemId) {
    this.savedItems = this.savedItems.filter(item => item.cartItemId !== cartItemId);
    this.save();
  }

  clear() {
    this.items = [];
    this.appliedCoupon = null;
    this.save();
  }

  applyCoupon(code) {
    const trimmed = (code || "").trim().toUpperCase();
    if (trimmed === window.STORE_CONFIG.promoDiscountCode) {
      this.appliedCoupon = {
        code: trimmed,
        discountPercent: window.STORE_CONFIG.promoDiscountPercent
      };
      this.save();
      return { success: true, message: `Promo code ${trimmed} applied: 10% OFF your jewellery order!` };
    }
    return { success: false, message: "Invalid code. Use 'LUXE10' for 10% off!" };
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.save();
  }

  getSummary() {
    const activeItems = this.items.filter(item => item.selected);
    const selectedCount = activeItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalCartCount = this.items.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = activeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalMrp = activeItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const mrpSavings = Math.max(0, totalMrp - subtotal);

    let promoDiscount = 0;
    if (this.appliedCoupon && subtotal > 0) {
      promoDiscount = Math.round((subtotal * this.appliedCoupon.discountPercent) / 100);
    }

    const discountedSubtotal = Math.max(0, subtotal - promoDiscount);

    const freeShippingThreshold = window.STORE_CONFIG.freeShippingThreshold || 499;
    const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
    const shippingFee = (subtotal === 0 || isFreeShipping) ? 0 : (window.STORE_CONFIG.standardShippingFee || 49);
    const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const finalTotal = discountedSubtotal + shippingFee;

    return {
      selectedCount,
      totalCartCount,
      subtotal,
      totalMrp,
      mrpSavings,
      promoDiscount,
      discountedSubtotal,
      shippingFee,
      isFreeShipping,
      amountToFreeShipping,
      freeShippingThreshold,
      finalTotal,
      appliedCoupon: this.appliedCoupon
    };
  }
}

window.cartManager = new CartManager();
