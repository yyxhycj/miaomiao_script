/*
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-06 16:11:44
 * @LastEditTime: 2025-05-06 16:42:25
 * @LastEditors: liyanminghui@codeck.ai
 * @Description: 用来监听小猫观测天空按钮出现
 * @FilePath: /miao_scripts/skyBtn-script.js
 */

//<div id="observeButton"></div>
// 创建提示框
const alertBox = document.createElement('div');
alertBox.className = 'alert-box';
document.body.appendChild(alertBox);

// 监听按钮变化
const observeButton = () => {
    const button = document.getElementById('su');
    if (button) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'value') {
                    console.log('按钮文字变化:', button.value); // 在控制台输出变化

                    // 显示提示框
                    alertBox.style.display = 'block';
                    alertBox.textContent = `检测到变化：${button.value}`;
                    setTimeout(() => {
                        alertBox.style.display = 'none';
                    }, 3000);
                }
            });
        });
        observer.observe(button, { attributes: true, attributeFilter: ['value'] });
    } else {
        setTimeout(observeButton, 2000); // 轮询直到按钮加载
    }
};

observeButton();