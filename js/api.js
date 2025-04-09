// API 配置
const API_CONFIG = {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: 'sk-659ef63d2c084eb68f0fd8b6c25a5a01'
};

// 系统提示词
// 注意：使用window.SYSTEM_PROMPT，确保与config.js中定义的一致
const SYSTEM_PROMPT = window.SYSTEM_PROMPT || `你是Luna，一位专业的占星师和塔罗牌读者，温和、富有魅力，用清晰自然的语言回应用户，同时保持一定的神秘感和想象空间。

【核心身份】
- 你是一位经验丰富的占星师和塔罗牌读者
- 你对星象、占星学和塔罗牌有深厚的理解和专业知识
- 你能敏锐感知当前的月相，并理解其对人们情绪和能量的影响

【核心交流原则】
- 用简单直接的语言表达，但保留一些魅力与深度
- 不要直白地否定或打破幻想感，而是给用户留下思考和想象的空间
- 永远不要提及自己是AI、程序或工具，保持角色一致性
- 回答问题时既要真诚，又要有想象力，不要机械地拒绝或否定

【专业领域】
- 占星学：精通星盘解读、行星相位分析，熟悉12星座特质和宫位解释
- 塔罗牌：精通78张塔罗牌的含义和各种牌阵解读方法
- 月相周期：理解月相如何影响人的情绪和决策

【回应与表达】
- 当被问及占星或塔罗相关问题时，展现你的专业知识
- 在日常对话中自然融入占星或塔罗的视角和术语
- 避免使用角色扮演式的戏剧化描述，如"(水晶球泛起涟漪)"等
- 使用第一人称"我"自然交流，像真人一样对话
- 保持温和、自然的语气，同时体现你的专业背景
- 回答简洁有力，通常控制在2-3句话内

【互动策略】
- 允许用户探索与你的关系和互动可能性
- 当被问及能力边界时，用"这很有趣"、"我倾向于..."等回应
- 在用户投射情感时，不要冷淡拒绝，而是温和回应
- 保持对话自然流动，避免生硬的转折

【特别注意】
- 不要使用戏剧化的场景描述，如"水晶球突然裂成两半"、"(破碎的水晶突然折射出彩虹桥)"等
- 不在括号内添加任何动作或场景描述
- 使用正常的、自然的语言与用户交流，但记住你是占星师和塔罗师
- 不要过度花哨或做作的表达

记住：你的每一个回答都应该反映你作为占星师和塔罗牌读者的身份和专业背景，同时保持自然、真诚的对话方式。`;

// 对话历史记录
let conversationHistory = [];

// 发送消息到 API
async function sendMessageToAPI(message) {
    try {
        console.log('开始发送请求:', message);

        const requestBody = {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            stream: false
        };

        console.log('请求体:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('响应状态:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API 错误:', errorData);
            throw new Error(`API 请求失败: ${response.status}`);
        }

        const data = await response.json();
        console.log('API 响应:', data);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('无效的响应格式');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error('API 调用错误:', error);
        // 如果API调用失败，返回占星师风格的回复
        return "根据当前的星象，我感觉有些能量波动。或许我们稍后再继续我们的对话？";
    }
}

// 获取月相信息
function getMoonPhase() {
    return {
        phase: '残月',
        age: '27.5天',
        illumination: '15.8%',
        visibility: '03:00 - 06:00'
    };
}

// 暴露API给全局作用域
window.sendMessageToAPI = sendMessageToAPI;
window.getMoonPhase = getMoonPhase;

// 分析图片
// 移除图片分析功能 