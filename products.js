/* ==========================================================================
   GILBO SPORTS STORE - products.js
   Renders product grids/cards and applies category/gender/search filters.
   ========================================================================== */

function categoryName(categoryId) {
  const c = CATEGORIES.find(c => c.id === Number(categoryId));
  return c ? c.name : "";
}

function productCardHtml(p) {
  return `
    <div class="product-card">
      <a href="product.html?id=${p.id}" class="product-img">
        <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
      </a>
      <div class="product-body">
        <span class="gender-tag">${p.gender.charAt(0).toUpperCase() + p.gender.slice(1)}</span>
        <div class="product-cat">${escapeHtml(categoryName(p.categoryId))}</div>
        <a href="product.html?id=${p.id}" class="product-name" style="color:inherit;">
          ${escapeHtml(p.name)}
        </a>
        <div class="product-price">
          ${formatPriceRange(p)}
          <small>${p.priceMax && p.priceMax > p.price ? "Price varies by size &bull; " : ""}${p.stock > 0 ? p.stock + " in stock" : "Out of stock"}</small>
        </div>
        <form class="add-cart-form">
          <input type="hidden" name="product_id" value="${p.id}">
          <input type="hidden" name="quantity" value="1">
          <button type="submit" class="add-cart-btn" ${p.stock > 0 ? "" : "disabled"}>${p.stock > 0 ? "Add to Cart" : "Out of Stock"}</button>
        </form>
      </div>
    </div>
  `;
}

function renderProductGrid(containerId, products) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (products.length === 0) {
    el.innerHTML = '<p class="text-center" style="padding:40px 0;color:#7c8a86;grid-column:1/-1;">No products matched your filters. Try adjusting your search.</p>';
  } else {
    el.innerHTML = products.map(productCardHtml).join("");
  }
  wireAddToCartForms();
}

function renderCategoryPills(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const params = new URLSearchParams(window.location.search);
  const activeCat = params.get("category") || "";

  let html = `<a href="products.html" class="cat-pill ${activeCat === "" ? "active" : ""}">All Products</a>`;
  CATEGORIES.forEach(cat => {
    html += `<a href="products.html?category=${cat.id}" class="cat-pill ${activeCat == cat.id ? "active" : ""}">${escapeHtml(cat.name)}</a>`;
  });
  el.innerHTML = html;
}

function getFilteredProducts() {
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get("category");
  const gender = params.get("gender");
  const q = (params.get("q") || "").toLowerCase();

  return PRODUCTS.filter(p => {
    if (!p.active) return false;
    if (categoryId && p.categoryId !== Number(categoryId)) return false;
    if (gender && p.gender !== gender) return false;
    if (q && !p.name.toLowerCase().includes(q)) return false;
    return true;
  });
}

function populateFilterForm() {
  const params = new URLSearchParams(window.location.search);

  const catSelect = document.getElementById("filterCategory");
  if (catSelect) {
    catSelect.innerHTML = '<option value="">All Categories</option>' +
      CATEGORIES.map(c => `<option value="${c.id}" ${params.get("category") == c.id ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("");
  }

  const genderSelect = document.getElementById("filterGender");
  if (genderSelect) {
    ["men", "women", "kids", "unisex"].forEach(g => {
      const opt = genderSelect.querySelector(`option[value="${g}"]`);
      if (opt && params.get("gender") === g) opt.selected = true;
    });
  }

  const qInput = document.getElementById("filterQuery");
  if (qInput) qInput.value = params.get("q") || "";
}
