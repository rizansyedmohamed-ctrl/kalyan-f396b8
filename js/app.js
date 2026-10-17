/** Aurelia Amazon Store - Core App Orchestrator **/

class AureliaAmazonApp {
  constructor() {
    this.currentCategory = "All Categories";
    this.searchQuery = "";
    this.sortBy = "featured";
    this.filters = {
      expressOnly: false,
      minRating: 0,
      priceMin: 0,
      priceMax: 999999,
      metals: [],
      minDiscount: 0
    };
    this.activeProduct = null;
    this.selectedVariant = null;
    this.pincode = localStorage.getItem("aurelia_pincode") || window.STORE_CONFIG.defaultPincode;
    this.city = localStorage.getItem("aurelia_city") || window.STORE_CONFIG.defaultCity;
    this.currentSlide = 0;
    this.slideInterval = null;
  }

  init() {
    this.renderHeaderInfo();
    this.renderHeroCarousel();
    this.renderSidebarFilters();
    this.renderProductGrid();
    this.renderCartUI();
    this.bindEvents();
    this.startDealTimer();

    if (window.location.hash === "#seller" || window.location.hash === "#admin") {
      this.openSellerCentral();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderHeaderInfo() {
    const config = window.STORE_CONFIG;
    document.querySelectorAll(".brand-name-text").forEach(el => el.textContent = config.brandName);
    document.querySelectorAll(".current-city-pincode").forEach(el => el.textContent = `${this.city} ${this.pincode}`);
  }

  renderHeroCarousel() {
    const slides = document.querySelectorAll(".carousel-slide");
    if (!slides.length) return;

    const showSlide = (idx) => {
      slides.forEach((s, i) => {
        if (i === idx) {
          s.classList.remove("opacity-0", "pointer-events-none");
          s.classList.add("opacity-100");
        } else {
          s.classList.add("opacity-0", "pointer-events-none");
          s.classList.remove("opacity-100");
        }
      });
      this.currentSlide = idx;
    };

    const nextSlide = () => {
      let next = (this.currentSlide + 1) % slides.length;
      showSlide(next);
    };

    const prevSlide = () => {
      let prev = (this.currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
    };

    const nextBtn = document.getElementById("carousel-next-btn");
    const prevBtn = document.getElementById("carousel-prev-btn");
    if (nextBtn) nextBtn.onclick = nextSlide;
    if (prevBtn) prevBtn.onclick = prevSlide;

    if (this.slideInterval) clearInterval(this.slideInterval);
    this.slideInterval = setInterval(nextSlide, 5000);
  }

  startDealTimer() {
    const timerEl = document.getElementById("deal-timer");
    if (!timerEl) return;

    let totalSeconds = 5 * 3600 + 42 * 60 + 18;
    setInterval(() => {
      if (totalSeconds > 0) totalSeconds--;
      const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
      const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
      const s = (totalSeconds % 60).toString().padStart(2, "0");
      timerEl.textContent = `${h}h ${m}m ${s}s`;
    }, 1000);
  }

  renderSidebarFilters() {
    const container = document.getElementById("filter-category-list");
    if (!container) return;

    const allProducts = window.productRepo.getAllPublic();

    container.innerHTML = window.DEFAULT_CATEGORIES.map(cat => {
      const isSelected = cat.toLowerCase() === this.currentCategory.toLowerCase();
      const count = cat === "All Categories" 
        ? allProducts.length 
        : allProducts.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;

      return `
        <button 
          type="button" 
          class="sidebar-cat-btn w-full text-left flex items-center justify-between py-1 transition ${isSelected ? 'font-bold text-amzOrange' : 'text-stone-700 hover:text-amzOrange'}" 
          data-category="${cat}">
          <span>${cat}</span>
          <span class="text-[10px] text-stone-400">(${count})</span>
        </button>
      `;
    }).join("");

    container.querySelectorAll(".sidebar-cat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.currentCategory = btn.getAttribute("data-category");
        const select = document.getElementById("search-category-select");
        if (select) select.value = this.currentCategory;
        this.renderSidebarFilters();
        this.renderProductGrid();
      });
    });
  }

