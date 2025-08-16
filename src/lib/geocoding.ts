export async function reverseGeocodeToAddress(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      latitude
    )}&lon=${encodeURIComponent(longitude)}`;

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const data = await response.json();

    if (data?.display_name && typeof data.display_name === 'string') {
      return data.display_name as string;
    }

    const addr = data?.address;
    if (addr && typeof addr === 'object') {
      const parts: string[] = [
        addr.house_number,
        addr.road,
        addr.suburb,
        addr.city || addr.town || addr.village,
        addr.state,
        addr.postcode,
        addr.country,
      ].filter(Boolean);
      const formatted = parts.join(', ');
      if (formatted) return formatted;
    }

    return null;
  } catch {
    return null;
  }
}



