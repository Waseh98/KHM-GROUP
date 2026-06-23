const https = require('https');

// ─── Wati API Config (from .env) ────────────────────────────────────────────
const WATI_ENDPOINT      = process.env.WATI_ENDPOINT      || 'live-mt-server.wati.io';
const WATI_TENANT_ID     = process.env.WATI_TENANT_ID     || '10187930';
const WATI_ACCESS_TOKEN  = process.env.WATI_ACCESS_TOKEN;
const WATI_TEMPLATE_NAME = process.env.WATI_TEMPLATE_NAME || 'order_confirmation';

// ─── Format phone to international format (e.g. 03XX → 923XX) ──────────────
function formatPhone(phone) {
  if (!phone) return null;
  // Remove all non-digit characters
  let cleaned = String(phone).replace(/\D/g, '');
  // Pakistan local number starting with 0
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '92' + cleaned.substring(1);
  }
  // If already 12 digits and starts with 92 — good
  if (cleaned.startsWith('92') && cleaned.length === 12) {
    return cleaned;
  }
  // If 10 digits without leading 0 (e.g. 3XXXXXXXXX)
  if (cleaned.length === 10) {
    return '92' + cleaned;
  }
  // Return as-is and hope for the best
  return cleaned;
}

// ─── Send WhatsApp order confirmation via Wati template ─────────────────────
async function sendWhatsAppOrderConfirmation(order, customerPhone, customerName) {
  if (!WATI_ACCESS_TOKEN) {
    console.warn('[WhatsApp] WATI_ACCESS_TOKEN not set — skipping WhatsApp notification');
    return;
  }

  const phone = formatPhone(customerPhone);
  if (!phone) {
    console.warn('[WhatsApp] No valid phone number — skipping WhatsApp notification');
    return;
  }

  const orderNumber = order.orderNumber || String(order._id).slice(-8).toUpperCase();
  const totalAmount = (order.totalPrice || 0).toLocaleString('en-PK');

  // Template variables matching your Wati template body:
  // "Assalam-o-Alaikum {{name}}, your order #{{order_number}} has been confirmed!
  //  Total: PKR {{total_price}}. Thank you for shopping with K-TEX Store!"
  const payload = JSON.stringify({
    template_name: WATI_TEMPLATE_NAME,
    broadcast_name: `order_${orderNumber}_${Date.now()}`,
    parameters: [
      { name: 'name',         value: customerName  || 'Customer' },
      { name: 'order_number', value: String(orderNumber) },
      { name: 'total_price',  value: String(totalAmount) },
    ],
  });

  const path = `/api/v1/sendTemplateMessage?whatsappNumber=${phone}`;

  return new Promise((resolve) => {
    const options = {
      hostname : WATI_ENDPOINT,
      path     : `/${WATI_TENANT_ID}${path}`,
      method   : 'POST',
      headers  : {
        'Authorization' : WATI_ACCESS_TOKEN,
        'Content-Type'  : 'application/json-patch+json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.result === true) {
            console.log(`[WhatsApp] ✅ Message sent successfully to ${phone} — Order #${orderNumber}`);
          } else {
            console.warn(`[WhatsApp] ⚠️  Wati responded (${res.statusCode}):`, parsed);
          }
        } catch {
          console.log(`[WhatsApp] Response (${res.statusCode}):`, data);
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error('[WhatsApp] ❌ Request failed:', err.message);
      resolve(); // Never throw — order should still succeed
    });

    req.write(payload);
    req.end();
  });
}

module.exports = { sendWhatsAppOrderConfirmation };
