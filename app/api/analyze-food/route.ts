import type { FoodAnalysis } from '@/types';

/** Extract the formatted JSON from the model's text answer. */
function parseAiContent(
  content: string,
): FoodAnalysis & { message: string | null; food_detected: boolean } {
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('AI did not return valid JSON');
  }
  return JSON.parse(match[0]) as FoodAnalysis & { message: string | null; food_detected: boolean };
}

export async function POST(req: Request) {
  const { image, hint } = await req.json();
  const userHint = typeof hint === 'string' ? hint.trim() : '';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-v4.1-flash',

      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `
Analyze the food in this image.

Return ONLY valid JSON. Do not include markdown, explanations, or any text outside the JSON.

${
  userHint
    ? `The user describes this dish as: "${userHint}". Use this description as a strong hint when identifying the food and estimating its nutritional values.`
    : ''
}

If the image contains recognizable food, return:

{
"food_detected": true,
"name": "Назва страви",
"weight_g": number,
"calories_per_100g": number,
"protein_per_100g": number,
"fat_per_100g": number,
"carbs_per_100g": number,
"message": null
}

Estimate the weight of the visible food in grams.

If the exact weight cannot be determined from the image, make a reasonable estimate based on the visible portion size.

Estimate the nutritional values per 100g for the identified food.

If the image does NOT contain recognizable food, or you cannot confidently identify the food, return ONLY:

{
"food_detected": false,
"name": null,
"weight_g": null,
"calories_per_100g": null,
"protein_per_100g": null,
"fat_per_100g": null,
"carbs_per_100g": null,
"message": "Я не знаю, що за страва на фото"
}

Do not invent a food or nutritional values when the image does not contain recognizable food.

`,
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  const content: string = data?.choices?.[0]?.message?.content ?? '';

  try {
    const ai = parseAiContent(content);

    // Return the raw per-100g values plus the estimated weight.
    // The client scales them to the actual portion and keeps them in sync
    // when the user edits the grams.
    return Response.json({
      food_detected: ai.food_detected,
      name: ai.name,
      weight_g: ai.weight_g,
      calories_per_100g: ai.calories_per_100g,
      protein_per_100g: ai.protein_per_100g,
      fat_per_100g: ai.fat_per_100g,
      carbs_per_100g: ai.carbs_per_100g,
      message: ai.message,
    });
  } catch {
    return Response.json({ error: 'Не вдалося проаналізувати фото.' }, { status: 502 });
  }
}
