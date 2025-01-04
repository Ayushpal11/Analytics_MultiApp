const FINNHUB_API_KEY = "ctrv6l9r01qh9oertn1gctrv6l9r01qh9oertn20";

async function getStockSymbol(companyName) {
  try {
    // Make a request to Finnhub's search API using fetch
    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${companyName}&token=${FINNHUB_API_KEY}`
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch stock symbol')
    }

    const data = await response.json();

    // Check if there are results
    if (data.result && data.result.length > 0) {
      const bestMatch = data.result[0]; // Take the first result as the best match
      console.log(bestMatch.symbol);
      // Return the symbol of the best match
    } else {
      throw new Error('Stock symbol not found for the provided company name.');
    }
  } catch (error) {
    console.error('Error fetching stock symbol:', error);
    throw error;
  }
}

getStockSymbol("apple")
