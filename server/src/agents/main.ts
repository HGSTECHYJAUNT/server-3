import { completeRecommendationSystem } from "./completeOrchestrator";
import { BadRequestException } from '@nestjs/common';

// Example usage
async function main() {
  const userInput = `
    I'm a complete beginner interested in web development. 
    I have no programming experience but I'm willing to dedicate 
    15 hours per week for the next 6 months. I prefer video courses 
    and my budget is around $200.
  `;

  const result = await completeRecommendationSystem(userInput, {
        constraints:[
            "theres no light at home",
            'i dont have a pc'
        ],
        interests:[
            "i love software engineering "
        ]
  });



  console.log("\n📊 ASSESSMENT SUMMARY");
  console.log("====================");
  console.log(`Level: ${result.summary?.currentLevel}`);
  console.log(`Readiness Score: ${result.summary?.readinessScore}/100`);
  console.log(`Strengths: ${result.summary?.keyStrengths.join(', ')}`);
  console.log(`Critical Gaps: ${result.summary?.criticalGaps.join(', ')}`);

  console.log("\n🎯 RECOMMENDED FIELD");
  console.log("===================");
  const topField = result.fieldRecommendations?.recommendations[0];
  console.log(`${topField?.field?.name} (${topField?.matchScore}% match)`);
  console.log(`Reasoning: ${topField?.reasoning}`);

  console.log("\n📚 LEARNING PATH");
  console.log("===============");
}
//   result.courseRecommendations?.learningPath?.forEach((phase: any) => {
// //     console.log(`\n📖 ${phase.phaseTitle} (${phase.duration})`);
// //     phase.courses.forEach((course: any) => {
// //       const details = course.courseDetails;
// //       console.log(`\n  ${course.order}. ${details?.title}`);
// //       console.log(`     Provider: ${details?.provider}`);
// //       console.log(`     Priority: ${course.priority}`);
// //       console.log(`     Cost: ${details?.price.isFree ? 'FREE' : `$${details?.price.amount}`}`);
// //       console.log(`     Fills gaps: ${course.fillsGap.join(', ')}`);
// //       console.log(`     Why: ${course.reasoning}`);
// //     });
// //   });

//   console.log("\n💰 BUDGET BREAKDOWN");
//   console.log("==================");
//   console.log(`Total Cost: $${result.courseRecommendations.budgetConsiderations.totalCost}`);
//   console.log(`Your Budget: $${200}`);
  
//   if (result.courseRecommendations.budgetConsiderations.freeAlternatives.length > 0) {
//     console.log(`\n💡 Free alternatives available: ${
//       result.courseRecommendations.budgetConsiderations.freeAlternatives.length
//     } courses`);
//   }

//   console.log("\n⏱️ TIMELINE");
//   console.log("===========");
//   console.log(`Optimistic (20+ hrs/week): ${result.courseRecommendations.timeline.optimistic}`);
//   console.log(`Realistic (10-15 hrs/week): ${result.courseRecommendations.timeline.realistic}`);
//   console.log(`Relaxed (5-10 hrs/week): ${result.courseRecommendations.timeline.relaxed}`);

//   console.log("\n🎯 NEXT STEPS");
//   console.log("=============");
//   result.courseRecommendations.nextSteps.forEach((step: string, i: number) => {
//     console.log(`${i + 1}. ${step}`);
//   });
// }

main();