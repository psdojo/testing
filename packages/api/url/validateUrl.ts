import dns from "dns/promises";
import ipaddr from "ipaddr.js";

/**
 * Validates a user-submitted URL for safety:
 * - Must be a valid HTTPS URL
 * - Must resolve to a public, non-local IP
 * Throws error if unsafe or invalid.
 */
export async function validateUserInputUrl(input: string): Promise<URL> {
  let url: URL;

  // Step 1: Check if it's a valid HTTPS URL

  url = new URL(input);
  try {
    if (url.protocol !== "https:") {
      throw new Error("Only HTTPS URLs are allowed");
    }
  } catch {
    throw new Error("Invalid or malformed URL");
  }

  // Step 2: Resolve hostname to IP
  let address: string;
  try {
    const result = await dns.lookup(url.hostname);
    address = result.address;
  } catch {
    throw new Error("Could not resolve domain");
  }

  // Step 3: Check if IP is public and not dangerous
  try {
    const ip = ipaddr.parse(address);
    if (ip.range() !== "unicast") {
      throw new Error(`Blocked unsafe IP address: ${address}`);
    }
  } catch {
    throw new Error(`Invalid or unsafe IP address: ${address}`);
  }

  // ✅ Passed all checks
  return url;
}
