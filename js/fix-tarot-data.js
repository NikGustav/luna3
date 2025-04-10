// 塔罗牌数据修复脚本
document.addEventListener('DOMContentLoaded', function() {
    console.log('========== 开始修复塔罗牌数据 ==========');
    
    // 检查原始数据是否存在
    if (typeof TAROT_IMAGES === 'undefined') {
        console.error('错误: 原始塔罗牌数据未加载');
        return;
    }
    
    // 检查数据格式
    console.log('检查数据格式...');
    const cardNames = [
        '愚者', '魔术师', '女祭司', '女皇', '皇帝', '教皇', '恋人', '战车', 
        '力量', '隐士', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔', 
        '塔', '星星', '月亮', '太阳', '审判', '世界'
    ];
    
    // 创建修复后的数据对象
    const fixedData = {};
    let hasErrors = false;
    
    cardNames.forEach(cardName => {
        if (TAROT_IMAGES[cardName]) {
            const imageData = TAROT_IMAGES[cardName];
            // 检查数据格式是否正确
            if (imageData.startsWith('data:image/')) {
                fixedData[cardName] = imageData;
                console.log(`✓ ${cardName}牌数据格式正确`);
            } else {
                console.error(`✗ ${cardName}牌数据格式错误`);
                hasErrors = true;
            }
        } else {
            console.error(`✗ ${cardName}牌数据缺失`);
            hasErrors = true;
        }
    });
    
    if (hasErrors) {
        console.error('发现错误，请检查数据格式');
    } else {
        console.log('所有数据格式正确');
        
        // 将修复后的数据写入新文件
        const output = 'const TAROT_IMAGES = ' + JSON.stringify(fixedData, null, 2) + ';';
        
        // 创建下载链接
        const blob = new Blob([output], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tarot-base64-fixed.js';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('已生成修复后的文件: tarot-base64-fixed.js');
    }
    
    console.log('===================================');
}); 