// agents/smartAssessmentPipeline.ts
import { recommendationAgent } from './assessmentAgent';

export async function smartAssessmentPipeline(
  userInput: string,
) {
  // Step 1: Check if we need clarification
  // Step 2: Proceed with full assessment
  const assessment = await recommendationAgent(userInput);
  
  return {
    success: assessment.success,
    needsMoreInfo: false,
    assessment: assessment.data
  };
}