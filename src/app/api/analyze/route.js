import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { image, customRules } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
    }

    // 将 base64 转换为 Gemini 可用的格式
    const base64Data = image.split(",")[1];
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `你是一位专业的私人穿搭顾问。
请根据用户提供的照片，识别图片中的衣物或整套搭配，并返回以下 JSON 格式的数据：
{
  "category": "主要分类名称",
  "description": "详细的衣物描述，包括颜色、版型、纹理和风格亮点",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"],
  "suggestion": "适合的穿着场合建议"
}

请确保描述具体、详尽且优雅。
用户自定义的生成规则如下（如果有，请务必遵守）：
${customRules || "无特定附加规则"}
`;

    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg", // 默认为 jpeg，捕获端会处理
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // 提取 JSON (有时 AI 会返回带着 ```json 的内容)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response" };

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
