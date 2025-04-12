// 月下对话框实现脚本
document.addEventListener('DOMContentLoaded', function() {
    // 确保对话框元素存在
    const conversationOverlay = document.getElementById('conversation-overlay');
    if (!conversationOverlay) {
        console.error('对话框元素不存在');
        return;
    }

    // 基础样式设置
    const style = document.createElement('style');
    style.textContent = `
        /* 对话框样式 */
        #conversation-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }

        #conversation-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .overlay-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -55%);
            width: 100%;
            max-width: 420px;
            height: 85%;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s;
        }

        .overlay-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .overlay-title {
            color: white;
            font-size: 18px;
        }

        .overlay-close {
            color: white;
            font-size: 24px;
            background: none;
            border: none;
            cursor: pointer;
        }

        .overlay-message-box {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 15px;
        }

        .overlay-footer {
            display: flex;
            gap: 10px;
        }

        .overlay-input {
            flex: 1;
            padding: 12px;
            border-radius: 20px;
            border: none;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
        }

        .overlay-send {
            padding: 12px 20px;
            border-radius: 20px;
            border: none;
            background-color: #6c5ce7;
            color: white;
            cursor: pointer;
        }

        /* 消息样式 */
        .message {
            max-width: 80%;
            padding: 12px 15px;
            border-radius: 18px;
            line-height: 1.4;
        }

        .user-message {
            align-self: flex-end;
            background-color: #6c5ce7;
            color: white;
            text-align: left;
            max-width: 80%;
        }

        .ai-message {
            align-self: flex-start;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
        }
    `;
    document.head.appendChild(style);

    // 显示对话框
    window.showOverlay = function() {
        const overlay = document.getElementById('conversation-overlay');
        const navBar = document.querySelector('.nav-bar');
        
        if (overlay && navBar) {
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.classList.add('active');
                navBar.classList.add('hidden');
                
                // 如果有历史对话，展示出来
                displayConversationHistory();
                
                // 聚焦输入框
                setTimeout(() => {
                    const input = document.querySelector('.overlay-input');
                    if (input) input.focus();
                }, 300);
            }, 10);
        }
    };

    // 关闭对话框
    window.closeOverlay = function() {
        const overlay = document.getElementById('conversation-overlay');
        const navBar = document.querySelector('.nav-bar');
        
        if (overlay && navBar) {
            overlay.classList.remove('active');
            navBar.classList.remove('hidden');
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    };

    // 初始化对话历史记录
    if (!window.conversationHistory) {
        window.conversationHistory = [];
        
        // 尝试从本地存储加载对话历史
        const savedHistory = localStorage.getItem('conversationHistory');
        if (savedHistory) {
            try {
                window.conversationHistory = JSON.parse(savedHistory);
            } catch (e) {
                console.error('解析对话历史失败:', e);
                window.conversationHistory = [];
            }
        }
    }

    // 保存对话历史到本地存储
    window.saveConversationHistory = function() {
        try {
            localStorage.setItem('conversationHistory', JSON.stringify(window.conversationHistory));
        } catch (e) {
            console.error('保存对话历史失败:', e);
        }
    };

    // 显示对话历史
    function displayConversationHistory() {
        const messageBox = document.querySelector('.overlay-message-box');
        if (!messageBox || !window.conversationHistory) return;
        
        // 清空消息框
        messageBox.innerHTML = '';
        
        // 显示历史消息
        window.conversationHistory.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`;
            msgDiv.textContent = msg.content;
            messageBox.appendChild(msgDiv);
        });
        
        // 滚动到底部
        messageBox.scrollTop = messageBox.scrollHeight;
    }

    // 处理消息发送
    window.handleMessageSend = function() {
        const input = document.querySelector('.overlay-input');
        const messageBox = document.querySelector('.overlay-message-box');
        
        if (!input || !messageBox) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // 清空输入框
        input.value = '';
        
        // 添加用户消息
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.textContent = message;
        messageBox.appendChild(userMessageDiv);
        
        // 添加到历史记录
        window.conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });
        
        // 滚动到底部
        messageBox.scrollTop = messageBox.scrollHeight;
        
        // 显示AI正在思考
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'message ai-message thinking';
        thinkingDiv.textContent = '思考中...';
        messageBox.appendChild(thinkingDiv);
        messageBox.scrollTop = messageBox.scrollHeight;
        
        // 获取AI回复（模拟延迟）
        setTimeout(() => {
            // 移除思考提示
            messageBox.removeChild(thinkingDiv);
            
            // 根据当前月相生成回复
            const moonPhaseResponse = getMoonPhaseResponse(message);
            
            // 添加AI回复
            const aiMessageDiv = document.createElement('div');
            aiMessageDiv.className = 'message ai-message';
            aiMessageDiv.textContent = moonPhaseResponse;
            messageBox.appendChild(aiMessageDiv);
            
            // 添加到历史记录
            window.conversationHistory.push({
                role: 'assistant',
                content: moonPhaseResponse,
                timestamp: new Date().toISOString()
            });
            
            // 保存对话历史
            window.saveConversationHistory();
            
            // 滚动到底部
            messageBox.scrollTop = messageBox.scrollHeight;
        }, 1500);
    };

    // 根据月相生成回复
    function getMoonPhaseResponse(message) {
        // 获取当前月相
        const currentPhase = document.querySelector('.moon-phase-name')?.textContent || '盈凸月';
        
        // 只有当消息明确询问月相相关信息时才引入月相元素
        if (message.includes('月相') || message.includes('月亮') || message.includes('新月') || 
            message.includes('满月') || message.includes('下弦') || message.includes('上弦')) {
            // 提供月相相关回复
            switch(currentPhase) {
                case '新月':
                    return '现在是新月时期，适合开始新计划和设定新目标。你有什么新想法吗？';
                case '娥眉月':
                    return '现在是娥眉月，这个阶段带来成长的能量，适合逐步推进计划。';
                case '上弦月':
                    return '现在是上弦月，是做决定和采取行动的好时机。你有什么决定需要做吗？';
                case '盈凸月':
                    return '现在是盈凸月，这个阶段充满创造力和表达能力，很适合创作和交流。';
                case '满月':
                    return '现在是满月，这个时期情绪和直觉会更加强烈，也是收获和完成的时刻。';
                case '亏凸月':
                    return '现在是亏凸月，适合反思和整合经验，释放不再需要的事物。';
                case '下弦月':
                    return '现在是下弦月，这是放下和释放的时期，适合整理和清理。';
                case '残月':
                    return '现在是残月，这个时期适合休息、内省和为新的周期做准备。';
                default:
                    return '月亮的不同阶段有不同的特质，就像我们的生活也有不同的节奏。';
            }
        } else {
            // 对于一般问题，给出自然的回应，不强制引入月相
            return getPersonalizedResponse(message);
        }
    }

    // 根据用户消息生成个性化回复
    function getPersonalizedResponse(message) {
        if (message.includes('难过') || message.includes('伤心') || message.includes('不开心')) {
            return '感到难过是很自然的事情。情绪也如同潮汐，不会一直停留在同一状态。或许可以尝试写下你的感受，让自己静静地放松一下。';
        } else if (message.includes('开心') || message.includes('高兴') || message.includes('快乐')) {
            return '很高兴听到你感到开心！这样的时刻真的很珍贵，希望这种好心情能持续下去。';
        } else if (message.includes('担心') || message.includes('焦虑') || message.includes('压力')) {
            return '生活中的压力确实会让人感到负担。试着深呼吸，给自己一点空间，或许会带来一些平静。';
        } else if (message.includes('爱') || message.includes('喜欢') || message.includes('感情')) {
            return '情感是我们生活中最复杂也最美丽的部分。愿意分享更多吗？我很乐意倾听。';
        } else if (message.includes('梦') || message.includes('睡不着') || message.includes('失眠')) {
            return '睡眠和梦境对我们的健康很重要。如果你最近睡不好，可以尝试在睡前创造更舒适的环境，或许记录下你的梦境也是个好主意。';
        } else if (message.includes('工作') || message.includes('学习') || message.includes('效率')) {
            return '工作和学习需要找到适合自己的节奏。有时候短暂的休息反而能提高效率，你觉得呢？';
        } else if (message.includes('音乐') || message.includes('歌') || message.includes('乐队')) {
            return '音乐是连接心灵的桥梁。我很喜欢各种风格的音乐，从古典到现代的都有欣赏。你有什么特别喜欢的音乐类型吗？';
        } else if (message.includes('电影') || message.includes('看片') || message.includes('电视')) {
            return '电影是讲述故事的绝佳方式，能带我们进入不同的世界。最近有看过什么好电影吗？';
        } else {
            // 更自然的通用回复
            const genericResponses = [
                '这个问题很有意思，能告诉我更多你的想法吗？',
                '我很欣赏你的分享。你想继续聊这个话题吗？',
                '生活中总有起起伏伏，保持平和的心态很重要。',
                '有时候交流想法就是一种很好的放松方式。',
                '我很喜欢和你聊天，你的观点总是很有见地。',
                '每个人的经历都是独特的，这也是交流的乐趣所在。',
                '谢谢你的分享，这让我对你有了更多了解。'
            ];
            
            return genericResponses[Math.floor(Math.random() * genericResponses.length)];
        }
    }

    // 为发送按钮添加事件监听
    const sendButton = document.querySelector('.overlay-send');
    if (sendButton) {
        sendButton.addEventListener('click', window.handleMessageSend);
    }

    // 为输入框添加回车发送功能
    const inputField = document.querySelector('.overlay-input');
    if (inputField) {
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.handleMessageSend();
            }
        });
    }

    // 为关闭按钮添加事件监听
    const closeButton = document.querySelector('.overlay-close');
    if (closeButton) {
        closeButton.addEventListener('click', window.closeOverlay);
    }

    console.log('月下对话框脚本已加载');
}); 