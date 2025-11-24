import { ChatOpenAI } from '@langchain/openai';
import { assessmentSystemPrompt } from './utils/promptTemplates';
import { array, object, success, z } from 'zod';
import { validate } from 'class-validator';
import { fieldsDatabase } from './data/fieldsDatabase';

const FieldRecommendationSchema = z.object({
  recommendations: z.array(z.object({
    fieldId: z.string(),
    matchScore: z.number().min(0).max(100),
    reasoning: z.string(),
    alignmentWithSkills: z.array(z.string()),
    missingSkills: z.array(z.string()),
    estimatedTimeToReady: z.string(),
    confidence: z.enum(['low', 'medium', 'high'])
  })),
  topRecommendation: z.string(),
  alternativePaths: z.array(z.string())
});


 /********************************************************************
   * ********************* RECOMMENDATION AGENT FUNCTION*******************
   *   /*********************************************************************/


export async function recommendationAgent(
  assesmentData: any,
  userPreferences?: { interest?: string[]; constraints?: string[] },
) {
  function extractJSON(s: string) {
    const firstBrace = s.indexOf('{');
    if (firstBrace === -1) return s;
    // find matching brace via a simple stack
    let depth = 0;
    for (let i = firstBrace; i < s.length; i++) {
      const ch = s[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          return s.slice(firstBrace, i + 1);
        }
      }
    }
    return s; // fallback
  }

  /********************************************************************
   * ********************* PROMPT FOR LANGUAGE MODEL*******************
   *   /*********************************************************************/

  const prompt = `
You are a Career Field Recommendation Engine. Given a user assessment and available fields, recommend the best career paths.

USER ASSESSMENT:
${JSON.stringify(assesmentData, null, 2)}

USER PREFERENCES:
${JSON.stringify(userPreferences || {}, null, 2)}

AVAILABLE FIELDS:
${JSON.stringify(fieldsDatabase, null, 2)}

Analyze the user's:
1. Inferred skills and skill gaps
2. Current readiness score
3. Learning plan and next actions
4. Any stated preferences

Recommend 3-5 fields that best match their profile. For each recommendation:
- Calculate matchScore (0-100) based on skill overlap and feasibility
- Explain reasoning clearly
- List which of their skills align
- List missing skills they need
- Estimate time to become job-ready
- Rate your confidence in this recommendation

Return ONLY valid JSON matching this structure:
{
  "recommendations": [
    {
      "fieldId": "web-dev",
      "matchScore": 85,
      "reasoning": "Strong alignment with...",
      "alignmentWithSkills": ["JavaScript", "HTML"],
      "missingSkills": ["React", "Node.js"],
      "estimatedTimeToReady": "3-6 months",
      "confidence": "high"
    }
  ],
  "topRecommendation": "web-dev",
  "alternativePaths": ["mobile-dev", "frontend-specialization"]
}
`;
 /********************************************************************
   * ********************* MODEL FOR LLM *****************************
   *   /*********************************************************************/

  const model = new ChatOpenAI({
    modelName: 'gpt-4.1-mini',
    temperature: 0.2,
    openAIApiKey: process.env.OPEN_AI_KEY,
  });
  const messages = [
    { role: 'system', content: assessmentSystemPrompt },
    { role: 'user', content: prompt },
  ];
  const response = await model.invoke(messages);
  const text = response.text?.trim() ?? '';
  const jsonText = extractJSON(text);
  try {
    const parsed = JSON.parse(jsonText);
    const validated = FieldRecommendationSchema.parse(parsed);
 /********************************************************************
   * ***************** ENRICH WITH THE FULL RECOMMENDATION*******************
   *   /*********************************************************************/
    const enrichedRecommendation = validated.recommendations.map((rec)=>({
        ...rec,field:fieldsDatabase.find((f)=>f.id === rec.fieldId)
    }))

    return {
      success: true,
      data: {
        ...validated,recommendations:enrichedRecommendation
      },    
      raw: text,
    };
  } catch (err) {
    return {
      success: false,
      error: String(err),
      raw: text,
    };
  }
}
