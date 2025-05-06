/*
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-06 16:11:44
 * @LastEditTime: 2025-05-06 17:28:23
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
    const button = document.getElementById('observeBtn');
    cur_num = 0 // 记录点击次数
    if (button) {
        // const observer = new MutationObserver((mutations) => {
        //     mutations.forEach((mutation) => {
        //         if (mutation.attributeName === 'value') {
        console.log('按钮出现:', button);

        // 显示提示框
        alertBox.style.display = 'block';
        alertBox.textContent = `检测到变化：${button.value}`;
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);

        // 点击按钮
        cur_num += 1
        button.click();
        console.log('按钮点击成功！', "出现次数：", cur_num);
        // }
        //     });
        // });
        observer.observe(button, { attributes: true, attributeFilter: ['value'] });
    } else {
        console.log('未找到按钮！');
        setTimeout(observeButton, 2000); // 轮询直到按钮加载
    }
};

observeButton();

// 监听错误
window.onerror = function (message, source, lineno, colno, error) {
    console.log('按钮消失,重新监控');
    observeButton();
};