  getFilteredProducts() {
    let list = window.productRepo.getAllPublic();

    // Category
    if (this.currentCategory && this.currentCategory !== "All Categories") {
      list = list.filter(p => p.category.toLowerCase() === this.currentCategory.toLowerCase());
    }

    // Search query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.metalType && p.metalType.toLowerCase().includes(q))
      );
    }

    // Express delivery
    if (this.filters.expressOnly) {
      list = list.filter(p => p.isBestseller || p.isAmazonChoice);
    }

    // Minimum rating
    if (this.filters.minRating > 0) {
      list = list.filter(p => p.rating >= this.filters.minRating);
    }

    // Price range
    list = list.filter(p => p.price >= this.filters.priceMin && p.price <= this.filters.priceMax);

    // Metals
    if (this.filters.metals.length > 0) {
      list = list.filter(p => this.filters.metals.some(m => p.metalType && p.metalType.includes(m)));
    }

    // Discount
    if (this.filters.minDiscount > 0) {
      list = list.filter(p => p.discountPercent >= this.filters.minDiscount);
    }

    // Sorting
    if (this.sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === "newest") {
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    } else {
      list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return list;
  }

  renderProductGrid() {
    const grid = document.getElementById("amz-product-grid");
    const countText = document.getElementById("results-count-text");
    if (!grid) return;

    const products = this.getFilteredProducts();
    if (countText) {
      countText.textContent = `Showing 1-${products.length} of ${products.length} results for "${this.currentCategory}"`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center bg-stone-50 rounded border border-dashed border-stone-300">
          <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 text-stone-400"></i>
          <h4 class="font-bold text-base text-stone-800">No matching jewellery items found</h4>
          <p class="text-xs text-stone-500 mt-1">Try resetting your filters or search keywords.</p>
          <button id="reset-filters-btn" class="btn-amz-cart mt-4 px-4 py-2 rounded text-xs font-bold shadow-sm">
            Reset Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById("reset-filters-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          this.currentCategory = "All Categories";
          this.searchQuery = "";
          this.filters = { expressOnly: false, minRating: 0, priceMin: 0, priceMax: 999999, metals: [], minDiscount: 0 };
          const searchInput = document.getElementById("amz-search-input");
          if (searchInput) searchInput.value = "";
          this.renderSidebarFilters();
          this.renderProductGrid();
        });
      }
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    grid.innerHTML = products.map(product => this.renderAmazonCardHtml(product)).join("");
    this.bindProductCardActions(grid);
    if (window.lucide) window.lucide.createIcons();
  }

  renderAmazonCardHtml(product) {
    const savings = product.originalPrice ? (product.originalPrice - product.price) : 0;

    return `
      <div class="amz-product-card bg-white rounded border border-stone-200 hover:shadow-lg transition p-3 flex flex-col justify-between" data-product-id="${product.id}">
        <div>
          <!-- Badges & Image -->
          <div class="relative aspect-square overflow-hidden rounded bg-stone-50 mb-2 cursor-pointer card-pdp-trigger">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
            
            <!-- Badges -->
            <div class="absolute top-2 left-2 flex flex-col gap-1 items-start">
              ${product.isBestseller ? `
                <span class="badge-bestseller text-[10px] font-bold uppercase tracking-wide">
                  #1 Best Seller
                </span>
              ` : ""}
              ${product.isDealOfDay ? `
                <span class="badge-limited-deal text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded">
                  Limited time deal
                </span>
              ` : ""}
              ${product.isSample ? `
                <span class="bg-amber-400 text-stone-950 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow">
                  SAMPLE ITEM
                </span>
              ` : ""}
            </div>
          </div>

          <!-- Product Title -->
          <h3 class="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 hover:text-amzOrange transition cursor-pointer card-pdp-trigger mb-1">
            ${product.name}
          </h3>

          <!-- Star Rating & Review Count -->
          <div class="flex items-center gap-1.5 text-xs text-stone-600 mb-2">
            <div class="flex items-center text-amzOrange text-[11px]">
              <i data-lucide="star" class="w-3 h-3 fill-amzOrange text-amzOrange"></i>
              <span class="font-bold ml-1 text-stone-800">${product.rating}</span>
            </div>
            <span class="text-[11px] text-stone-400">(${product.reviewsCount})</span>
            <span class="text-[10px] text-stone-400">| 100+ bought in past month</span>
          </div>

          <!-- Price & Discount -->
          <div class="space-y-0.5 mb-2">
            <div class="flex items-baseline gap-1.5">
              <span class="text-xs font-bold text-amzRed">-${product.discountPercent}%</span>
              <span class="text-base sm:text-lg font-bold text-[#0F1111]">?${product.price}</span>
            </div>
            ${product.originalPrice ? `
              <div class="text-[11px] text-stone-500">
                M.R.P.: <span class="line-through">?${product.originalPrice}</span>
              </div>
            ` : ""}
          </div>

          <!-- Delivery Line -->
          <div class="text-[11px] text-stone-600 space-y-0.5 mb-3">
            <div class="font-bold text-stone-900 flex items-center gap-1">
              <span class="text-amzBlue font-bold">Luxe Express</span>
              <span>FREE Delivery</span>
            </div>
            <div class="text-stone-500">Get it by <strong class="text-stone-900 font-bold">Tomorrow</strong></div>
            <div class="text-[10px] text-emerald-800 font-semibold">18K PVD Anti-Tarnish Assured</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-1.5 pt-2 border-t border-stone-100">
          <button 
            type="button" 
            class="add-to-cart-quick-btn btn-amz-cart w-full py-1.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            data-product-id="${product.id}">
            <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i> Add to Cart
          </button>
          
          <button 
            type="button" 
            class="buy-now-quick-btn btn-amz-buy w-full py-1.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            data-product-id="${product.id}">
            <i data-lucide="zap" class="w-3.5 h-3.5"></i> Buy Now
          </button>
        </div>
      </div>
    `;
  }

  bindProductCardActions(parentEl) {
    parentEl.querySelectorAll(".card-pdp-trigger").forEach(el => {
      el.addEventListener("click", () => {
        const card = el.closest(".amz-product-card");
        const id = card.getAttribute("data-product-id");
        this.openPDP(id);
      });
    });

    parentEl.querySelectorAll(".add-to-cart-quick-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-product-id");
        const prod = window.productRepo.getById(id);
        const defaultVar = (prod && prod.variants && prod.variants[0]) ? prod.variants[0].name : "Standard";
        window.cartManager.addItem(id, defaultVar, 1);
        this.showToast(`Added "${prod.name}" to your Amazon Cart`);
        this.openCart();
      });
    });

    parentEl.querySelectorAll(".buy-now-quick-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-product-id");
        const prod = window.productRepo.getById(id);
        if (prod) {
          const defaultVar = (prod && prod.variants && prod.variants[0]) ? prod.variants[0].name : "Standard";
          const waUrl = window.whatsappService.generateSingleBuyUrl(prod, defaultVar);
          window.open(waUrl, "_blank");
        }
      });
    });
  }

  openPDP(productId) {
    const product = window.productRepo.getById(productId);
    if (!product) return;

    this.activeProduct = product;
    this.selectedVariant = (product.variants && product.variants[0]) ? product.variants[0].name : "Standard";

    const modal = document.getElementById("pdp-modal");
    if (!modal) return;

    // Title & Brand
    document.getElementById("pdp-title").textContent = product.name;
    document.getElementById("pdp-main-image").src = product.images[0];
    document.getElementById("pdp-price").textContent = `?${product.price}`;
    document.getElementById("buybox-price").textContent = `?${product.price}`;
    document.getElementById("pdp-mrp").textContent = product.originalPrice ? `M.R.P.: ?${product.originalPrice}` : "";
    document.getElementById("pdp-savings").textContent = `(${product.discountPercent}% Off)`;
    document.getElementById("pdp-rating-num").textContent = `${product.rating} out of 5`;
    document.getElementById("pdp-reviews-count-link").textContent = `${product.reviewsCount} ratings`;
    document.getElementById("pdp-review-score").textContent = product.rating;

    // Stars
    const starsEl = document.getElementById("pdp-stars");
    if (starsEl) {
      starsEl.innerHTML = Array(5).fill(0).map((_, i) => 
        `<i data-lucide="star" class="w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amzOrange text-amzOrange' : 'text-stone-300'}"></i>`
      ).join("");
    }

    // Thumbnails
    const thumbsContainer = document.getElementById("pdp-thumbnails");
    if (thumbsContainer) {
      thumbsContainer.innerHTML = product.images.map((img, idx) => `
        <button type="button" class="pdp-thumb-btn w-12 h-12 rounded border-2 transition overflow-hidden ${idx === 0 ? 'border-amzOrange' : 'border-stone-200'}" data-img="${img}">
          <img src="${img}" class="w-full h-full object-cover" />
        </button>
      `).join("");

      thumbsContainer.querySelectorAll(".pdp-thumb-btn").forEach(t => {
        t.addEventListener("click", () => {
          thumbsContainer.querySelectorAll(".pdp-thumb-btn").forEach(tb => tb.className = "pdp-thumb-btn w-12 h-12 rounded border-2 transition overflow-hidden border-stone-200");
          t.className = "pdp-thumb-btn w-12 h-12 rounded border-2 transition overflow-hidden border-amzOrange";
          document.getElementById("pdp-main-image").src = t.getAttribute("data-img");
        });
      });
    }

    // Variants
    const variantsContainer = document.getElementById("pdp-variant-selector");
    if (variantsContainer) {
      if (product.variants && product.variants.length > 0) {
        variantsContainer.innerHTML = `
          <span class="block text-xs font-bold text-stone-800 mb-1.5">Color / Finish: <strong class="text-amzBlue" id="selected-variant-label">${this.selectedVariant}</strong></span>
          <div class="flex flex-wrap gap-2">
            ${product.variants.map((v, i) => `
              <button 
                type="button" 
                class="variant-choice-btn px-3 py-1.5 rounded text-xs font-semibold border transition ${i === 0 ? 'border-amzOrange bg-amber-50 text-stone-900 shadow-sm' : 'border-stone-300 bg-white text-stone-700'}" 
                data-name="${v.name}">
                ${v.name}
              </button>
            `).join("")}
          </div>
        `;

        variantsContainer.querySelectorAll(".variant-choice-btn").forEach(b => {
          b.addEventListener("click", () => {
            variantsContainer.querySelectorAll(".variant-choice-btn").forEach(btn => btn.className = "variant-choice-btn px-3 py-1.5 rounded text-xs font-semibold border transition border-stone-300 bg-white text-stone-700");
            b.className = "variant-choice-btn px-3 py-1.5 rounded text-xs font-semibold border transition border-amzOrange bg-amber-50 text-stone-900 shadow-sm";
            this.selectedVariant = b.getAttribute("data-name");
            document.getElementById("selected-variant-label").textContent = this.selectedVariant;
          });
        });
      } else {
        variantsContainer.innerHTML = "";
      }
    }

    // "About this item"
    const bulletsEl = document.getElementById("pdp-about-bullets");
    if (bulletsEl) {
      bulletsEl.innerHTML = product.aboutBullets.map(b => `<li>${b}</li>`).join("");
    }

    // Frequently Bought Together Bundle
    this.renderFrequentlyBoughtTogether(product);

    // Technical Details
    const specsTable = document.getElementById("pdp-specs-table-body");
    if (specsTable && product.specs) {
      specsTable.innerHTML = Object.entries(product.specs).map(([key, val]) => `
        <tr class="border-b border-stone-200">
          <td class="p-2 font-bold bg-stone-50 w-1/3 text-stone-600">${key}</td>
          <td class="p-2 text-stone-900">${val}</td>
        </tr>
      `).join("");
    }

    // Review Distribution Bars
    const reviewBarsEl = document.getElementById("pdp-review-bars");
    if (reviewBarsEl && product.ratingBreakdown) {
      reviewBarsEl.innerHTML = [5, 4, 3, 2, 1].map(stars => {
        const pct = product.ratingBreakdown[stars] || 0;
        return `
          <div class="flex items-center gap-2 text-xs">
            <span class="w-12 text-amzBlue font-medium">${stars} star</span>
            <div class="flex-grow bg-stone-200 h-4 rounded-sm overflow-hidden">
              <div class="review-bar-fill h-full" style="width: ${pct}%"></div>
            </div>
            <span class="w-8 text-right text-stone-500 font-semibold">${pct}%</span>
          </div>
        `;
      }).join("");
    }

    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    if (window.lucide) window.lucide.createIcons();
  }

  renderFrequentlyBoughtTogether(product) {
    const companionId = product.frequentlyBoughtWith || (product.id === "prod_hoop_01" ? "prod_neck_01" : "prod_hoop_01");
    const companion = window.productRepo.getById(companionId);

    const img1 = document.getElementById("fbt-img-1");
    const img2 = document.getElementById("fbt-img-2");
    const namesEl = document.getElementById("fbt-bundle-names");
    const priceEl = document.getElementById("fbt-bundle-price");
    const addBothBtn = document.getElementById("fbt-add-both-btn");

    if (!companion) return;

    if (img1) img1.src = product.images[0];
    if (img2) img2.src = companion.images[0];
    if (namesEl) namesEl.innerHTML = `This item: <strong>${product.name}</strong> + <strong>${companion.name}</strong>`;
    
    const bundlePrice = product.price + companion.price;
    const bundleMrp = (product.originalPrice || product.price) + (companion.originalPrice || companion.price);
    if (priceEl) priceEl.innerHTML = `?${bundlePrice} <span class="text-xs text-stone-500 line-through">?${bundleMrp}</span>`;

    if (addBothBtn) {
      addBothBtn.onclick = () => {
        window.cartManager.addBundle(product.id, companion.id);
        this.closePDP();
        this.showToast(`Added bundle: "${product.name}" + "${companion.name}" to cart!`);
        this.openCart();
      };
    }
  }

  closePDP() {
    const modal = document.getElementById("pdp-modal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }
  }

  openCart() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-backdrop");
    if (drawer) {
      drawer.classList.remove("translate-x-full");
      if (backdrop) backdrop.classList.remove("opacity-0", "pointer-events-none");
      document.body.classList.add("overflow-hidden");
    }
  }

  closeCart() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-backdrop");
    if (drawer) {
      drawer.classList.add("translate-x-full");
      if (backdrop) backdrop.classList.add("opacity-0", "pointer-events-none");
      document.body.classList.remove("overflow-hidden");
    }
  }

  renderCartUI() {
    const summary = window.cartManager.getSummary();
    const items = window.cartManager.items;
    const saved = window.cartManager.savedItems;

    // Header badge
    document.querySelectorAll(".cart-count-badge").forEach(b => {
      b.textContent = summary.totalCartCount;
    });

    const itemsContainer = document.getElementById("cart-items-container");
    const emptyState = document.getElementById("cart-empty-state");
    const footerSummary = document.getElementById("cart-footer-summary");
    const freeShipBar = document.getElementById("cart-free-shipping-bar");
    const freeShipText = document.getElementById("cart-free-shipping-text");

    if (!itemsContainer) return;

    if (items.length === 0) {
      itemsContainer.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      if (footerSummary) footerSummary.classList.add("hidden");
    } else {
      if (emptyState) emptyState.classList.add("hidden");
      if (footerSummary) footerSummary.classList.remove("hidden");

      // Free delivery progress
      if (freeShipBar && freeShipText) {
        if (summary.isFreeShipping) {
          freeShipBar.style.width = "100%";
          freeShipBar.className = "w-full h-2 bg-amzGreen transition-all duration-300";
          freeShipText.innerHTML = `? <span class="text-emerald-800">Your order qualifies for <strong>FREE Luxe Express Delivery</strong>!</span>`;
        } else {
          const pct = Math.min(100, Math.round((summary.subtotal / summary.freeShippingThreshold) * 100));
          freeShipBar.style.width = `${pct}%`;
          freeShipBar.className = "h-2 bg-amzOrange transition-all duration-300";
          freeShipText.innerHTML = `Add <strong>?${summary.amountToFreeShipping}</strong> of eligible items to get <strong>FREE Delivery</strong> across India.`;
        }
      }

      // Render Active Items
      itemsContainer.innerHTML = items.map(item => `
        <div class="cart-item-card p-3 bg-stone-50 rounded border border-stone-200 flex gap-3 text-xs" data-cart-id="${item.cartItemId}">
          <input type="checkbox" class="cart-item-select-chk mt-1 text-amzOrange rounded w-4 h-4 cursor-pointer" ${item.selected ? "checked" : ""} data-cart-id="${item.cartItemId}" />
          
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded bg-white border border-stone-200 flex-shrink-0" />

          <div class="flex-grow space-y-1">
            <h5 class="font-bold text-stone-900 line-clamp-1">${item.name}</h5>
            <div class="text-[11px] text-stone-600">Finish: <strong class="text-stone-900">${item.variant}</strong></div>
            <div class="text-[11px] text-amzGreen font-bold">In Stock ? Eligible for FREE Shipping</div>

            <div class="flex items-center justify-between pt-1">
              <div class="flex items-center gap-2">
                <select class="cart-qty-select bg-white border border-stone-300 rounded px-1.5 py-0.5 font-bold shadow-inner" data-cart-id="${item.cartItemId}">
                  ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${item.quantity === n ? "selected" : ""}>Qty: ${n}</option>`).join("")}
                </select>

                <button type="button" class="cart-delete-btn amz-link text-[11px]" data-cart-id="${item.cartItemId}">Delete</button>
                <span class="text-stone-300">|</span>
                <button type="button" class="cart-save-later-btn amz-link text-[11px]" data-cart-id="${item.cartItemId}">Save for later</button>
              </div>

              <div class="text-right">
                <span class="font-bold text-stone-900 text-sm">?${item.price * item.quantity}</span>
                ${item.originalPrice ? `<span class="block text-[10px] text-stone-400 line-through">?${item.originalPrice * item.quantity}</span>` : ""}
              </div>
            </div>
          </div>
        </div>
      `).join("");

      // Bind Active Item Events
      itemsContainer.querySelectorAll(".cart-item-select-chk").forEach(chk => {
        chk.addEventListener("change", () => {
          const id = chk.getAttribute("data-cart-id");
          window.cartManager.toggleItemSelection(id);
        });
      });

      itemsContainer.querySelectorAll(".cart-qty-select").forEach(sel => {
        sel.addEventListener("change", (e) => {
          const id = sel.getAttribute("data-cart-id");
          window.cartManager.updateQuantity(id, parseInt(e.target.value));
        });
      });

      itemsContainer.querySelectorAll(".cart-delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-cart-id");
          window.cartManager.removeItem(id);
        });
      });

      itemsContainer.querySelectorAll(".cart-save-later-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-cart-id");
          window.cartManager.saveForLater(id);
        });
      });
    }

    // Render Saved for Later
    const savedContainer = document.getElementById("cart-saved-container");
    const savedItemsList = document.getElementById("cart-saved-items");
    if (savedContainer && savedItemsList) {
      if (saved.length > 0) {
        savedContainer.classList.remove("hidden");
        savedItemsList.innerHTML = saved.map(item => `
          <div class="p-2.5 bg-white rounded border border-stone-200 flex items-center justify-between gap-3 text-xs">
            <img src="${item.image}" class="w-12 h-12 object-cover rounded" />
            <div class="flex-grow">
              <span class="font-bold block truncate max-w-[180px]">${item.name}</span>
              <span class="text-stone-500 font-bold">?${item.price}</span>
            </div>
            <div class="flex flex-col gap-1">
              <button type="button" class="saved-move-cart-btn btn-amz-cart px-2 py-1 rounded text-[10px] font-bold" data-cart-id="${item.cartItemId}">
                Move to Cart
              </button>
              <button type="button" class="saved-remove-btn amz-link text-[10px] text-center" data-cart-id="${item.cartItemId}">
                Delete
              </button>
            </div>
          </div>
        `).join("");

        savedItemsList.querySelectorAll(".saved-move-cart-btn").forEach(btn => {
          btn.onclick = () => window.cartManager.moveToCart(btn.getAttribute("data-cart-id"));
        });
        savedItemsList.querySelectorAll(".saved-remove-btn").forEach(btn => {
          btn.onclick = () => window.cartManager.removeSavedItem(btn.getAttribute("data-cart-id"));
        });
      } else {
        savedContainer.classList.add("hidden");
      }
    }

    // Update Summary Values
    const subtotalEl = document.getElementById("cart-summary-subtotal");
    const mrpRow = document.getElementById("cart-summary-mrp-savings-row");
    const mrpSavingsEl = document.getElementById("cart-summary-mrp-savings");
    const promoRow = document.getElementById("cart-summary-promo-row");
    const promoDiscountEl = document.getElementById("cart-summary-promo");
    const shippingEl = document.getElementById("cart-summary-shipping");
    const finalTotalEl = document.getElementById("cart-summary-final-total");

    if (subtotalEl) subtotalEl.textContent = `?${summary.subtotal}`;
    if (mrpSavingsEl && mrpRow) {
      if (summary.mrpSavings > 0) {
        mrpRow.classList.remove("hidden");
        mrpSavingsEl.textContent = `-?${summary.mrpSavings}`;
      } else {
        mrpRow.classList.add("hidden");
      }
    }
    if (promoDiscountEl && promoRow) {
      if (summary.promoDiscount > 0) {
        promoRow.classList.remove("hidden");
        promoDiscountEl.textContent = `-?${summary.promoDiscount}`;
      } else {
        promoRow.classList.add("hidden");
      }
    }
    if (shippingEl) shippingEl.textContent = summary.shippingFee === 0 ? "FREE" : `?${summary.shippingFee}`;
    if (finalTotalEl) finalTotalEl.textContent = `?${summary.finalTotal}`;

    if (window.lucide) window.lucide.createIcons();
  }

  openCheckout() {
    const summary = window.cartManager.getSummary();
    if (summary.selectedCount === 0) {
      this.showToast("Select at least 1 item in your cart to proceed.");
      return;
    }

    this.closeCart();
    const modal = document.getElementById("checkout-modal");
    if (!modal) return;

    document.getElementById("checkout-total-banner").textContent = `?${summary.finalTotal}`;
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  closeCheckout() {
    const modal = document.getElementById("checkout-modal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }
  }

  handleCheckoutSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.elements["customerName"].value.trim();
    const phone = form.elements["customerPhone"].value.trim();
    const address = form.elements["customerAddress"].value.trim();
    const area = form.elements["customerArea"].value.trim();
    const pincode = form.elements["customerPincode"].value.trim();
    const city = form.elements["customerCity"].value.trim();
    const state = form.elements["customerState"].value;
    const landmark = form.elements["customerLandmark"] ? form.elements["customerLandmark"].value.trim() : "";
    const paymentMethod = form.elements["paymentMethod"].value;

    if (!name || !phone || !address || !pincode || !city) {
      alert("Please fill in all mandatory delivery fields.");
      return;
    }

    const fullAddress = `${address}, ${area}`;
    const customerDetails = { name, phone, address: fullAddress, pincode, city, state, landmark, paymentMethod };
    const activeItems = window.cartManager.items.filter(i => i.selected);
    const summary = window.cartManager.getSummary();

    // Trigger WhatsApp Service
    const orderId = window.whatsappService.sendOrderEnquiry(customerDetails, activeItems, summary);

    // Clear checked items from cart
    window.cartManager.items = window.cartManager.items.filter(i => !i.selected);
    window.cartManager.save();

    this.closeCheckout();
    this.showToast(`Order #${orderId} opened in WhatsApp! Our store team will verify stock & dispatch.`);
  }

  openPincodeModal() {
    const modal = document.getElementById("pincode-modal");
    if (modal) {
      const input = document.getElementById("pincode-input");
      if (input) input.value = this.pincode;
      modal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    }
  }

  closePincodeModal() {
    const modal = document.getElementById("pincode-modal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }
  }

  handlePincodeSubmit(e) {
    e.preventDefault();
    const pin = document.getElementById("pincode-input").value.trim();
    if (pin.length === 6) {
      this.pincode = pin;
      // City inference
      if (pin.startsWith("40")) this.city = "Mumbai";
      else if (pin.startsWith("11")) this.city = "Delhi";
      else if (pin.startsWith("56")) this.city = "Bengaluru";
      else if (pin.startsWith("60")) this.city = "Chennai";
      else if (pin.startsWith("70")) this.city = "Kolkata";
      else if (pin.startsWith("50")) this.city = "Hyderabad";
      else if (pin.startsWith("38")) this.city = "Ahmedabad";
      else if (pin.startsWith("41")) this.city = "Pune";
      else this.city = "India";

      localStorage.setItem("aurelia_pincode", this.pincode);
      localStorage.setItem("aurelia_city", this.city);
      this.renderHeaderInfo();
      this.closePincodeModal();
      this.showToast(`Delivery location updated to ${this.city} ${this.pincode}`);
    } else {
      alert("Please enter a valid 6-digit Indian pincode.");
    }
  }

  // SELLER CENTRAL (SOLE MERCHANT CONTROLLER)
  openSellerCentral() {
    const modal = document.getElementById("seller-modal");
    if (!modal) return;

    if (!window.adminService.isAuthenticated()) {
      document.getElementById("seller-login-view").classList.remove("hidden");
      document.getElementById("seller-dashboard-view").classList.add("hidden");
    } else {
      document.getElementById("seller-login-view").classList.add("hidden");
      document.getElementById("seller-dashboard-view").classList.remove("hidden");
      this.refreshSellerDashboard();
    }

    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  closeSellerCentral() {
    const modal = document.getElementById("seller-modal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }
  }

  refreshSellerDashboard() {
    this.renderSellerProducts();
    this.renderSellerOrders();
    this.renderSellerMetrics();
    this.renderSellerSettings();
    if (window.lucide) window.lucide.createIcons();
  }

  renderSellerProducts() {
    const tbody = document.getElementById("seller-inventory-table-body");
    if (!tbody) return;

    const raw = window.productRepo.getAllRaw();
    tbody.innerHTML = raw.map(p => {
      const supCost = (p.privateDropshipping && p.privateDropshipping.supplierCost) || 0;
      const shipCost = (p.privateDropshipping && p.privateDropshipping.shippingCost) || 45;
      const profit = p.price - (supCost + shipCost);

      return `
        <tr class="border-b border-stone-200 hover:bg-stone-50" data-id="${p.id}">
          <td class="p-2.5">
            <div class="flex items-center gap-2">
              <img src="${p.images[0]}" class="w-8 h-8 object-cover rounded bg-stone-100 flex-shrink-0" />
              <div>
                <span class="font-bold block truncate max-w-[160px] text-stone-900">${p.name}</span>
                <span class="text-[10px] text-amzOrange uppercase font-bold">${p.category}</span>
              </div>
            </div>
          </td>
          <td class="p-2.5">
            <input type="number" value="${p.price}" class="seller-edit-price w-16 p-1 border border-stone-300 rounded font-bold" />
          </td>
          <td class="p-2.5">
            <input type="number" value="${p.originalPrice || p.price}" class="seller-edit-mrp w-16 p-1 border border-stone-300 rounded text-stone-600" />
          </td>
          <td class="p-2.5">
            <input type="number" value="${supCost}" class="seller-edit-sup w-16 p-1 border border-stone-300 rounded text-stone-600" />
          </td>
          <td class="p-2.5 font-bold ${profit >= 0 ? 'text-amzGreen' : 'text-amzRed'}">
            ?${profit}
          </td>
          <td class="p-2.5">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
              ${p.inStock ? 'Active' : 'Hidden'}
            </span>
          </td>
          <td class="p-2.5 text-right space-x-1 whitespace-nowrap">
            <button type="button" class="seller-save-item-btn btn-amz-cart px-2 py-1 rounded text-[10px] font-bold" data-id="${p.id}">
              Save
            </button>
            <button type="button" class="seller-delete-item-btn text-rose-600 hover:text-rose-800 font-bold text-[10px] p-1" data-id="${p.id}">
              Delete
            </button>
          </td>
        </tr>
      `;
    }).join("");

    tbody.querySelectorAll(".seller-save-item-btn").forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        const tr = btn.closest("tr");
        const price = parseInt(tr.querySelector(".seller-edit-price").value) || 0;
        const originalPrice = parseInt(tr.querySelector(".seller-edit-mrp").value) || price;
        const supplierCost = parseInt(tr.querySelector(".seller-edit-sup").value) || 0;

        const prod = window.productRepo.getById(id);
        if (prod) {
          prod.price = price;
          prod.originalPrice = originalPrice;
          if (!prod.privateDropshipping) prod.privateDropshipping = {};
          prod.privateDropshipping.supplierCost = supplierCost;
          window.productRepo.updateProduct(id, prod);
          this.showToast(`Updated "${prod.name}" in your store catalogue.`);
          this.renderProductGrid();
          this.refreshSellerDashboard();
        }
      };
    });

    tbody.querySelectorAll(".seller-delete-item-btn").forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this product from your store?")) {
          window.productRepo.deleteProduct(id);
          this.showToast("Product deleted.");
          this.renderProductGrid();
          this.refreshSellerDashboard();
        }
      };
    });
  }

  renderSellerOrders() {
    const tbody = document.getElementById("seller-orders-table-body");
    if (!tbody) return;

    const orders = window.adminService.getOrders();
    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-stone-500">No orders logged yet. Test placing an order enquiry via WhatsApp!</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(ord => {
      const itemsList = ord.items.map(i => `${i.name} (${i.variant}) ? ${i.quantity}`).join("<br>");
      return `
        <tr class="border-b border-stone-200 hover:bg-stone-50">
          <td class="p-2.5 font-bold font-mono text-stone-900">${ord.id}</td>
          <td class="p-2.5">
            <div class="font-bold text-stone-900">${ord.customerName}</div>
            <div class="text-[11px] text-stone-500">${ord.customerPhone}</div>
          </td>
          <td class="p-2.5 text-[11px] text-stone-600 max-w-[180px] truncate" title="${ord.address}">
            ${ord.address}
          </td>
          <td class="p-2.5 text-[11px] text-stone-700">${itemsList}</td>
          <td class="p-2.5 font-bold text-stone-900">?${ord.sellingTotal}</td>
          <td class="p-2.5 font-bold text-amzGreen">?${ord.estimatedProfit}</td>
          <td class="p-2.5">
            <select class="order-status-sel bg-white border border-stone-300 rounded p-1 text-[11px] font-bold" data-id="${ord.id}">
              <option value="Enquiry Received" ${ord.status === "Enquiry Received" ? "selected" : ""}>Enquiry Received</option>
              <option value="WhatsApp Confirmed" ${ord.status === "WhatsApp Confirmed" ? "selected" : ""}>WhatsApp Confirmed</option>
              <option value="Dispatched with Tracking" ${ord.status === "Dispatched with Tracking" ? "selected" : ""}>Dispatched with Tracking</option>
              <option value="Delivered" ${ord.status === "Delivered" ? "selected" : ""}>Delivered</option>
              <option value="Cancelled" ${ord.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </td>
        </tr>
      `;
    }).join("");

    tbody.querySelectorAll(".order-status-sel").forEach(sel => {
      sel.onchange = (e) => {
        const id = sel.getAttribute("data-id");
        window.adminService.updateOrderStatus(id, e.target.value);
        this.renderSellerMetrics();
        this.showToast(`Updated status for order #${id}`);
      };
    });
  }

  renderSellerMetrics() {
    const metrics = window.adminService.getFinancialMetrics();
    const grossEl = document.getElementById("metric-gross-sales");
    const costsEl = document.getElementById("metric-total-costs");
    const profitEl = document.getElementById("metric-net-profit");
    const unitsEl = document.getElementById("metric-units-sold");

    if (grossEl) grossEl.textContent = `?${metrics.grossRevenue}`;
    if (costsEl) costsEl.textContent = `?${metrics.totalCosts}`;
    if (profitEl) profitEl.textContent = `?${metrics.netProfit}`;
    if (unitsEl) unitsEl.textContent = metrics.totalUnits;
  }

  renderSellerSettings() {
    const config = window.STORE_CONFIG;
    const brandInput = document.getElementById("setting-brand-name");
    const sellerInput = document.getElementById("setting-seller-name");
    const waInput = document.getElementById("setting-wa-number");
    const threshInput = document.getElementById("setting-free-ship-threshold");

    if (brandInput) brandInput.value = config.brandName;
    if (sellerInput) sellerInput.value = config.sellerName;
    if (waInput) waInput.value = config.whatsappNumber;
    if (threshInput) threshInput.value = config.freeShippingThreshold;
  }

  showToast(message) {
    const toast = document.getElementById("amz-toast");
    const msg = document.getElementById("toast-message");
    if (!toast || !msg) return;

    msg.textContent = message;
    toast.classList.remove("opacity-0", "translate-y-12");
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-12");
    }, 3200);
  }

  bindEvents() {
    // Search form
    const searchForm = document.getElementById("amz-search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.searchQuery = document.getElementById("amz-search-input").value.trim();
        this.currentCategory = document.getElementById("search-category-select").value;
        this.renderSidebarFilters();
        this.renderProductGrid();
        document.getElementById("catalogue-section").scrollIntoView({ behavior: "smooth" });
      });
    }

    // Sort select
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.onchange = (e) => {
        this.sortBy = e.target.value;
        this.renderProductGrid();
      };
    }

    // Express delivery filter checkbox
    const expressChk = document.getElementById("filter-express-delivery");
    if (expressChk) {
      expressChk.onchange = (e) => {
        this.filters.expressOnly = e.target.checked;
        this.renderProductGrid();
      };
    }

    // Rating filters
    document.querySelectorAll(".filter-rating-btn").forEach(btn => {
      btn.onclick = () => {
        this.filters.minRating = parseFloat(btn.getAttribute("data-min-rating"));
        this.renderProductGrid();
      };
    });

    // Price range filters
    document.querySelectorAll(".filter-price-btn").forEach(btn => {
      btn.onclick = () => {
        this.filters.priceMin = parseInt(btn.getAttribute("data-min"));
        this.filters.priceMax = parseInt(btn.getAttribute("data-max"));
        this.renderProductGrid();
      };
    });

    // Custom price Go
    const customPriceBtn = document.getElementById("apply-custom-price-btn");
    if (customPriceBtn) {
      customPriceBtn.onclick = () => {
        const min = parseInt(document.getElementById("custom-min-price").value) || 0;
        const max = parseInt(document.getElementById("custom-max-price").value) || 999999;
        this.filters.priceMin = min;
        this.filters.priceMax = max;
        this.renderProductGrid();
      };
    }

    // Metal filters
    document.querySelectorAll(".metal-checkbox").forEach(chk => {
      chk.onchange = () => {
        const checkedMetals = Array.from(document.querySelectorAll(".metal-checkbox:checked")).map(c => c.value);
        this.filters.metals = checkedMetals;
        this.renderProductGrid();
      };
    });

    // Discount filters
    document.querySelectorAll(".filter-discount-btn").forEach(btn => {
      btn.onclick = () => {
        this.filters.minDiscount = parseInt(btn.getAttribute("data-discount"));
        this.renderProductGrid();
      };
    });

    // Clear all filters
    const clearBtn = document.getElementById("clear-all-filters-btn");
    if (clearBtn) {
      clearBtn.onclick = () => {
        this.currentCategory = "All Categories";
        this.searchQuery = "";
        this.filters = { expressOnly: false, minRating: 0, priceMin: 0, priceMax: 999999, metals: [], minDiscount: 0 };
        document.querySelectorAll(".metal-checkbox").forEach(c => c.checked = false);
        const expChk = document.getElementById("filter-express-delivery");
        if (expChk) expChk.checked = false;
        const searchInput = document.getElementById("amz-search-input");
        if (searchInput) searchInput.value = "";
        this.renderSidebarFilters();
        this.renderProductGrid();
      };
    }

    // Quick nav category links
    document.querySelectorAll(".category-quick-nav").forEach(a => {
      a.onclick = (e) => {
        const cat = a.getAttribute("data-cat");
        if (cat) {
          this.currentCategory = cat;
          const select = document.getElementById("search-category-select");
          if (select) select.value = cat;
          this.renderSidebarFilters();
          this.renderProductGrid();
        }
      };
    });

    // Cart open / close
    document.querySelectorAll(".open-cart-btn").forEach(b => b.onclick = () => this.openCart());
    const closeCartBtn = document.getElementById("close-cart-btn");
    if (closeCartBtn) closeCartBtn.onclick = () => this.closeCart();
    const cartBackdrop = document.getElementById("cart-backdrop");
    if (cartBackdrop) cartBackdrop.onclick = () => this.closeCart();

    // Cart coupon
    const applyCouponBtn = document.getElementById("cart-apply-coupon-btn");
    if (applyCouponBtn) {
      applyCouponBtn.onclick = () => {
        const input = document.getElementById("cart-coupon-input");
        const res = window.cartManager.applyCoupon(input.value);
        this.showToast(res.message);
        if (res.success) input.value = "";
      };
    }

    // Cart listener
    window.addEventListener("aurelia:cart-updated", () => this.renderCartUI());

    // Proceed to checkout
    const proceedBtn = document.getElementById("cart-proceed-checkout-btn");
    if (proceedBtn) proceedBtn.onclick = () => this.openCheckout();
    const closeCheckoutBtn = document.getElementById("close-checkout-btn");
    if (closeCheckoutBtn) closeCheckoutBtn.onclick = () => this.closeCheckout();

    // Checkout form
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) checkoutForm.onsubmit = (e) => this.handleCheckoutSubmit(e);

    // Pincode modal
    const navLocBtn = document.getElementById("nav-location-btn");
    const buyboxLocBtn = document.getElementById("buybox-location-link");
    if (navLocBtn) navLocBtn.onclick = () => this.openPincodeModal();
    if (buyboxLocBtn) buyboxLocBtn.onclick = () => this.openPincodeModal();
    const closePinBtn = document.getElementById("close-pincode-modal-btn");
    if (closePinBtn) closePinBtn.onclick = () => this.closePincodeModal();
    const pincodeForm = document.getElementById("pincode-form");
    if (pincodeForm) pincodeForm.onsubmit = (e) => this.handlePincodeSubmit(e);

    // PDP Close
    const closePdpBtn = document.getElementById("close-pdp-modal-btn");
    if (closePdpBtn) closePdpBtn.onclick = () => this.closePDP();

    // PDP Buy Box buttons
    const pdpAddCartBtn = document.getElementById("pdp-add-to-cart-btn");
    if (pdpAddCartBtn) {
      pdpAddCartBtn.onclick = () => {
        if (!this.activeProduct) return;
        const qty = parseInt(document.getElementById("pdp-quantity-select").value) || 1;
        window.cartManager.addItem(this.activeProduct.id, this.selectedVariant, qty);
        this.closePDP();
        this.showToast(`Added ${qty} ? "${this.activeProduct.name}" to cart!`);
        this.openCart();
      };
    }

    const pdpBuyNowBtn = document.getElementById("pdp-buy-now-btn");
    if (pdpBuyNowBtn) {
      pdpBuyNowBtn.onclick = () => {
        if (!this.activeProduct) return;
        const waUrl = window.whatsappService.generateSingleBuyUrl(this.activeProduct, this.selectedVariant);
        this.closePDP();
        window.open(waUrl, "_blank");
      };
    }

    // Mega Menu Drawer
    const openMenuBtn = document.getElementById("open-mega-menu-btn");
    const closeMenuBtn = document.getElementById("close-mega-menu-btn");
    const menuDrawer = document.getElementById("mega-menu-drawer");
    const menuBackdrop = document.getElementById("mega-menu-backdrop");

    if (openMenuBtn && menuDrawer && menuBackdrop) {
      openMenuBtn.onclick = () => {
        menuDrawer.classList.remove("-translate-x-full");
        menuBackdrop.classList.remove("opacity-0", "pointer-events-none");
        document.body.classList.add("overflow-hidden");
      };
      const closeMega = () => {
        menuDrawer.classList.add("-translate-x-full");
        menuBackdrop.classList.add("opacity-0", "pointer-events-none");
        document.body.classList.remove("overflow-hidden");
      };
      if (closeMenuBtn) closeMenuBtn.onclick = closeMega;
      menuBackdrop.onclick = closeMega;

      document.querySelectorAll(".drawer-cat-btn").forEach(b => {
        b.onclick = () => {
          closeMega();
          const cat = b.getAttribute("data-cat");
          this.currentCategory = cat;
          this.renderSidebarFilters();
          this.renderProductGrid();
          document.getElementById("catalogue-section").scrollIntoView({ behavior: "smooth" });
        };
      });
    }

    // Seller Central triggers
    document.querySelectorAll(".open-seller-btn").forEach(b => b.onclick = () => this.openSellerCentral());
    const closeSellerBtn = document.getElementById("close-seller-btn");
    if (closeSellerBtn) closeSellerBtn.onclick = () => this.closeSellerCentral();

    // Seller Login
    const sellerLoginForm = document.getElementById("seller-login-form");
    if (sellerLoginForm) {
      sellerLoginForm.onsubmit = (e) => {
        e.preventDefault();
        const pin = document.getElementById("seller-pin-input").value;
        if (window.adminService.login(pin)) {
          document.getElementById("seller-pin-input").value = "";
          document.getElementById("seller-login-view").classList.add("hidden");
          document.getElementById("seller-dashboard-view").classList.remove("hidden");
          this.refreshSellerDashboard();
        } else {
          alert("Incorrect PIN. Default Seller Central PIN is 1234.");
        }
      };
    }

    // Seller Logout
    const sellerLogoutBtn = document.getElementById("seller-logout-btn");
    if (sellerLogoutBtn) {
      sellerLogoutBtn.onclick = () => {
        window.adminService.logout();
        this.closeSellerCentral();
        this.showToast("Logged out from Seller Central.");
      };
    }

    // Seller Tabs
    document.querySelectorAll(".seller-tab-btn").forEach(tab => {
      tab.onclick = () => {
        const target = tab.getAttribute("data-tab");
        document.querySelectorAll(".seller-tab-btn").forEach(t => {
          t.className = "seller-tab-btn py-2.5 px-4 font-medium border-b-2 border-transparent text-stone-600 hover:text-stone-900 transition";
        });
        tab.className = "seller-tab-btn py-2.5 px-4 font-bold border-b-2 border-amzOrange text-stone-900 transition";

        document.querySelectorAll(".seller-tab-pane").forEach(p => p.classList.add("hidden"));
        const targetPane = document.getElementById(`seller-pane-${target}`);
        if (targetPane) targetPane.classList.remove("hidden");
      };
    });

    // Seller Add Product Form
    const addProductForm = document.getElementById("seller-add-product-form");
    if (addProductForm) {
      addProductForm.onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.elements["name"].value.trim();
        const category = form.elements["category"].value;
        const metalType = form.elements["metalType"].value;
        const price = form.elements["price"].value;
        const originalPrice = form.elements["originalPrice"].value;
        const stockCount = form.elements["stockCount"].value;
        const supplierCost = form.elements["supplierCost"].value;
        const shippingCost = form.elements["shippingCost"].value;
        const image1 = form.elements["image1"].value.trim();
        const description = form.elements["description"].value.trim();
        const isBestseller = form.elements["isBestseller"].checked;
        const isDealOfDay = form.elements["isDealOfDay"].checked;

        const newProd = window.productRepo.addProduct({
          name, category, metalType, price, originalPrice, stockCount, supplierCost, shippingCost,
          description, isBestseller, isDealOfDay,
          images: [image1],
          aboutBullets: [
            "18K PVD Anti-Tarnish Coating: Shower and sweat resistant.",
            "Exclusive single-seller creation by Aurelia Jewels.",
            "Skin friendly, hypoallergenic, nickel and lead free."
          ]
        });

        form.reset();
        this.showToast(`? Success! Published "${newProd.name}" to your store!`);
        this.renderProductGrid();
        this.renderSidebarFilters();
        this.refreshSellerDashboard();

        // Switch to inventory tab
        const invTab = document.querySelector('[data-tab="inventory"]');
        if (invTab) invTab.click();
      };
    }

    // Seller Settings Form
    const sellerSettingsForm = document.getElementById("seller-settings-form");
    if (sellerSettingsForm) {
      sellerSettingsForm.onsubmit = (e) => {
        e.preventDefault();
        const brand = document.getElementById("setting-brand-name").value.trim();
        const seller = document.getElementById("setting-seller-name").value.trim();
        const wa = document.getElementById("setting-wa-number").value.trim();
        const threshold = parseInt(document.getElementById("setting-free-ship-threshold").value) || 499;

        if (brand) window.STORE_CONFIG.brandName = brand;
        if (seller) window.STORE_CONFIG.sellerName = seller;
        if (wa) {
          window.STORE_CONFIG.whatsappNumber = wa.replace(/[^0-9]/g, "");
          window.STORE_CONFIG.whatsappDisplay = `+${window.STORE_CONFIG.whatsappNumber}`;
        }
        window.STORE_CONFIG.freeShippingThreshold = threshold;

        this.renderHeaderInfo();
        this.showToast("Store settings saved!");
      };
    }

    // Export JSON
    const exportBtn = document.getElementById("seller-export-btn");
    if (exportBtn) exportBtn.onclick = () => window.adminService.exportCatalogue();

    // Import JSON
    const importInput = document.getElementById("seller-import-input");
    if (importInput) {
      importInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const res = window.adminService.importCatalogue(evt.target.result);
          if (res.success) {
            alert(`Successfully imported ${res.count} products!`);
            this.renderProductGrid();
            this.renderSidebarFilters();
            this.refreshSellerDashboard();
          } else {
            alert("Import failed: " + res.message);
          }
        };
        reader.readAsText(file);
      };
    }

    // Reset Defaults
    const resetBtn = document.getElementById("seller-reset-btn");
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm("Reset to sample catalogue defaults?")) {
          window.productRepo.resetToDefault();
          this.renderProductGrid();
          this.renderSidebarFilters();
          this.refreshSellerDashboard();
          this.showToast("Catalogue reset to defaults.");
        }
      };
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.aureliaApp = new AureliaAmazonApp();
  window.aureliaApp.init();
});
