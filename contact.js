/* ==========================================================================
   GILBO SPORTS STORE - contact.js
   With no backend, all real messages must live in WhatsApp. This still gives
   an instant "automatic feedback" preview on-screen (matched against
   AUTO_RESPONSES), then hands the customer straight to WhatsApp to send
   their actual message to the admin.
   ========================================================================== */

function generateAutoResponse(message) {
  const lower = message.toLowerCase();
  const sorted = [...AUTO_RESPONSES].sort((a, b) => b.priority - a.priority);
  for (const rule of sorted) {
    if (lower.includes(rule.keyword.toLowerCase())) return rule.response;
  }
  return "Thank you for contacting Gilbo Sports Store! Tap the button below to send this message to our team directly on WhatsApp, and we'll respond personally very soon.";
}

function initContactPage() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;
    valid = validateField("contactName", v => v.trim().length >= 2, "Please enter your name.") && valid;
    valid = validateField("contactPhone", v => /^[0-9+ ]{7,15}$/.test(v.trim()), "Enter a valid phone number.") && valid;
    valid = validateField("contactMessage", v => v.trim().length >= 5, "Please write a short message.") && valid;
    if (!valid) return;

    const name = document.getElementById("contactName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    const autoResponse = generateAutoResponse(message);
    document.getElementById("autoResponseText").textContent = autoResponse;
    document.getElementById("autoResponseBox").style.display = "block";
    form.style.display = "none";

    const fullMessage = `Hello Gilbo Sports Store, my name is ${name} (${phone}).\n\n${message}`;
    document.getElementById("sendWhatsAppInquiryBtn").href = waLink(SHOP.whatsapp, fullMessage);
  });
}
