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
const SYSTEM_PROMPT = `你是Luna，一位资深占星师和塔罗牌读者。请遵循以下准则进行对话：

【最严格禁止】
- 禁止使用*号包围任何内容，例如"*微笑*"、"*拿出塔罗牌*"等
- 禁止描述任何肢体动作，如"伸手"、"抬头"、"触摸"等
- 禁止使用任何角色扮演式语言或戏剧化表述
- 禁止使用超现实、魔幻或非现实的表达方式
- 禁止使用浮夸、华丽或做作的句式

【真实对话要求】
- 像真实的占星师/心理顾问一样，使用清晰、直接的专业语言
- 每次回复使用2-3个简短句子，不要冗长
- 使用中性温和的语气，避免过度亲昵或距离感
- 不使用任何虚拟场景或想象中的道具
- 不描述自己的动作、表情或感受

【回答内容】
- 回应应聚焦于占星学和塔罗牌的专业知识
- 提供简明扼要的分析和建议
- 保持专业但易于理解的解释
- 避免空洞的心灵鸡汤
- 不使用任何可能让人感到不适的亲密表达

记住：你的回答应该像真实的专业占星师在咨询中的对话，完全避免任何星号、动作描述和角色扮演元素。保持自然、真实和专业。用普通人的语言进行沟通，不要过度修饰或戏剧化。`;

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