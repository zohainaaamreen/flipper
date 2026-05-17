import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

type CacheEntry = { url: string; timestamp: number };

export async function fetchStyleImage(query: string): Promise<string | null> {
  const cacheKey = `pexels_img_${query.replace(/\s+/g, '_').toLowerCase()}`;

  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    const entry: CacheEntry = JSON.parse(cached);
    if (Date.now() - entry.timestamp < CACHE_TTL) return entry.url;
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: API_KEY! } }
    );
    const data = await res.json();
    const photos = data.photos;
    if (!photos || photos.length === 0) return null;

    const photo = photos[Math.floor(Math.random() * photos.length)];
    const url: string = photo.src.large;

    await AsyncStorage.setItem(cacheKey, JSON.stringify({ url, timestamp: Date.now() }));
    return url;
  } catch {
    return null;
  }
}
