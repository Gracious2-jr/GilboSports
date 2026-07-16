/* ==========================================================================
   GILBO SPORTS STORE - checkout.js
   There is no server or database, so "placing an order" means: build a clear,
   itemized message and open WhatsApp so the customer sends it straight to
   Gilbo Sports Store. The admin then manages the whole order inside WhatsApp.
   ========================================================================== */

function buildOrderMessage(cart, details) {
  let msg = `New order from ${details.name} (${details.phone})\n`;
  msg += `Delivery: ${details.deliveryOption === "delivery" ? "Delivery to " + details.address : "Pickup at the shop in " + SHOP.location}\n`;
  msg += `Payment: ${paymentLabel(details.paymentMethod)}\n\nItems:\n`;

  cart.forEach(item => {
    msg += `- ${item.quantity} x ${item.name}`;
    if (item.priceMax) msg += ` (price ${formatUGX(item.unitPrice)}-${formatUGX(item.priceMax)}, please confirm exact size/price)`;
    msg += ` — ${formatUGX(item.unitPrice * item.quantity)}${item.priceMax ? "+" : ""}\n`;
  });

  msg += `\nTotal: ${formatUGX(cartSubtotal(cart))}`;
  return msg;
}

function paymentLabel(method) {
  return { mtn_momo: "MTN Mobile Money", airtel_money: "Airtel Money", cash_on_delivery: "Cash on Delivery/Pickup" }[method] || method;
}

function initCheckoutPage() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  document.getElementById("deliveryOption").addEventListener("change", function () {
    document.getElementById("addressGroup").style.display = this.value === "delivery" ? "block" : "none";
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;
    valid = validateField("checkoutName", v => v.trim().length >= 2, "Please enter your full name.") && valid;
    valid = validateField("checkoutPhone", v => /^[0-9+ ]{7,15}$/.test(v.trim()), "Enter a valid phone number.") && valid;

    const deliveryOption = document.getElementById("deliveryOption").value;
    if (deliveryOption === "delivery") {
      valid = validateField("checkoutAddress", v => v.trim().length >= 5, "Please enter a delivery address.") && valid;
    }

    if (!valid) return;

    const details = {
      name: document.getElementById("checkoutName").value.trim(),
      phone: document.getElementById("checkoutPhone").value.trim(),
      deliveryOption,
      address: document.getElementById("checkoutAddress").value.trim(),
      paymentMethod: document.getElementById("paymentMethod").value
    };

    const message = buildOrderMessage(cart, details);
    const link = waLink(SHOP.whatsapp, message);

    sessionStorage.setItem("gilbo_sports_last_order_message", message);
    sessionStorage.setItem("gilbo_sports_last_order_link", link);
    clearCart();
    window.location.href = "order-confirmation.html";
  });
}

function validateField(id, testFn, errorMsg) {
  const input = document.getElementById(id);
  if (!input) return true;
  const group = input.closest(".form-group");
  const errorEl = group ? group.querySelector(".form-error") : null;
  const ok = testFn(input.value);
  if (group) group.classList.toggle("invalid", !ok);
  if (errorEl) errorEl.textContent = errorMsg;
  return ok;
}

function initOrderConfirmationPage() {
  const message = sessionStorage.getItem("gilbo_sports_last_order_message");
  const link = sessionStorage.getItem("gilbo_sports_last_order_link");
  const box = document.getElementById("orderSummaryBox");
  const waBtn = document.getElementById("sendWhatsAppBtn");

  if (!message || !link) {
    document.getElementById("noOrderMsg").style.display = "block";
    return;
  }

  box.textContent = message;
  waBtn.href = link;
}
