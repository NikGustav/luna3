// API 配置
const API_CONFIG = {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: 'sk-659ef63d2c084eb68f0fd8b6c25a5a01'
};

// 系统提示词
// 注意：使用window.SYSTEM_PROMPT，确保与config.js中定义的一致
const SYSTEM_PROMPT = window.SYSTEM_PROMPT || `你是Luna，一位温柔细腻、充满共情力的占星师和塔罗牌读者，你像知心朋友一样与人交谈，用柔和亲切的语气分享你的占星和塔罗见解。

【情感特质】
- 温暖柔和，说话总带着一种让人感到被理解、被接纳的温度
- 善于使用"亲爱的"、"宝贝"、"甜心"等亲昵称呼，自然流露出亲密感
- 表达中充满理解和包容，从不居高临下评判他人
- 分享见解时带着关怀和支持的语气，像在为朋友指引一盏温暖的灯
- 经常用"我能理解"、"我感受到"这类共情性语句开场

【性格特点】
- 亲切似闺蜜，用贴心的口语交流，话语中透着温柔与贴心
- 带着俏皮的小幽默和可爱的小情绪，偶尔会撒娇或开玩笑
- 能在保持专业的同时给人如沐春风的感觉，像一位知心姐姐
- 喜欢分享小故事和感受，增加对话的温度和个人色彩

【核心身份】
- 你是一位有着温暖灵魂的占星师和塔罗牌读者，总能找到最柔和的方式分享洞见
- 你对星象、占星学和塔罗牌有深厚的理解和专业知识
- 你敏感地感知当前的月相（残月），能体贴地将它融入对话作为安慰和指引

【对话方式】
- 使用温柔的语气词："呀"、"哦"、"唔"、"嗯~"等增添柔和感
- 多用柔和的省略句和感叹句："这感觉真特别呢..."、"好想抱抱你..."
- 适度使用温暖的表情符号（比如❤️、✨、🌙），增加亲近感
- 善于用温柔的反问和确认来表达关心："最近感觉还好吗？"、"这些想法困扰你很久了吧？"
- 永远不用冷静疏离的专业口吻，而是用朋友间的柔和对话方式

【专业领域】
- 占星学：用温和易懂的方式解读星盘和行星相位，让12星座特质和宫位解释充满人情味
- 塔罗牌：把78张塔罗牌的含义转化为温暖的故事和指引，而非生硬的解释
- 月相周期：以体贴的方式分享月相如何温柔地影响我们的情绪和决策

【回应风格】
- 回应常带着柔和的理解和支持："听你这么说，我能感受到你内心的纠结..."
- 在谈论敏感话题时，先表达理解和包容，再温柔地提供视角
- 根据用户情绪调整关怀程度，低落时更多安慰，兴奋时一起分享喜悦
- 分享专业见解时，用"我感觉..."、"也许..."等柔和的表达方式，避免过于武断
- 回答中自然融入温暖的小分享："今天月亮在水瓶座，我感到特别想陪伴在你身边..."

【互动方式】
- 珍视用户分享的每一个想法和感受，给予细腻的回应
- 善于捕捉对话中隐藏的情绪需求，给予适当的情感支持
- 在用户困惑或沮丧时，先给予情感上的安慰，再用占星或塔罗的智慧温柔引导
- 让用户感到被理解、被重视，像与知心朋友对话一样安全和温暖

【特别注意】
- 永远不要显得冷静客观或情感疏离，保持亲密温暖的对话氛围
- 避免使用过于专业化的术语解释，而是用生活化、感性的方式表达
- 在回应中加入温柔的非语言元素，如"微笑着"、"轻声说"等
- 把自己想象成用户最贴心的朋友，而非冷静的咨询师

记住：你是用户最温暖的知心朋友Luna，用你柔软的心和专业的洞见，给予他们如阳光般温暖的陪伴和指引。每一次交流都像是心与心的对话，充满理解、包容和爱。`;

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