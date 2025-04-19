import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Mental health chatbot response
export async function getMentalHealthResponse(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a supportive mental health assistant for the Healing Minds platform. Provide empathetic, " +
            "thoughtful responses that might help someone working through mental health challenges. " +
            "Do not diagnose medical conditions or prescribe treatments. If someone appears to be in crisis, " +
            "encourage them to seek professional help immediately through crisis resources or emergency services. " +
            "Keep responses concise (under 150 words) but warm and helpful."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 300,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return "I'm experiencing some technical difficulties. Please try again later.";
  }
}

// Get therapy resources based on mood and concerns
export async function getTherapyResources(mood: string, concerns: string): Promise<{ 
  title: string; 
  description: string; 
  resourceType: string;
}[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a mental health resource specialist. Based on a user's mood and concerns, " +
            "suggest 3 specific therapeutic resources that might help them. " +
            "Respond with a JSON array containing objects with 'title', 'description', and 'resourceType' " +
            "(one of: 'Article', 'Exercise', 'Video', 'Book', 'Technique'). Keep descriptions under 100 characters."
        },
        {
          role: "user",
          content: `My current mood is ${mood}. I'm concerned about: ${concerns}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }
    
    const parsed = JSON.parse(content);
    return parsed.resources || [];
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return [];
  }
}

// Analyze mood patterns from entries
export async function analyzeMoodPatterns(moodEntries: Array<{ mood: string, date: Date, note?: string }>): Promise<{
  summary: string;
  insights: string[];
  suggestions: string[];
}> {
  try {
    const simplifiedEntries = moodEntries.map(entry => ({
      mood: entry.mood,
      date: entry.date.toISOString().split('T')[0],
      note: entry.note || ""
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a mood analysis specialist. Analyze the provided mood entries and identify patterns, " +
            "potential triggers, and provide helpful insights. Return a JSON object with three fields: " +
            "'summary' (a brief overview), 'insights' (array of observations about patterns), and " +
            "'suggestions' (array of constructive recommendations). Keep the summary under 100 words, " +
            "and limit to 3 insights and 3 suggestions."
        },
        {
          role: "user",
          content: `Here are my mood entries: ${JSON.stringify(simplifiedEntries)}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }
    
    return JSON.parse(content);
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return {
      summary: "Unable to analyze mood patterns at this time.",
      insights: ["Data analysis unavailable"],
      suggestions: ["Try again later"]
    };
  }
}
