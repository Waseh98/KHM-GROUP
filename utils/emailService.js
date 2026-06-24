const https = require('https');

const BREVO_API_KEY    = process.env.BREVO_API_KEY;
const SENDER_EMAIL     = process.env.BREVO_SENDER_EMAIL || 'orders@ktexstore.com';
const SENDER_NAME      = process.env.BREVO_SENDER_NAME  || 'K-TEX Store';

/**
 * Send a transactional email via Brevo API
 */
function sendEmail({ toEmail, toName, subject, htmlContent }) {
  return new Promise((resolve, reject) => {
    if (!BREVO_API_KEY) {
      console.warn('[Email] BREVO_API_KEY not set — skipping email');
      return resolve();
    }

    const payload = JSON.stringify({
      sender:  { name: SENDER_NAME, email: SENDER_EMAIL },
      to:      [{ email: toEmail, name: toName || toEmail }],
      subject,
      htmlContent,
    });

    const options = {
      hostname: 'api.brevo.com',
      path:     '/v3/smtp/email',
      method:   'POST',
      headers:  {
        'Content-Type':  'application/json',
        'api-key':       BREVO_API_KEY,
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`[Email] ✅ Sent to ${toEmail}`);
          resolve(data);
        } else {
          console.error(`[Email] ❌ Brevo error ${res.statusCode}:`, data);
          resolve(); // Don't reject — email failure shouldn't break order
        }
      });
    });

    req.on('error', (err) => {
      console.error('[Email] ❌ Request error:', err.message);
      resolve(); // Don't reject
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Send Order Confirmation Email to customer
 */
async function sendOrderConfirmationEmail(order, customerEmail, customerName) {
  if (!customerEmail) {
    console.warn('[Email] No customer email — skipping confirmation');
    return;
  }

  const orderNumber = order.orderNumber || order._id;
  const paymentMethod = (order.paymentMethod || 'cod').toUpperCase();
  const paymentLabel  = paymentMethod === 'COD' ? 'COD (50% Advance Paid)' : 'Online Payment (Fully Paid)';

  // Build items rows
  const itemsRows = (order.orderItems || []).map(item => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe0;">
        <div style="font-weight: 600; color: #1a1a1a; font-size: 14px;">${item.name || 'Product'}</div>
        ${item.size ? `<div style="color: #888; font-size: 12px; margin-top: 2px;">Size: ${item.size}</div>` : ''}
        ${item.color ? `<div style="color: #888; font-size: 12px;">Color: ${item.color}</div>` : ''}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe0; text-align: center; color: #555; font-size: 14px;">
        ×${item.quantity || 1}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe0; text-align: right; font-weight: 700; color: #1a1a1a; font-size: 14px;">
        Rs. ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
      </td>
    </tr>
  `).join('');

  const shippingAddr = order.shippingAddress || {};
  const addressLine  = [shippingAddr.address, shippingAddr.city, shippingAddr.province, shippingAddr.postalCode]
    .filter(Boolean).join(', ');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation - K-TEX Store</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f0e8; font-family: 'Segoe UI', Arial, sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1510 0%, #2d2416 100%); padding: 36px 40px; text-align:center;">
              <div style="font-size:28px; font-weight:900; letter-spacing:0.12em; color:#d4af5a;">K-TEX</div>
              <div style="font-size:11px; letter-spacing:0.25em; color:#a08840; margin-top:4px; text-transform:uppercase;">Premium Fashion</div>
            </td>
          </tr>

          <!-- Green tick + title -->
          <tr>
            <td style="padding: 40px 40px 24px; text-align:center;">
              <div style="width:64px; height:64px; background: linear-gradient(135deg, #2ecc71, #27ae60); border-radius:50%; margin:0 auto 20px; text-align:center; line-height:64px; color:#ffffff; font-size:32px; display:block;">&#10003;</div>
              <h1 style="margin:0; font-size:24px; font-weight:800; color:#1a1a1a;">Order Confirmed!</h1>
              <p style="margin: 10px 0 0; color:#666; font-size:15px;">Thank you for shopping with K-TEX Store, ${customerName || 'Valued Customer'}!</p>
            </td>
          </tr>

          <!-- Order Number Banner -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <div style="background: linear-gradient(135deg, #fdf8ee, #f5edd6); border: 1px solid #e8d89a; border-radius:12px; padding:18px 24px; text-align:center;">
                <div style="font-size:12px; color:#a08840; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:6px;">Order Number</div>
                <div style="font-size:18px; font-weight:900; color:#1a1510; letter-spacing:0.05em;">${orderNumber}</div>
              </div>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <div style="font-size:13px; font-weight:700; color:#1a1a1a; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:12px;">Items Ordered</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f0ebe0; border-radius:10px; overflow:hidden;">
                <thead>
                  <tr style="background:#faf6ee;">
                    <th style="padding:10px 16px; text-align:left; font-size:11px; color:#888; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">Product</th>
                    <th style="padding:10px 16px; text-align:center; font-size:11px; color:#888; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">Qty</th>
                    <th style="padding:10px 16px; text-align:right; font-size:11px; color:#888; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Price Summary -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0; color:#666; font-size:14px;">Subtotal</td>
                  <td style="padding:6px 0; text-align:right; color:#333; font-size:14px;">Rs. ${(order.itemsPrice || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#666; font-size:14px;">Shipping</td>
                  <td style="padding:6px 0; text-align:right; color:#333; font-size:14px;">${(order.shippingPrice || 0) === 0 ? '<span style="color:#2ecc71; font-weight:700;">FREE</span>' : 'Rs. ' + (order.shippingPrice || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#666; font-size:14px;">Total Order Value</td>
                  <td style="padding:6px 0; text-align:right; color:#333; font-size:14px;">Rs. ${(order.totalPrice || 0).toLocaleString()}</td>
                </tr>
                ${paymentMethod === 'COD' ? `
                <tr>
                  <td style="padding:6px 0; color:#2ecc71; font-weight:700; font-size:14px;">50% Advance Paid</td>
                  <td style="padding:6px 0; text-align:right; color:#2ecc71; font-weight:700; font-size:14px;">Rs. ${Math.round((order.totalPrice || 0) / 2).toLocaleString()}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:10px; border-top: 2px solid #f0ebe0;"></td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:800; font-size:16px; color:#1a1510;">Remaining on Delivery</td>
                  <td style="padding:8px 0; text-align:right; font-weight:900; font-size:18px; color:#d4af5a;">Rs. ${((order.totalPrice || 0) - Math.round((order.totalPrice || 0) / 2)).toLocaleString()}</td>
                </tr>
                ` : `
                <tr>
                  <td style="padding:6px 0; color:#2ecc71; font-weight:700; font-size:14px;">Amount Paid In Advance</td>
                  <td style="padding:6px 0; text-align:right; color:#2ecc71; font-weight:700; font-size:14px;">Rs. ${(order.totalPrice || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:10px; border-top: 2px solid #f0ebe0;"></td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:800; font-size:16px; color:#1a1510;">Remaining on Delivery</td>
                  <td style="padding:8px 0; text-align:right; font-weight:900; font-size:18px; color:#2ecc71;">Rs. 0</td>
                </tr>
                `}
              </table>
            </td>
          </tr>

          <!-- Shipping & Payment Info -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right:8px; vertical-align:top;">
                    <div style="background:#faf6ee; border:1px solid #f0ebe0; border-radius:10px; padding:16px;">
                      <div style="font-size:11px; font-weight:700; color:#a08840; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">&#128230; Shipping To</div>
                      <div style="font-size:13px; color:#333; font-weight:600;">${shippingAddr.fullName || customerName || ''}</div>
                      ${shippingAddr.phone ? `<div style="font-size:12px; color:#666; margin-top:3px;">${shippingAddr.phone}</div>` : ''}
                      ${addressLine ? `<div style="font-size:12px; color:#666; margin-top:3px; line-height:1.5;">${addressLine}</div>` : ''}
                    </div>
                  </td>
                  <td width="50%" style="padding-left:8px; vertical-align:top;">
                    <div style="background:#faf6ee; border:1px solid #f0ebe0; border-radius:10px; padding:16px;">
                      <div style="font-size:11px; font-weight:700; color:#a08840; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">&#128179; Payment</div>
                      <div style="font-size:13px; color:#333; font-weight:600;">${paymentLabel}</div>
                      <div style="margin-top:6px;">
                        <span style="display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; background:${order.paymentStatus === 'paid' ? '#e8f8f0' : '#fff8e8'}; color:${order.paymentStatus === 'paid' ? '#2ecc71' : '#d4af5a'}; border: 1px solid ${order.paymentStatus === 'paid' ? '#2ecc7130' : '#d4af5a30'};">
                          ${(order.paymentStatus || 'pending').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What Happens Next -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <div style="background: linear-gradient(135deg, #f0faf5, #e8f8f0); border:1px solid #b8e8cc; border-radius:10px; padding:18px 20px;">
                <div style="font-size:13px; font-weight:700; color:#1a6b3a; margin-bottom:10px;">&#128666; What Happens Next?</div>
                <div style="font-size:13px; color:#2d7a4a; line-height:1.7;">
                  &#10003; &nbsp;We've received your order<br/>
                  &#128222; &nbsp;Our team will confirm via call within 24 hours<br/>
                  &#128666; &nbsp;Your order will be dispatched within 2-3 business days<br/>
                  &#128230; &nbsp;Delivery within 4-7 business days
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a1510; padding:28px 40px; text-align:center;">
              <div style="font-size:18px; font-weight:900; letter-spacing:0.1em; color:#d4af5a; margin-bottom:8px;">K-TEX</div>
              <div style="font-size:12px; color:#8a7050; margin-bottom:12px;">Premium Quality Clothing &#8212; Made to Last</div>
              <div style="font-size:12px; color:#8a7050;">
                Questions? Contact us at 
                <a href="mailto:info@ktexstore.com" style="color:#d4af5a; text-decoration:none;">info@ktexstore.com</a>
              </div>
              <div style="font-size:11px; color:#5a4030; margin-top:16px;">
                &copy; 2026 K-TEX Store. All rights reserved.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;

  return sendEmail({
    toEmail:     customerEmail,
    toName:      customerName || 'Valued Customer',
    subject:     `Order Confirmed - ${orderNumber} | K-TEX Store`,
    htmlContent,
  });
}

module.exports = { sendOrderConfirmationEmail };
