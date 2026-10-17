/**
 * Aurelia Amazon Store - Seller Central (Sole-Merchant Dashboard)
 * 100% PRIVATE: Wholesale costs, supplier details, and profit margins
 * are never exposed on customer-facing storefront pages.
 */

class AdminService {
  constructor() {
    this.ordersKey = "aurelia_amazon_orders_v2";
    this.authKey = "aurelia_seller_session_v2";
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.ordersKey)) {
      // Seed initial sample enquiry demonstration for the seller
      const sampleOrders = [
        {
          id: "AMZ-IN-849201",
          date: new Date().toISOString(),
          customerName: "Pooja Hegde (Sample Customer)",
          customerPhone: "+91 98201 54321",
          address: "Flat 502, Orchid Towers, JVPD Scheme, Juhu, Mumbai, Maharashtra - 400049",
          landmark: "Near Juhu Circle",
          items: [
            {
              name: "Classic French Chunky Croissant Hoop Earrings",
              variant: "18K Yellow Gold",
              quantity: 1,
              sellingPrice: 250,
              originalPrice: 499,
              supplierCost: 95,
              shippingCost: 45
            }
          ],
          sellingTotal: 250,
          totalSupplierCost: 95,
          totalShippingCost: 45,
          estimatedProfit: 110, // 250 - (95 + 45) = 110
          paymentMethod: "UPI Enquiry (GPay)",
          status: "Enquiry Received",
          trackingNumber: "AMZ-SHIP-992104"
        }
      ];
      localStorage.setItem(this.ordersKey, JSON.stringify(sampleOrders));
    }
  }

  isAuthenticated() {
    return sessionStorage.getItem(this.authKey) === "seller_authenticated";
  }

  login(pin) {
    const validPin = (window.STORE_CONFIG && window.STORE_CONFIG.sellerPin) || "1234";
    if (pin === validPin) {
      sessionStorage.setItem(this.authKey, "seller_authenticated");
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem(this.authKey);
  }

  getOrders() {
    try {
      const data = localStorage.getItem(this.ordersKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveOrders(orders) {
    localStorage.setItem(this.ordersKey, JSON.stringify(orders));
  }

  recordOrderInquiry(customerDetails, cartItems, cartSummary) {
    const orders = this.getOrders();
    const rawProducts = window.productRepo.getAllRaw();

    let totalSupplierCost = 0;
    const enrichedItems = cartItems.map(item => {
      const raw = rawProducts.find(p => p.id === item.productId);
      const supplierCost = (raw && raw.privateDropshipping && raw.privateDropshipping.supplierCost) || 0;
      const shippingCost = (raw && raw.privateDropshipping && raw.privateDropshipping.shippingCost) || 0;
      totalSupplierCost += (supplierCost * item.quantity);

      return {
        name: item.name,
        variant: item.variant,
        quantity: item.quantity,
        sellingPrice: item.price,
        originalPrice: item.originalPrice,
        supplierCost,
        shippingCost
      };
    });

    const totalShippingCost = cartSummary.shippingFee > 0 ? 45 : 0;
    const estimatedProfit = cartSummary.finalTotal - (totalSupplierCost + totalShippingCost);

    const newOrder = {
      id: customerDetails.orderId || ("AMZ-IN-" + Date.now().toString().slice(-6)),
      date: new Date().toISOString(),
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      address: `${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state} - ${customerDetails.pincode}`,
      landmark: customerDetails.landmark || "",
      items: enrichedItems,
      sellingTotal: cartSummary.finalTotal,
      totalSupplierCost,
      totalShippingCost,
      estimatedProfit,
      paymentMethod: customerDetails.paymentMethod,
      status: "Enquiry Received",
      trackingNumber: "Pending Dispatch"
    };

    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  updateOrderStatus(orderId, status, tracking = null) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      if (tracking) order.trackingNumber = tracking;
      this.saveOrders(orders);
      return true;
    }
    return false;
  }

  deleteOrder(orderId) {
    const orders = this.getOrders().filter(o => o.id !== orderId);
    this.saveOrders(orders);
    return true;
  }

  getFinancialMetrics() {
    const orders = this.getOrders();
    const validOrders = orders.filter(o => o.status !== "Cancelled");
    const grossRevenue = validOrders.reduce((sum, o) => sum + o.sellingTotal, 0);
    const totalCosts = validOrders.reduce((sum, o) => sum + (o.totalSupplierCost + o.totalShippingCost), 0);
    const netProfit = grossRevenue - totalCosts;
    const totalUnits = validOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

    return {
      totalOrders: orders.length,
      activeOrders: orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length,
      grossRevenue,
      totalCosts,
      netProfit,
      totalUnits
    };
  }

  exportCatalogue() {
    const data = window.productRepo.getAllRaw();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aurelia_seller_inventory_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  importCatalogue(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localStorage.setItem(window.productRepo.storageKey, JSON.stringify(parsed));
        return { success: true, count: parsed.length };
      }
      return { success: false, message: "Invalid JSON format: expected an array of products." };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
}

window.adminService = new AdminService();
