const fs = require('fs');
const path = require('path');

const LEOPARDS_API_KEY = process.env.LEOPARDS_API_KEY || '487F7B22F68312D2C1BBC93B1AEA445B1782804115';
const LEOPARDS_API_PASSWORD = process.env.LEOPARDS_API_PASSWORD || 'Wasay786@';
const LEOPARDS_BASE_URL = 'https://merchantapi.leopardscourier.com/api';

const CITIES_CACHE_FILE = path.join(__dirname, 'leopards_cities.json');

/**
 * Fetch all cities from Leopards API
 */
async function fetchCitiesFromLeopards() {
  const url = `${LEOPARDS_BASE_URL}/getAllCities/format/json/`;
  const body = new URLSearchParams({
    api_key: LEOPARDS_API_KEY,
    api_password: LEOPARDS_API_PASSWORD
  });

  try {
    const res = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!res.ok) {
      throw new Error(`Leopards API returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.status === 1 && Array.isArray(data.city_list)) {
      return data.city_list
        .map(c => ({
          id: c.id,
          name: c.name,
          allowAsDestination: c.allow_as_destination === true || c.allow_as_destination === 'true' || c.allow_as_destination === 1
        }))
        .filter(c => c.allowAsDestination)
        .sort((a, b) => a.name.localeCompare(b.name));
    } else {
      throw new Error(data.error || 'Failed to fetch city list from Leopards');
    }
  } catch (err) {
    console.error('[Leopards Service] Error fetching cities:', err.message);
    return [];
  }
}

/**
 * Get cached cities list, fallback to live fetch
 */
async function getLeopardsCities() {
  if (fs.existsSync(CITIES_CACHE_FILE)) {
    try {
      const data = fs.readFileSync(CITIES_CACHE_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('[Leopards Service] Failed to read cities cache:', e);
    }
  }

  const cities = await fetchCitiesFromLeopards();
  if (cities && cities.length) {
    try {
      fs.writeFileSync(CITIES_CACHE_FILE, JSON.stringify(cities, null, 2), 'utf8');
    } catch (e) {
      console.error('[Leopards Service] Failed to write cities cache:', e);
    }
  }
  return cities;
}

/**
 * Book a packet in Leopards
 */
async function bookLeopardsPacket({
  weightGrams = 500,
  pieces = 1,
  collectAmount = 0,
  orderNumber,
  destinationCityId,
  customerName,
  customerPhone,
  customerAddress,
  instructions = 'Standard Overnight Delivery'
}) {
  const url = `${LEOPARDS_BASE_URL}/bookPacket/format/json/`;

  const payload = {
    api_key: LEOPARDS_API_KEY,
    api_password: LEOPARDS_API_PASSWORD,
    booked_packet_weight: Number(weightGrams),
    booked_packet_no_piece: Number(pieces),
    booked_packet_collect_amount: Number(collectAmount),
    booked_packet_order_id: String(orderNumber),
    origin_city: 'self', // Automatically uses origin city set in merchant profile
    destination_city: String(destinationCityId),
    shipment_name_eng: 'self',
    shipment_email: 'self',
    shipment_phone: 'self',
    shipment_address: 'self',
    consignment_name_eng: String(customerName).trim(),
    consignment_phone: String(customerPhone).replace(/[^0-9+]/g, '').trim(),
    consignment_address: String(customerAddress).trim(),
    special_instructions: String(instructions).trim()
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: new URLSearchParams(payload),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!res.ok) {
      throw new Error(`Leopards API returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.status === 1) {
      return {
        success: true,
        trackNumber: data.track_number,
        slipLink: data.slip_link
      };
    } else {
      throw new Error(data.error || 'Failed to book shipment with Leopards');
    }
  } catch (err) {
    console.error('[Leopards Service] Booking error:', err.message);
    throw err;
  }
}

module.exports = {
  getLeopardsCities,
  bookLeopardsPacket
};
