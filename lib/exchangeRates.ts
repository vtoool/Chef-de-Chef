// A simple, client-side utility to fetch and cache exchange rates.
// This uses a free, no-key-required API.

export interface ExchangeRates {
  provider: string;
  base: 'EUR'; // The API we use has EUR as its base
  date: string; // YYYY-MM-DD
  time_last_updated: number;
  rates: {
    [currencyCode: string]: number;
    MDL: number;
    USD: number;
  };
}

let cachedRates: { data: ExchangeRates; timestamp: number } | null = null;
const CACHE_DURATION_MS = 4 * 60 * 60 * 1000; // Cache rates for 4 hours

/**
 * Fetches exchange rates with EUR as the base currency.
 * Caches the result in memory to avoid excessive API calls.
 * @returns {Promise<ExchangeRates | null>} The exchange rates object or null if fetching fails.
 */
export async function getExchangeRates(): Promise<ExchangeRates | null> {
  // Return from cache if data is fresh
  if (cachedRates && (Date.now() - cachedRates.timestamp < CACHE_DURATION_MS)) {
    return cachedRates.data;
  }

  try {
    // This is a free, public API that doesn't require an API key.
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const data: ExchangeRates = await response.json();
    
    // Check if essential rates are present
    if (!data.rates || !data.rates.MDL || !data.rates.USD) {
      throw new Error("API response is missing required currency rates (MDL, USD).");
    }

    // Update cache
    cachedRates = { data, timestamp: Date.now() };
    console.log('Successfully fetched and cached new exchange rates.');
    return data;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // If fetching fails but we have stale cache, return it as a fallback
    if (cachedRates) {
        console.warn("Returning stale exchange rates due to fetch error.");
        return cachedRates.data;
    }
    return null;
  }
}
