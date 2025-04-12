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
    
    // 确定月相 - 固定为盈凸月(测试用)
    let phase = '盈凸月';
    let displayAge = 11.0; // 盈凸月的月龄
    let displayIllumination = 91.7; // 盈凸月的照明度
    
    /* 注释掉原来的月相计算逻辑
    if (moonAge < 1.84566) phase = '新月';
    else if (moonAge < 5.53699) phase = '娥眉月';
    else if (moonAge < 9.22831) phase = '上弦月';
    else if (moonAge < 12.91963) phase = '盈凸月';
    else if (moonAge < 16.61096) phase = '满月';
    else if (moonAge < 20.30228) phase = '亏凸月';
    else if (moonAge < 23.99361) phase = '下弦月';
    else if (moonAge < 27.68493) phase = '残月';
    else phase = '新月';
    */
    
    return {
        phase,
        age: displayAge.toFixed(1),
        illumination: displayIllumination.toFixed(1),
        nextPhases: calculateNextPhases(date)
    };
}

// 计算未来月相时间
function calculateNextPhases(date) {
    // 假设我们当前处于盈凸月
    return [
        {
            phase: '盈凸月',
            date: '4月11日 12:15'
        },
        {
            phase: '满月',
            date: '4月13日 00:22'
        },
        {
            phase: '下弦月',
            date: '4月21日 01:35'
        },
        {
            phase: '新月',
            date: '4月27日 19:34'
        }
    ];
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

    // 根据月相名称获取对应的SVG文件名
    let svgFileName = 'waxing_gibbous.svg'; // 使用盈凸月图像
    
    // 更新所有月相图标 - 使用自定义SVG
    document.querySelectorAll('.moon-icon').forEach(moonIcon => {
        if (moonIcon.querySelector('svg')) {
            // 替换为外部SVG引用
            moonIcon.innerHTML = `<img src="assets/images/moon-phases/${svgFileName}" class="moon-svg-image" alt="${moonData.phase}" style="width: 100%; height: 100%; object-fit: contain;">`;
        }
    });
    
    document.querySelectorAll('.moon-logo').forEach(moonLogo => {
        if (moonLogo.querySelector('svg')) {
            // 替换为外部SVG引用
            moonLogo.innerHTML = `<img src="assets/images/moon-phases/${svgFileName}" class="moon-svg-image" alt="${moonData.phase}" style="width: 100%; height: 100%; object-fit: contain;">`;
        }
    });

    // 更新标题
    const homeTitle = document.querySelector('#home-page h1');
    if (homeTitle) {
        homeTitle.textContent = `今夜${moonData.phase}`;
    }
    
    // 更新月相图鉴页面的当前月相信息
    const currentMoonPhaseSection = document.querySelector('#current-moon-phase');
    if (currentMoonPhaseSection) {
        const phaseNameElement = currentMoonPhaseSection.querySelector('div > div:first-child');
        const phaseEnglishElement = currentMoonPhaseSection.querySelector('div > div:nth-child(2)');
        
        if (phaseNameElement) phaseNameElement.textContent = moonData.phase;
        if (phaseEnglishElement) phaseEnglishElement.textContent = 'Waxing Gibbous';
    }
    
    // 更新月龄和照明度显示
    document.querySelectorAll('[style*="月龄"]').forEach(el => {
        const valueEl = el.querySelector('div:nth-child(2)');
        if (valueEl) valueEl.textContent = `${moonData.age}天`;
    });
    
    document.querySelectorAll('[style*="照明度"]').forEach(el => {
        const valueEl = el.querySelector('div:nth-child(2)');
        if (valueEl) valueEl.textContent = `${moonData.illumination}%`;
    });
}

// 计算月相SVG路径
function calculateMoonPath(phase) {
    const r = 28; // 月球半径
    const cx = 32; // 中心X坐标
    const cy = 32; // 中心Y坐标
    
    // 盈凸月的路径 - 这里仍保留计算方法但已不再使用，因为我们使用外部SVG
    return `M${cx},${cy-r} A${r},${r} 0 1 1 ${cx},${cy+r} A${r},${r} 0 1 1 ${cx},${cy-r}`;
}

// 导出月相数据供API使用
function getMoonPhaseData() {
    const moonData = getMoonPhase();
    return {
        phase: moonData.phase,
        age: moonData.age,
        illumination: moonData.illumination,
        visibility: '18:30 - 04:15'  // 盈凸月的大致可见时间
    };
}

// 立即更新月相信息
updateMoonPhaseDisplay();

// 每分钟更新一次月相信息
setInterval(updateMoonPhaseDisplay, 60000);

// 页面加载时更新月相信息
document.addEventListener('DOMContentLoaded', updateMoonPhaseDisplay);

// 暴露函数到全局作用域
window.getMoonPhaseData = getMoonPhaseData; 