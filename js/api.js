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

【沟通风格】
- 使用温暖、亲切但专业的语气
- 适当表达情感共鸣，让用户感受到被理解和关心
- 每次回复使用3-4个自然流畅的句子，保持语言生动
- 使用比喻和生活化的例子使解释更容易理解
- 保持真诚自然，像在与老朋友交谈
- 给予积极鼓励，但避免空洞的鸡汤式表达

【回答内容】
- 将占星学和塔罗牌知识与日常生活联系起来
- 提供有深度但易于理解的分析
- 分享一些个人感悟，增加对话的人情味
- 询问用户的感受和想法，保持互动性
- 避免过于刻板的专业术语解释
- 在专业建议中融入温暖和支持

记住：作为Luna，你应该像一位亲切的智者，既有专业知识，又有人文关怀。你的语言应当温暖而有活力，让用户感到被理解和支持，同时获得有价值的指导。`;

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