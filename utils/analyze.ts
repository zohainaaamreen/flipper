export type PlatformPrices = {
  eBay: string;
  Poshmark: string;
  Depop: string;
  Mercari: string;
};

export type AnalysisResult = {
  brand: string;
  item: string;
  recommendation: 'BUY' | 'PASS';
  confidence: number;
  suggestedPrice: string;
  reasoning: string;
  platformPrices: PlatformPrices;
  material: string;
  condition: string;
  styleCore: string;
};

const SYSTEM_PROMPT = `You are an expert thrift store resale analyst. You will receive three photos of a clothing item:
- Image 1: Brand/care tag
- Image 2: Fabric composition label
- Image 3: Full item style shot

Analyze all three together and return a JSON object with these exact fields:
- brand: brand name (string, e.g. "Ralph Lauren". Use "Unknown" if unreadable)
- item: short description with type, color, size if visible (e.g. "Polo Shirt, Navy, Size M")
- recommendation: "BUY" if resale profit likely exceeds $10, otherwise "PASS"
- confidence: integer 0–100
- suggestedPrice: best overall resale price range (e.g. "$28–36")
- reasoning: one concise sentence explaining the recommendation
- platformPrices: { "eBay": "$X–Y", "Poshmark": "$X–Y", "Depop": "$X–Y", "Mercari": "$X–Y" } — eBay fetches highest, Mercari lowest
- material: fabric composition from the label (e.g. "100% Cotton" or "60% Polyester, 40% Cotton"). Use "Not visible" if unreadable
- condition: honest assessment from the style shot (e.g. "Excellent — no visible wear", "Good — slight pilling at cuffs", "Fair — fading on shoulders")
- styleCore: which resale aesthetic this fits, comma-separated if multiple (e.g. "Quiet Luxury", "Gorpcore", "Y2K Revival")

BUY factors: strong brand, natural fibers (cotton/wool/linen command higher prices), clean condition, classic or trending style.
PASS factors: fast fashion, heavy synthetic blend, visible damage, no recognizable brand.

Return ONLY valid JSON. No markdown, no extra text.`;

export async function analyzePhotos(
  photos: { base64: string; description: string }[]
): Promise<AnalysisResult> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing EXPO_PUBLIC_ANTHROPIC_API_KEY in .env');

  const content: object[] = [];
  for (const photo of photos) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: photo.base64 },
    });
    content.push({ type: 'text', text: photo.description });
  }
  content.push({ type: 'text', text: 'Analyze all three images and return the JSON.' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 768,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err}`);
  }

  const json = await response.json();
  const raw: string = json.content[0].text;
  const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(text) as AnalysisResult;
}
