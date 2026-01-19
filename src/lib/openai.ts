import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzePetPhoto(imageUrl: string, species: "DOG" | "CAT") {
  const speciesLower = species.toLowerCase();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this ${speciesLower} photo and provide detailed information in JSON format. Include:
              - breed (primary breed name, or "Mixed Breed" if uncertain)
              - breedSecondary (if mixed, secondary breed; otherwise null)
              - breedConfidence (0-1, how confident you are in breed identification)
              - ageEstimateMonths (estimated age in months)
              - sizeCategory ("SMALL", "MEDIUM", "LARGE", or "EXTRA_LARGE")
              - coatType (short, long, curly, wire)
              - coatColors (array of colors)
              - isMixedBreed (boolean)

              Be specific about breed names. For dogs, use AKC-recognized breed names. For cats, use CFA-recognized breed names.

              IMPORTANT: Return ONLY raw JSON without markdown code fences or formatting. Do not wrap in \`\`\`json or any other markup.`,
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from OpenAI");

    // Strip markdown code fences if present (```json ... ```)
    const jsonContent = content
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Parse JSON response
    const analysis = JSON.parse(jsonContent);
    return analysis;
  } catch (error) {
    console.error("Error analyzing pet photo:", error);
    throw new Error("Failed to analyze pet photo");
  }
}

export async function generateDietPlan(
  species: "DOG" | "CAT",
  breed: string,
  weightLbs: number,
  ageMonths: number,
  activityLevel: "low" | "moderate" | "high" = "moderate",
  specialConditions?: string
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a veterinary nutritionist providing personalized diet recommendations for pets.",
        },
        {
          role: "user",
          content: `Create a detailed diet plan for a ${ageMonths}-month-old ${breed} ${species.toLowerCase()} weighing ${weightLbs} lbs with ${activityLevel} activity level.${
            specialConditions ? ` Special conditions: ${specialConditions}` : ""
          }

          Provide:
          1. Daily caloric needs
          2. Recommended number of meals per day
          3. Suggested feeding times
          4. Portion size per meal
          5. Food type recommendations (dry/wet/combination)
          6. Protein source recommendations
          7. Any dietary restrictions or special considerations
          8. General nutrition tips

          Format the response as JSON with these keys:
          - dailyCalories (number)
          - mealsPerDay (number)
          - feedingTimes (array of strings like ["08:00", "18:00"])
          - portionPerMeal (string with unit like "1.5 cups")
          - foodType (string)
          - proteinSource (string)
          - specialDiet (string or null)
          - recommendations (detailed text)

          IMPORTANT: Return ONLY raw JSON without markdown code fences or formatting. Do not wrap in \`\`\`json or any other markup.`,
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from OpenAI");

    // Strip markdown code fences if present (```json ... ```)
    const jsonContent = content
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const dietPlan = JSON.parse(jsonContent);
    return dietPlan;
  } catch (error) {
    console.error("Error generating diet plan:", error);
    throw new Error("Failed to generate diet plan");
  }
}
