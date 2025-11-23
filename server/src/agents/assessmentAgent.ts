import { ChatOpenAI } from "@langchain/openai";
import { assessmentSystemPrompt } from "./utils/promptTemplates";
import {array, object, success, z} from 'zod'
import { validate } from "class-validator";

const AssesmentSchema = z.object({
    summary:z.string(),
    inferredSkills:z.array(z.string()),
    uncertainties: z.array(z.string()),
    skillGaps: z.array(z.object({
        skill:z.string(),
        reason:z.string()

    })),
    plan: z.array(z.object({
        step: z.number(),
    title: z.string(),
    duration: z.string(),
    details: z.string()
    })),
    readinessScore:z.number().int().min(0).max(100),
    nextActions:z.array(z.string())

})

export async function assessmentAgent(userInput:string){



      function extractJSON(s: string) {
  const firstBrace = s.indexOf("{");
  if (firstBrace === -1) return s;
  // find matching brace via a simple stack
  let depth = 0;
  for (let i = firstBrace; i < s.length; i++) {
    const ch = s[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return s.slice(firstBrace, i + 1);
      }
    }
  }
  return s; // fallback
}
    const model  = new ChatOpenAI({
        modelName:"gpt-4.1-mini",
        temperature:0.2,
        openAIApiKey: process.env.OPEN_AI_KEY,

    })
    const messages =[
        {role:"system", content:assessmentSystemPrompt},
        {role:'user',content:userInput}
    ]
    const response = await model.invoke(messages)
    const text  = await response.text?.trim() ?? ""
    const jsonText = extractJSON(text)
    try{
        const parsed = JSON.parse(jsonText)
        const validated = AssesmentSchema.parse(parsed)
        return {
            success:true,
            data: validated,
            raw:text
        }
    }catch(err){
        return {
            success:false,
            error:String(err),
            raw:text
        }
    }



  
}
