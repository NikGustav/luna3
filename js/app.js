// DOM 元素
const moonPhaseElement = document.getElementById('moon-phase');
const userProfileForm = document.getElementById('user-profile-form');
const zodiacSignElement = document.getElementById('zodiac-sign');
const birthdayElement = document.getElementById('birthday');

// 初始化应用
async function initApp() {
    try {
        // 加载月相数据
        const moonPhase = getMoonPhase();
        updateMoonPhaseDisplay(moonPhase);

        // 加载用户资料
        const userProfile = await getUserProfile();
        updateUserProfileDisplay(userProfile);
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// 更新月相显示
function updateMoonPhaseDisplay(moonPhase) {
    if (moonPhaseElement) {
        moonPhaseElement.innerHTML = `
            <div class="moon-phase-info">
                <h3>当前月相</h3>
                <p>${moonPhase.phase}</p>
                <p>月龄：${moonPhase.age}</p>
                <p>亮度：${moonPhase.illumination}</p>
                <p>可见时间：${moonPhase.visibility}</p>
            </div>
        `;
    }
}

// 更新用户资料显示
function updateUserProfileDisplay(profile) {
    if (zodiacSignElement) {
        zodiacSignElement.textContent = profile.zodiac || '未设置';
    }
    if (birthdayElement) {
        birthdayElement.textContent = profile.birthday || '未设置';
    }
}

// 处理用户资料表单提交
if (userProfileForm) {
    userProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(userProfileForm);
        const userData = {
            birthday: formData.get('birthday'),
            zodiac: formData.get('zodiac')
        };

        try {
            await updateUserProfile(userData);
            alert('用户资料更新成功！');
        } catch (error) {
            console.error('Error updating user profile:', error);
            alert('更新失败，请重试');
        }
    });
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp);

document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = '正在思考...';

    // 初始化消息容器的滚动位置
    chatMessages.scrollTop = chatMessages.scrollHeight;

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user-message' : 'message assistant-message';
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showLoading() {
        loadingIndicator.style.display = 'block';
        chatMessages.appendChild(loadingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideLoading() {
        if (loadingIndicator.parentNode === chatMessages) {
            chatMessages.removeChild(loadingIndicator);
        }
    }

    async function handleSendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        try {
            // 显示用户消息
            addMessage(message, true);
            chatInput.value = '';
            chatInput.disabled = true;
            sendButton.disabled = true;

            // 显示加载指示器
            showLoading();

            // 发送消息到API
            const response = await sendMessageToAPI(message);
            
            // 隐藏加载指示器
            hideLoading();

            // 显示助手回复
            addMessage(response);
        } catch (error) {
            console.error('消息发送错误:', error);
            hideLoading();
            addMessage('抱歉，我暂时无法回应，请稍后再试。');
        } finally {
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }
    }

    // 发送按钮点击事件
    sendButton.addEventListener('click', handleSendMessage);

    // 输入框回车事件
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // 移动端触摸事件
    let touchStartY = 0;
    chatMessages.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });

    chatMessages.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const scrollTop = chatMessages.scrollTop;
        const scrollHeight = chatMessages.scrollHeight;
        const clientHeight = chatMessages.clientHeight;

        // 如果已经滚动到顶部或底部，阻止默认行为以防止页面滚动
        if ((scrollTop <= 0 && touchY > touchStartY) || 
            (scrollTop + clientHeight >= scrollHeight && touchY < touchStartY)) {
            e.preventDefault();
        }
    });
}); 