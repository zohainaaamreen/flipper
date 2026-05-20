import type { ScanRecord } from './history';

const MODEL = 'claude-haiku-4-5-20251001';

async function callClaude(prompt: string, maxTokens = 600): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing EXPO_PUBLIC_ANTHROPIC_API_KEY');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  return (json.content[0].text as string).trim();
}

export async function generateListing(
  scan: ScanRecord,
  platform: 'eBay' | 'Poshmark' | 'Both'
): Promise<string> {
  const platformText =
    platform === 'Both'
      ? 'eBay AND Poshmark (write separate labeled sections for each)'
      : platform;

  const prompt = `You are a professional resale listing writer.

Item details:
- Brand: ${scan.brand}
- Item: ${scan.item}
- Material: ${scan.material ?? 'Unknown'}
- Condition: ${scan.condition ?? 'Good'}
- Style: ${scan.styleCore ?? 'Classic'}
- Suggested resale price: ${scan.suggestedPrice}

Write a compelling ${platformText} listing.

For eBay: Start with a title (max 80 characters, keyword-rich), then a detailed description with key selling points, material, condition, and a note about measurements if relevant.
For Poshmark: Write a conversational, engaging description. Mention style, condition, and why a buyer should want it. Be warm and appealing.

Return plain text only. No markdown, no bullet symbols, no asterisks.`;

  return callClaude(prompt, 700);
}

export async function generateCaption(
  scan: ScanRecord,
  platform: 'Instagram' | 'TikTok',
  tone: 'Aesthetic' | 'Hype' | 'Casual'
): Promise<string> {
  const hashtagCount = platform === 'Instagram' ? '15–20' : '5–8';

  const prompt = `You are a social media content creator for a thrift resale account.

Item: ${scan.brand} — ${scan.item}
Condition: ${scan.condition ?? 'Good'}
Style: ${scan.styleCore ?? 'Vintage'}
Resale value: ${scan.suggestedPrice}

Write a ${platform} caption with a ${tone.toLowerCase()} tone for this thrift find.
Include ${hashtagCount} relevant hashtags at the end.

Return just the caption and hashtags. No labels, no extra commentary.`;

  return callClaude(prompt, 400);
}

export async function generatePricingAdvice(scan: ScanRecord): Promise<string> {
  const prices = scan.platformPrices;
  const pricesText = prices
    ? `eBay: ${prices.eBay} | Poshmark: ${prices.Poshmark} | Depop: ${prices.Depop} | Mercari: ${prices.Mercari}`
    : `Estimated: ${scan.suggestedPrice}`;

  const prompt = `You are a thrift resale pricing expert.

Item: ${scan.brand} — ${scan.item}
Material: ${scan.material ?? 'Unknown'}
Condition: ${scan.condition ?? 'Good'}
Style: ${scan.styleCore ?? 'Classic'}
Platform price estimates: ${pricesText}

Give pricing advice in exactly 3 short numbered points:
1. Best platform to sell on and why (one sentence)
2. Exact recommended listing price (a specific number, not a range)
3. One tip to maximize the sale price (photography, timing, bundling, etc.)

Plain text, numbered list only. No extra text.`;

  return callClaude(prompt, 350);
}
