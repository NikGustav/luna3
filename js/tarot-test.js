// 塔罗牌数据测试脚本
document.addEventListener('DOMContentLoaded', function() {
    console.log('========== 塔罗牌数据测试 ==========');
    
    // 检查TAROT_IMAGES是否已定义
    if (typeof TAROT_IMAGES === 'undefined') {
        console.error('错误: TAROT_IMAGES 未定义，检查 tarot-base64.js 是否正确加载');
        alert('错误: 塔罗牌图片数据未加载，请检查控制台');
        return;
    }
    
    console.log('TAROT_IMAGES 已定义，类型: ' + typeof TAROT_IMAGES);
    console.log('TAROT_IMAGES 包含 ' + Object.keys(TAROT_IMAGES).length + ' 个键');
    
    // 检查一些关键牌是否存在
    const cardsToCheck = ['愚者', '魔术师', '女祭司', '女皇', '皇帝', '教皇', '恋人', '战车', '力量', '隐士'];
    
    cardsToCheck.forEach(card => {
        if (TAROT_IMAGES[card]) {
            const dataLength = TAROT_IMAGES[card].length;
            console.log(`- ${card}牌: 数据存在，长度: ${dataLength}`);
            console.log(`  数据开头: ${TAROT_IMAGES[card].substring(0, 30)}...`);
        } else {
            console.error(`- ${card}牌: 数据不存在`);
        }
    });
    
    console.log('===================================');
}); 