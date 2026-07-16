/* ==========================================================================
   GILBO SPORTS STORE - cart.js
   A fully client-side cart stored in localStorage. There is no server or
   database, so each visitor's cart lives only in their own browser.
   ========================================================================== */

const CART_KEY = "gilbo_sports_cart";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.quantity, 0);
}

function findProduct(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function addToCart(productId, quantity) {
  const product = findProduct(productId);
  if (!product || !product.active) return { success: false, message: "That product is not available right now." };

  const cart = getCart();
  const existing = cart.find(i => i.productId === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: product.price,
      priceMax: product.priceMax || null,
      quantity
    });
  }

  saveCart(cart);
  return { success: true, message: product.name + " added to cart!", cartCount: cartCount() };
}

function updateCartLine(productId, quantity) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(i => i.productId !== Number(productId));
  } else {
    const item = cart.find(i => i.productId === Number(productId));
    if (item) item.quantity = quantity;
  }
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function cartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

/* ---------------- Add-to-cart forms (product cards & detail page) ---------------- */
function wireAddToCartForms() {
  document.querySelectorAll(".add-cart-form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const productId = Number(form.querySelector('[name="product_id"]').value);
      const quantity = Math.max(1, parseInt(form.querySelector('[name="quantity"]').value || "1", 10));
      const result = addToCart(productId, quantity);
      showToast(result.message);
    });
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------------- Cart page rendering ---------------- */
function renderCartPage() {
  const table = document.getElementById("cartTable");
  const emptyMsg = document.getElementById("cartEmpty");
  const summary = document.getElementById("cartSummary");
  if (!table) return;

  const cart = getCart();
  const countText = document.getElementById("cartCountText");
  if (countText) countText.textContent = cart.reduce((s, i) => s + i.quantity, 0) + " item(s) in your cart";

  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";

  if (cart.length === 0) {
    table.style.display = "none";
    if (summary) summary.style.display = "none";
    if (emptyMsg) emptyMsg.style.display = "block";
    return;
  }

  table.style.display = "table";
  if (summary) summary.style.display = "block";
  if (emptyMsg) emptyMsg.style.display = "none";

  cart.forEach(item => {
    const lineTotal = item.unitPrice * item.quantity;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <strong>${escapeHtml(item.name)}</strong>
        ${item.priceMax ? `<br><small style="color:#7c8a86;">Price range: ${formatUGX(item.unitPrice)} - ${formatUGX(item.priceMax)}, confirmed on WhatsApp</small>` : ""}
      </td>
      <td>${formatUGX(item.unitPrice)}${item.priceMax ? "+" : ""}</td>
      <td><input type="number" class="qty-input" data-key="${item.productId}" value="${item.quantity}" min="1"></td>
      <td>${formatUGX(lineTotal)}</td>
      <td><a href="#" class="remove-link" data-key="${item.productId}">Remove</a></td>
    `;
    tbody.appendChild(tr);
  });

  const subtotal = cartSubtotal(cart);
  const totalEl = document.getElementById("cartTotal");
  const subtotalEl = document.getElementById("cartSubtotalDisplay");
  if (totalEl) totalEl.textContent = formatUGX(subtotal);
  if (subtotalEl) subtotalEl.textContent = formatUGX(subtotal);

  table.addEventListener("change", e => {
    if (e.target.classList.contains("qty-input")) {
      updateCartLine(e.target.dataset.key, Math.max(1, parseInt(e.target.value || "1", 10)));
      renderCartPage();
    }
  });
  table.addEventListener("click", e => {
    if (e.target.classList.contains("remove-link")) {
      e.preventDefault();
      updateCartLine(e.target.dataset.key, 0);
      renderCartPage();
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
