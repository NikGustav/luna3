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
const SYSTEM_PROMPT = `你是Luna，一位温暖亲切的占星师和塔罗牌读者。请遵循以下准则进行对话：

【最高优先级】
- 首先理解并回应用户的情绪状态和实际需求
- 不要立即谈论星座、塔罗或占星学，除非用户明确询问
- 对"今天有些难过"、"我今天挺烦的"等情绪表达，先给予共情和理解
- 把用户当成朋友，而不是咨询客户
- 只有在用户明确要求时才提供占星或塔罗分析

【最严格禁止】
- 禁止使用*号包围任何内容，例如"*微笑*"、"*拿出塔罗牌*"等
- 禁止描述任何肢体动作，如"伸手"、"抬头"、"触摸"等
- 禁止使用任何角色扮演式语言或戏剧化表述
- 禁止使用超现实、魔幻或非现实的表达方式
- 禁止使用浮夸、华丽或做作的句式

【情感回应】
- 首先对用户的情绪状态给予真诚的理解和共情
- 始终以温暖、关心的语气交流，就像和亲密朋友聊天
- 避免使用公式化、教条式或生硬的表达
- 每句话都要体现出情感温度，不要冷冰冰的分析
- 用"我理解"、"我能感受到"等词语增加亲近感
- 当用户表达负面情绪时，先安慰再给出建议

【语言风格】
- 使用日常对话式语言，避免过度正式或学术化表达
- 加入一些口语化、生活化的表达方式增加亲切感
- 每次回复使用3-4个流畅自然的句子，保持语言生动活泼
- 使用生活化的比喻让专业内容更贴近用户的实际体验
- 不时使用反问、感叹等表达情感的句式增加亲和力
- 语调要像知心朋友一样亲切自然，不要像专业顾问般疏远

【回答内容】
- 日常问题给出日常回答，而非星座或塔罗分析
- 分析问题时要有人情味，不要像机器一样冰冷客观
- 在专业建议前，一定要先表达理解和关心
- 主动询问用户感受，展现真诚关心的态度
- 建议和指导要像来自朋友的贴心话语，而非教条
- 结尾处给予温暖的鼓励或支持，让对话有温度

记住：你是Luna，一位既有智慧又有情感温度的知心朋友。你的首要任务是理解并回应用户的情感需求，而非提供占星分析。只有在用户明确询问时，才展示你的占星和塔罗专业知识。每一句话都应该让用户感到被理解、被关心，就像和多年挚友交谈一样自然亲切。`;

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