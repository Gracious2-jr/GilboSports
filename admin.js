/* ==========================================================================
   GILBO SPORTS STORE - admin.js

   IMPORTANT — READ THIS:
   This site has no server or database, so there is no way to enforce real
   login security purely in the browser — anyone who can view this page's
   source code (or the GitHub repository) can see the password below. Treat
   this password prompt as a simple deterrent against casual visitors, NOT
   as real access control. Your actual security comes from GitHub itself:
   only people you've added as collaborators on the repository can edit and
   publish changes. Change ADMIN_PASSWORD below any time by editing this file
   and pushing the change to GitHub.
   ========================================================================== */

const ADMIN_PASSWORD = "Gilbo2026";

let workingProducts = [];
let workingCategories = [];
let workingRules = [];
let workingShop = {};

function initAdminPage() {
  const gate = document.getElementById("adminGate");
  const panel = document.getElementById("adminPanel");

  if (sessionStorage.getItem("gilbo_sports_admin_ok") === "1") {
    gate.style.display = "none";
    panel.style.display = "block";
    loadWorkingData();
    renderAll();
    renderLayout("");
    return;
  }

  document.getElementById("adminLoginForm").addEventListener("submit", e => {
    e.preventDefault();
    const entered = document.getElementById("adminPasswordInput").value;
    if (entered === ADMIN_PASSWORD) {
      sessionStorage.setItem("gilbo_sports_admin_ok", "1");
      gate.style.display = "none";
      panel.style.display = "block";
      loadWorkingData();
      renderAll();
      renderLayout("");
    } else {
      document.getElementById("adminLoginError").style.display = "block";
    }
  });
}

function loadWorkingData() {
  // Deep-copy the live data so edits don't affect anything until exported
  workingProducts = JSON.parse(JSON.stringify(PRODUCTS));
  workingCategories = JSON.parse(JSON.stringify(CATEGORIES));
  workingRules = JSON.parse(JSON.stringify(AUTO_RESPONSES));
  workingShop = JSON.parse(JSON.stringify(SHOP));
}

function renderAll() {
  renderShopEditor();
  renderProductEditor();
  renderRuleEditor();
}

/* ---------------- Shop details ---------------- */
function renderShopEditor() {
  const el = document.getElementById("shopEditorFields");
  el.innerHTML = `
    <div class="form-group">
      <label>Shop Name</label>
      <input type="text" value="${escapeHtml(workingShop.name)}" data-sfield="name">
    </div>
    <div class="form-group">
      <label>Tagline</label>
      <input type="text" value="${escapeHtml(workingShop.tagline)}" data-sfield="tagline">
    </div>
    <div class="form-group">
      <label>Location</label>
      <input type="text" value="${escapeHtml(workingShop.location)}" data-sfield="location">
    </div>
    <div class="form-group">
      <label>WhatsApp Number (digits only, with country code, e.g. 256754454502)</label>
      <input type="text" value="${escapeHtml(workingShop.whatsapp)}" data-sfield="whatsapp">
    </div>
    <div class="form-group">
      <label>Display Phone</label>
      <input type="text" value="${escapeHtml(workingShop.phoneDisplay)}" data-sfield="phoneDisplay">
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" value="${escapeHtml(workingShop.email)}" data-sfield="email">
    </div>
    <div class="form-group">
      <label>Opening Hours</label>
      <input type="text" value="${escapeHtml(workingShop.hours)}" data-sfield="hours">
    </div>
  `;
  el.querySelectorAll("[data-sfield]").forEach(input => {
    input.addEventListener("input", e => { workingShop[e.target.dataset.sfield] = e.target.value; });
  });
}

