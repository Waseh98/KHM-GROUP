const crypto = require('crypto');
const https = require('https');

// Utility to hash user data as required by Meta CAPI (SHA256, lowercased, hex)
const hashData = (data) => {
  if (!data) return undefined;
  return crypto.createHash('sha256').update(data.toString().toLowerCase().trim()).digest('hex');
};

/**
 * Send an event to Facebook Conversions API
 */
const sendConversionEvent = (eventName, eventData, userData, eventId) => {
  return new Promise((resolve, reject) => {
    const PIXEL_ID = process.env.META_PIXEL_ID || '1550279353407980';
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

    if (!ACCESS_TOKEN) {
      console.warn('[Meta CAPI] No Access Token provided. Skipping event:', eventName);
      return resolve();
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_id: eventId,
          user_data: {
            client_ip_address: userData.client_ip_address,
            client_user_agent: userData.client_user_agent,
            em: userData.email ? [hashData(userData.email)] : undefined,
            ph: userData.phone ? [hashData(userData.phone)] : undefined,
          },
          custom_data: {
            value: eventData.value,
            currency: eventData.currency || 'PKR',
          },
        }
      ],
    };

    if (process.env.META_TEST_CODE) {
      payload.test_event_code = process.env.META_TEST_CODE;
    }

    const payloadString = JSON.stringify(payload);

    const options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: `/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadString)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`[Meta CAPI] Successfully sent ${eventName} event. FB Trace ID: ${result.fbtrace_id}`);
            resolve(result);
          } else {
            console.error(`[Meta CAPI] Error sending ${eventName}:`, result.error?.message || data);
            reject(new Error(result.error?.message || 'Meta API Error'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`[Meta CAPI] Network error:`, error.message);
      reject(error);
    });

    req.write(payloadString);
    req.end();
  });
};

module.exports = {
  sendConversionEvent,
  hashData
};
