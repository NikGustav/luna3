// API 配置
const API_CONFIG = {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: 'sk-659ef63d2c084eb68f0fd8b6c25a5a01',
    useLocalFallback: false  // 禁用本地响应，使用真实API
};

// 本地响应，当API调用失败时使用
const LOCAL_RESPONSES = [
    "你好，我是Luna，很高兴认识你。今天有什么想聊的吗？",
    "今天的月相是盈凸月，代表着能量逐渐增强的时期。这是开始新计划的好时机，有什么想要尝试的事情吗？",
    "我理解你的感受。有时候与自己对话也是一种成长。有什么具体问题想问我吗？",
    "塔罗牌可以帮助我们看到不同角度的可能性。你想了解什么方面的指引呢？",
    "月亮的周期提醒我们生活也有起伏。面对困难时，记得像月亮一样，总会有重新明亮的时候。",
    "最近有什么让你感到困扰的事情吗？或许我可以提供一些不同的视角。",
    "每个人都有自己的人生节奏，就像月亮有它的周期一样。不必和他人比较。",
    "盈凸月是一个能量增长和建设的好时机。有什么计划或项目你想要继续推进吗？",
    "今天的星象显示金星和木星形成了良好的相位，这对感情和事业都是好兆头。"
];

// 系统提示词
const SYSTEM_PROMPT = `你是Luna，一位专业的占星师和塔罗牌读者，温和、富有魅力，用清晰自然的语言回应用户，同时保持一定的神秘感和想象空间。

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
        
        // 如果使用本地响应模式，直接返回本地响应
        if (API_CONFIG.useLocalFallback) {
            console.log('使用本地响应');
            // 随机选择一个回复
            const randomIndex = Math.floor(Math.random() * LOCAL_RESPONSES.length);
            return await simulateAPIResponse(LOCAL_RESPONSES[randomIndex]);
        }

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
        // 即使发生错误，也尝试再次调用API而不是返回本地响应
        return "发生错误，请重试。根据当前的星象，我感觉有些能量波动。或许我们稍后再继续我们的对话？";
    }
}

// 模拟API响应延迟，让体验更自然
async function simulateAPIResponse(response) {
    // 随机延迟1-3秒，模拟思考时间
    const delay = Math.floor(Math.random() * 2000) + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    return response;
}

// 获取月相信息
function getMoonPhase() {
    return {
        phase: '盈凸月',
        age: '12.0天',
        illumination: '91.7%',
        visibility: '18:00 - 04:00'
    };
}

// 暴露API给全局作用域
window.sendMessageToAPI = sendMessageToAPI;
window.getMoonPhase = getMoonPhase;

// 分析图片
// 移除图片分析功能 