/* ---------------- Products ---------------- */
function renderProductEditor() {
  const el = document.getElementById("productEditorRows");
  el.innerHTML = workingProducts.map((p, idx) => `
    <div class="admin-editor-row" data-idx="${idx}">
      <input type="text" value="${escapeHtml(p.name)}" data-field="name">
      <select data-field="categoryId">
        ${workingCategories.map(c => `<option value="${c.id}" ${c.id === p.categoryId ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}
      </select>
      <input type="number" value="${p.price}" data-field="price" title="Retail price (UGX) - minimum, if a range">
      <input type="number" value="${p.priceMax || ""}" data-field="priceMax" title="Maximum price (UGX) - leave blank if one fixed price">
      <input type="number" value="${p.stock}" data-field="stock" title="Stock quantity">
      <input type="text" value="${escapeHtml(p.image)}" data-field="image" title="Image file path" placeholder="assets/images/products/yourfile.jpg">
      <label style="font-size:11px;"><input type="checkbox" data-field="active" ${p.active ? "checked" : ""}> Available</label>
    </div>
  `).join("");

  el.querySelectorAll("[data-field]").forEach(input => {
    input.addEventListener("input", handleProductFieldChange);
    input.addEventListener("change", handleProductFieldChange);
  });
}

function handleProductFieldChange(e) {
  const row = e.target.closest(".admin-editor-row");
  const idx = Number(row.dataset.idx);
  const field = e.target.dataset.field;
  const product = workingProducts[idx];

  if (field === "active") {
    product.active = e.target.checked;
  } else if (field === "categoryId") {
    product.categoryId = Number(e.target.value);
  } else if (field === "price" || field === "stock") {
    product[field] = Number(e.target.value) || 0;
  } else if (field === "priceMax") {
    product.priceMax = e.target.value === "" ? null : Number(e.target.value);
  } else {
    product[field] = e.target.value;
  }
}

function addNewProduct() {
  const nextId = workingProducts.length ? Math.max(...workingProducts.map(p => p.id)) + 1 : 1;

  workingProducts.push({
    id: nextId,
    categoryId: workingCategories[0] ? workingCategories[0].id : 1,
    name: "New Product",
    description: "",
    gender: "unisex",
    price: 0,
    priceMax: null,
    image: "assets/images/products/placeholder.svg",
    active: true,
    stock: 0
  });

  renderProductEditor();
  showAdminToast("New product row added at the bottom — fill in its details, then export.");
}

/* ---------------- Auto-response rules ---------------- */
function renderRuleEditor() {
  const el = document.getElementById("ruleEditorRows");
  el.innerHTML = workingRules.map((r, idx) => `
    <div class="form-group" data-ridx="${idx}" style="display:grid;grid-template-columns:1fr 3fr 1fr auto;gap:8px;align-items:start;margin-bottom:10px;">
      <input type="text" value="${escapeHtml(r.keyword)}" data-rfield="keyword" placeholder="keyword">
      <textarea data-rfield="response" rows="2">${escapeHtml(r.response)}</textarea>
      <input type="number" value="${r.priority}" data-rfield="priority" title="Priority">
      <button type="button" onclick="removeRule(${idx})" style="border:none;background:none;color:#c0392b;font-weight:700;cursor:pointer;">Delete</button>
    </div>
  `).join("");

  el.querySelectorAll("[data-rfield]").forEach(input => {
    input.addEventListener("input", e => {
      const idx = Number(e.target.closest("[data-ridx]").dataset.ridx);
      const field = e.target.dataset.rfield;
      workingRules[idx][field] = field === "priority" ? Number(e.target.value) : e.target.value;
    });
  });
}

function addNewRule() {
  workingRules.push({ keyword: "", response: "", priority: 5 });
  renderRuleEditor();
}

function removeRule(idx) {
  workingRules.splice(idx, 1);
  renderRuleEditor();
}

/* ---------------- Export updated data.js ---------------- */
function exportDataFile() {
  const fileText = buildDataFileText();
  const blob = new Blob([fileText], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.js";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showAdminToast("data.js downloaded! Now replace assets/js/data.js in your GitHub repo with this file (see instructions above).");
}

function buildDataFileText() {
  return `/* ==========================================================================
   GILBO SPORTS STORE - SITE DATA
   Exported from the admin tool on ${new Date().toISOString()}.
   Replace assets/js/data.js in your GitHub repository with this file to
   publish these changes to the live site.
   ========================================================================== */

const SHOP = ${JSON.stringify(workingShop, null, 2)};

const CATEGORIES = ${JSON.stringify(workingCategories, null, 2)};

const PRODUCTS = ${JSON.stringify(workingProducts, null, 2)};

const AUTO_RESPONSES = ${JSON.stringify(workingRules, null, 2)};
`;
}

function showAdminToast(message) {
  showToast(message);
}
