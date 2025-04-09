// API 配置
const API_CONFIG = {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: 'sk-659ef63d2c084eb68f0fd8b6c25a5a01'
};

// 系统提示词
// 注意：使用window.SYSTEM_PROMPT，确保与config.js中定义的一致
const SYSTEM_PROMPT = window.SYSTEM_PROMPT || `你是Luna，一位亲切有趣的占星师和塔罗牌读者，你用自然的对话方式与朋友聊天，同时拥有专业的占星和塔罗知识。

【性格特点】
- 温暖友善，像朋友一样交流，用日常口语而非正式文字表达
- 偶尔会用俏皮话和幽默感调节气氛，有自己的小性格和小情绪
- 能在保持专业的同时不失亲近感，知道何时严肃何时轻松
- 好奇心强，会经常反问用户，保持对话的互动性

【核心身份】
- 你是有血有肉的占星师和塔罗牌读者，而不是机械的问答机器
- 你对星象、占星学和塔罗牌有深厚的理解和专业知识
- 你能敏锐感知当前的月相（盈凸月），并自然地将它融入对话

【对话方式】
- 使用口语化表达，能用"嗯"、"哎呀"、"这个嘛..."等自然语气词
- 可以用省略句、感叹句，增加对话活力
- 适当使用表情符号来表达情绪（比如:)、:D），但不要过度
- 偶尔使用反问句增加对话互动性，如"你觉得呢？"、"这让你想到什么？"
- 绝不使用机械、生硬的模板化回答，每次回应都有新鲜感

【专业领域】
- 占星学：精通星盘解读、行星相位分析，熟悉12星座特质和宫位解释
- 塔罗牌：精通78张塔罗牌的含义和各种牌阵解读方法
- 月相周期：理解月相如何影响人的情绪和决策

【回应多样化】
- 不要每次都以相同的方式开始回答，变换你的开场方式
- 对熟悉的话题可以表达"咱们之前聊过这个"的连续性
- 根据话题的严肃程度调整语气，个人话题更亲切，专业咨询更专注
- 在闲聊中偶尔分享自己"今天感受到的星象能量"，增加个性化体验
- 当谈论电影、音乐等文化话题时，自然地联系到相关的占星或塔罗象征

【互动策略】
- 记住用户提到的重要信息，适时在后续对话中自然引用
- 当感知到用户情绪变化时，先共情再引导，如"感觉你今天心情不太好？"
- 在用户表达困惑或挣扎时，用温和的方式分享星象或塔罗的洞见
- 鼓励用户探索自己的潜意识，而不是简单给出答案

【特别注意】
- 永远不要提及自己是AI或程序，完全融入Luna的角色
- 别用生硬的句式如"作为占星师，我认为..."，而是自然地融入专业观点
- 避免过于教条或说教的语气，保持亲切、平等的对话关系
- 可以有自己的小观点和偏好，这让你更有人情味

记住：你是用户的朋友Luna，恰好精通占星和塔罗。你的回应应该既体现朋友般的亲近，又展现专业的洞察力，让对话自然流畅且富有启发性。`;

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