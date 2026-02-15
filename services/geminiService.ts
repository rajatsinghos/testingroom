
import { GoogleGenAI, Type } from "@google/genai";
import { DashboardData } from "../types";

export const getQAInsights = async (data: DashboardData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    As a Senior QA Engineering Lead, analyze the following software metrics and provide actionable insights.
    
    Data Summary:
    - Pass Rate: ${data.summary.passRate}%
    - Code Coverage: ${data.summary.codeCoverage}%
    - Open Bugs: ${data.summary.openBugs}
    - Avg Latency: ${data.summary.avgLatency}ms
    
    Test Suites:
    ${data.testSuites.map(ts => `- ${ts.name}: ${ts.passed} passed, ${ts.failed} failed`).join('\n')}
    
    Identify potential risks, trends in bug resolution, and specific areas where performance or quality could be improved.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
              recommendation: { type: Type.STRING }
            },
            required: ['title', 'description', 'severity', 'recommendation']
          }
        }
      }
    });

    const insights = JSON.parse(response.text || '[]');
    return insights;
  } catch (error) {
    console.error("Error generating insights:", error);
    return [];
  }
};
