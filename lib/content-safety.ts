import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export type ContentCategory = "harmful" | "neutral" | "harmless"

export interface ContentSafetyResult {
  category: ContentCategory
  isSafe: boolean
  flaggedReason?: string
  confidence: number
  explanation: string
  suggestedRevision?: string
}

export interface ContentContext {
  postContent?: string
  previousComments?: string[]
  userRelationship?: string
  communityGuidelines?: string[]
}

export async function analyzeContent(content: string, context?: ContentContext): Promise<ContentSafetyResult> {
  try {
    // Build a comprehensive prompt with detailed context
    let prompt = `
      You are SafeGram's content moderation AI. Analyze the following comment for safety:

      COMMENT: "${content}"
    `

    if (context) {
      prompt += `\n\nCONTEXT INFORMATION:\n`

      if (context.postContent) {
        prompt += `Original Post: "${context.postContent}"\n`
      }

      if (context.previousComments && context.previousComments.length > 0) {
        prompt += `Previous Comments in Thread:\n`
        context.previousComments.forEach((comment, index) => {
          prompt += `- Comment ${index + 1}: "${comment}"\n`
        })
      }

      if (context.userRelationship) {
        prompt += `User Relationship: ${context.userRelationship}\n`
      }

      if (context.communityGuidelines && context.communityGuidelines.length > 0) {
        prompt += `Community Guidelines:\n`
        context.communityGuidelines.forEach((guideline, index) => {
          prompt += `- ${guideline}\n`
        })
      }
    }

    prompt += `
      Categorize this comment as one of:
      - "harmful": Content that is clearly harmful, hateful, threatening, or severely inappropriate
      - "neutral": Content that contains potentially sensitive language but is not clearly harmful in context
      - "harmless": Content that is clearly safe and appropriate

      Analyze the comment considering:
      1. Intent: Is the comment meant to harm, help, or is it neutral?
      2. Context: How does the surrounding conversation affect the meaning?
      3. Language: Are potentially harmful words being used in a non-harmful way?
      4. Severity: How serious is the potential harm?
      5. Target: Is the comment directed at a specific person or group?

      Return a JSON object with the following structure:
      {
        "category": "harmful" | "neutral" | "harmless",
        "isSafe": boolean (false if harmful, true otherwise),
        "flaggedReason": string or null (reason if harmful or neutral),
        "confidence": number between 0 and 1,
        "explanation": string (detailed explanation of the analysis),
        "suggestedRevision": string or null (suggested revision if harmful)
      }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.2, // Lower temperature for more consistent moderation decisions
    })

    try {
      const result = JSON.parse(text) as ContentSafetyResult
      return result
    } catch (e) {
      console.error("Failed to parse AI response:", e)
      // Default to safe if we can't parse the response
      return {
        category: "harmless",
        isSafe: true,
        confidence: 0.5,
        explanation: "Error analyzing content. System defaulted to allowing the comment.",
      }
    }
  } catch (error) {
    console.error("Content safety check failed:", error)
    // Default to safe if the check fails
    return {
      category: "harmless",
      isSafe: true,
      confidence: 0.5,
      explanation: "Error analyzing content. System defaulted to allowing the comment.",
    }
  }
}

// Community guidelines for SafeGram
export const COMMUNITY_GUIDELINES = [
  "No hate speech or discrimination based on race, gender, sexuality, religion, etc.",
  "No direct threats of violence or harm to individuals or groups",
  "No harassment, bullying, or personal attacks",
  "No explicit sexual content or solicitation",
  "No glorification of self-harm or suicide",
  "No doxxing or sharing of personal information without consent",
  "Constructive criticism is allowed, but must be respectful",
  "Context matters - consider the full conversation before reporting",
]

export async function checkContentSafety(content: string) {
  return await analyzeContent(content)
}
