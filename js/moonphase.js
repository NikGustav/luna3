// 计算月相
function getMoonPhase(date) {
    // 使用当前日期或传入的日期
    date = date || new Date();
    
    // 参考日期：2000年1月6日 18:14 UTC (已知新月时间)
    const refDate = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
    
    // 月球轨道周期（朔望月）约为29.53天
    const synMonth = 29.53058867;
    
    // 计算从参考日期到目标日期的天数
    const diffDays = (date - refDate) / (24 * 60 * 60 * 1000);
    
    // 计算月龄（0-29.53）
    let moonAge = diffDays % synMonth;
    if (moonAge < 0) moonAge += synMonth;
    
    // 计算照明度（0-100%）
    const illumination = Math.abs(Math.cos(moonAge / synMonth * 2 * Math.PI)) * 100;
    
    // 确定月相
    let phase;
    if (moonAge < 1.84566) phase = '新月';
    else if (moonAge < 5.53699) phase = '娥眉月';
    else if (moonAge < 9.22831) phase = '上弦月';
    else if (moonAge < 12.91963) phase = '盈凸月';
    else if (moonAge < 16.61096) phase = '满月';
    else if (moonAge < 20.30228) phase = '亏凸月';
    else if (moonAge < 23.99361) phase = '下弦月';
    else if (moonAge < 27.68493) phase = '残月';
    else phase = '新月';
    
    return {
        phase,
        age: moonAge.toFixed(1),
        illumination: illumination.toFixed(1),
        nextPhases: calculateNextPhases(date)
    };
}

// 计算未来月相时间
function calculateNextPhases(date) {
    const phases = ['新月', '上弦月', '满月', '下弦月'];
    const results = [];
    
    // 计算未来4个主要月相
    for (let i = 0; i < 4; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + i * 7); // 粗略估计，每个主要月相间隔约7天
        results.push({
            phase: phases[i],
            date: nextDate.toLocaleDateString('zh-CN', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        });
    }
    
    return results;
}

// 更新页面上的月相信息
function updateMoonPhaseDisplay() {
    const moonData = getMoonPhase();
    
    // 更新所有显示月相的元素
    document.querySelectorAll('.moon-phase').forEach(el => {
        // 根据不同页面设置不同的显示格式
        if (el.closest('#welcome-page')) {
            el.textContent = `今晚是${moonData.phase}`;
        } else if (el.closest('#home-page')) {
            el.textContent = `月相：${moonData.phase} · 照明度：${moonData.illumination}%`;
        } else {
            el.textContent = `今夜月相：${moonData.phase}`;
        }
    });

    // 更新所有月相图标
    document.querySelectorAll('.moon-logo svg').forEach(moonIcon => {
        const clipPath = moonIcon.querySelector('clipPath path');
        if (clipPath) {
            const d = calculateMoonPath(parseFloat(moonData.age) / 29.53058867);
            clipPath.setAttribute('d', d);
        }
    });

    // 更新标题
    const homeTitle = document.querySelector('#home-page h1');
    if (homeTitle) {
        homeTitle.textContent = `今夜${moonData.phase}`;
    }
}

// 计算月相SVG路径
function calculateMoonPath(phase) {
    const r = 28; // 月球半径
    const cx = 32; // 中心X坐标
    const cy = 32; // 中心Y坐标
    
    if (phase <= 0.5) {
        // 从新月到满月
        const x = cx + r * Math.cos(2 * Math.PI * phase);
        return `M${cx},${cy-r} A${r},${r} 0 0 1 ${cx},${cy+r} Q${x},${cy} ${cx},${cy-r}`;
    } else {
        // 从满月到新月
        const x = cx + r * Math.cos(2 * Math.PI * phase);
        return `M${cx},${cy-r} A${r},${r} 0 0 0 ${cx},${cy+r} Q${x},${cy} ${cx},${cy-r}`;
    }
}

// 立即更新月相信息
updateMoonPhaseDisplay();

// 每分钟更新一次月相信息
setInterval(updateMoonPhaseDisplay, 60000);

// 页面加载时更新月相信息
document.addEventListener('DOMContentLoaded', updateMoonPhaseDisplay); 