/* ==========================================================================
   GILBO SPORTS STORE - layout.js
   Renders the shared header/nav/footer/WhatsApp button on every page.
   Works with plain static hosting (GitHub Pages) - no includes needed.
   ========================================================================== */

function waLink(number, message) {
  const digits = String(number).replace(/\D/g, "");
  return "https://wa.me/" + digits + "?text=" + encodeURIComponent(message);
}

function formatUGX(amount) {
  const n = Math.round(Number(amount) || 0);
  return SHOP.currency + " " + n.toLocaleString("en-US");
}

function formatPriceRange(p) {
  if (p.priceMax && p.priceMax > p.price) {
    return formatUGX(p.price) + " - " + formatUGX(p.priceMax);
  }
  return formatUGX(p.price);
}

function cartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function initHeroSlideshow() {
  const container = document.getElementById("heroBgSlides");
  if (!container || typeof BANNER_IMAGES === "undefined" || BANNER_IMAGES.length === 0) return;

  container.innerHTML = BANNER_IMAGES.map((src, i) =>
    `<div class="hero-bg-slide ${i === 0 ? "active" : ""}" style="background-image:url('${src}')"></div>`
  ).join("");

  if (BANNER_IMAGES.length < 2) return;

  let current = 0;
  const slides = container.querySelectorAll(".hero-bg-slide");

  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 4500);
}

function renderLayout(activePage) {
  renderHeader(activePage);
  renderWhatsappFloat();
  renderFooter();
  wireMobileNav();
}

function renderHeader(activePage) {
  const el = document.getElementById("site-header");
  if (!el) return;

  const navItems = [
    { href: "index.html", label: "Home" },
    { href: "products.html", label: "Shop" },
    { href: "contact.html", label: "Contact" }
  ];

  const navHtml = navItems.map(item =>
    `<a href="${item.href}" class="${activePage === item.href ? "active" : ""}">${item.label}</a>`
  ).join("");

  el.innerHTML = `
    <div class="topbar">
      <div class="container topbar-inner">
        <span>📍 ${SHOP.location}</span>
        <span>Order via WhatsApp: ${SHOP.phoneDisplay}</span>
      </div>
    </div>
    <div class="container navbar">
      <a href="index.html" class="logo">Gilbo<span>Sports</span></a>
      <nav class="main-nav" id="mainNav">${navHtml}</nav>
      <div class="nav-actions">
        <a href="cart.html" class="cart-icon" title="View cart">
          🛒 <span class="cart-badge" id="cartBadge">${cartCount()}</span>
        </a>
        <button class="hamburger" id="hamburgerBtn" aria-label="Menu">&#9776;</button>
      </div>
    </div>
  `;
}

function wireMobileNav() {
  const btn = document.getElementById("hamburgerBtn");
  const nav = document.getElementById("mainNav");
  if (btn && nav) btn.addEventListener("click", () => nav.classList.toggle("open"));
}

function renderWhatsappFloat() {
  if (document.querySelector(".whatsapp-float")) return;
  const a = document.createElement("a");
  a.href = waLink(SHOP.whatsapp, "Hello Gilbo Sports Store, I would like to ask about...");
  a.target = "_blank";
  a.rel = "noopener";
  a.className = "whatsapp-float";
  a.title = "Chat with us on WhatsApp";
  a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="#fff">
    <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-2C13.5 27.6 14.7 28 16 28c6.6 0 12-5.4 12-13S22.6 3 16 3zm0 23c-1.3 0-2.5-.3-3.6-.9l-.3-.2-4.3 1.1 1.1-4.1-.2-.3C7.6 19.4 7 17.3 7 15c0-5 4-9 9-9s9 4 9 9-4 9-9 9zm5-6.7c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-1.5-.7-2.5-1.3-3.5-3-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z"/>
  </svg>`;
  document.body.appendChild(a);
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
    <div class="container footer-grid">
      <div>
        <h3>Gilbo<span>Sports</span></h3>
        <p>Retail clothing, home essentials, bags and baby items. Proudly serving Kakira, Jinja, Uganda.</p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul>
          <li><a href="products.html">Shop All Products</a></li>
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="admin.html">Admin</a></li>
        </ul>
      </div>
      <div>
        <h4>Get In Touch</h4>
        <ul>
          <li>${SHOP.location}</li>
          <li>WhatsApp: +${SHOP.whatsapp.replace(/^(\d{3})(\d{3})(\d{6})$/, "$1 $2 $3")}</li>
          <li><a href="mailto:${SHOP.email}">${SHOP.email}</a></li>
        </ul>
      </div>
      <div>
        <h4>Sustainable Development</h4>
        <p style="font-size:13px;">This platform supports <strong>SDG 8: Decent Work &amp; Economic Growth</strong> by digitizing a local Kakira, Jinja retail business and expanding its market reach.</p>
      </div>
    </div>
    <div class="footer-bottom">&copy; ${new Date().getFullYear()} Gilbo Sports Store, Kakira, Jinja, Uganda. All rights reserved.</div>
  `;
}
