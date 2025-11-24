// agents/completeOrchestrator.ts
import { smartAssessmentPipeline } from './smartAssesmentPipeline';
import { fieldRecommendationAgent } from './fieldRecomendationAgent';
import { recommendationAgent } from './assessmentAgent';
export async function completeRecommendationSystem(
  userInput: string,
  preferences?: {
    constraints?:string[]
    interests?: string[];
  }
) {
  console.log("🔍 Step 1: Assessing user...");
  
  // Step 1: Assessment
  const assessmentResult = await smartAssessmentPipeline(userInput);
  
  if (!assessmentResult.success) {
    return { error: 'Assessment failed', details: assessmentResult };
  }
 

  const assessment = assessmentResult.assessment;
  
  console.log("🎯 Step 2: Recommending fields...");
  
  // Step 2: Field Recommendations
  const fieldResults = await fieldRecommendationAgent(assessment, {
    interests: preferences?.interests
  });
  
  if (!fieldResults.success) {
    return { error: 'Field recommendation failed', details: fieldResults };
  }

  console.log("📚 Step 3: Recommending courses...");
  
  // Step 3: Course Recommendations
  const courseResults = await recommendationAgent(assessment, preferences);
  
  if (!courseResults.success) {
    return { error: 'Course recommendation failed', details: courseResults };
  }

  console.log("✅ Complete recommendation generated!");

  return {
    success: true,
    stage: 'complete',
    assessment: assessment,
    fieldRecommendations: fieldResults.data,
    courseRecommendations: courseResults.data,
    summary: generateSummary(assessment, fieldResults.data, courseResults.data)
  };
}

function generateSummary(assessment: any, fields: any, courses: any) {
  const topField = fields.recommendations[0];
  const totalCourses = courses.learningPath.reduce(
    (sum: number, phase: any) => sum + phase.courses.length, 
    0
  );
  
  return {
    currentLevel: assessment.userProfile.experienceLevel,
    targetField: topField.field?.name,
    readinessScore: assessment.readinessScore.overall,
    recommendedCourses: totalCourses,
    estimatedTimeline: courses.timeline.realistic,
    estimatedCost: courses.budgetConsiderations.totalCost,
    keyStrengths: assessment.strengths.slice(0, 3),
    criticalGaps: assessment.skillGaps
      .filter((g: any) => g.priority === 'critical')
      .map((g: any) => g.skill)
  };
}