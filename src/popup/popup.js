/*
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-07 15:31:20
 * @LastEditTime: 2025-05-07 19:05:00
 * @LastEditors: liyanminghui@codeck.ai
 * @Description: 设置页面逻辑
 * @FilePath: /miao_scripts/src/popup/popup.js
 */

console.log('popup.js 开始加载');

// 当popup页面加载完成时
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded 事件触发');

    // 获取按钮元素
    const observeSkyButton = document.getElementById('observeSkyButton');
    const testButton = document.getElementById('testButton');

    console.log('按钮元素:', {
        observeSkyButton: !!observeSkyButton,
        testButton: !!testButton
    });

    // 添加观测天空按钮点击事件
    if (observeSkyButton) {
        observeSkyButton.addEventListener('click', async function () {
            console.log('观测天空按钮被点击');
            // 在页面上显示消息
            const message = document.createElement('div');
            message.textContent = '开始观察天空按钮...';
            message.style.color = 'green';
            message.style.marginTop = '10px';
            document.body.appendChild(message);

            try {
                // 获取当前标签页
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

                // 注入内容脚本
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['src/content/observeElement.js']
                });

                // 发送消息给content script
                chrome.tabs.sendMessage(tab.id, {
                    action: 'observeElement',
                    selector: '#observeButton' // 要观察的元素选择器
                }, response => {
                    console.log('收到响应:', response);
                    if (response && response.status === 'success') {
                        message.textContent = response.message;
                        message.style.color = 'green';
                    } else {
                        message.textContent = '未找到目标元素';
                        message.style.color = 'red';
                    }
                });
            } catch (error) {
                console.error('执行脚本失败:', error);
                message.textContent = '执行失败: ' + error.message;
                message.style.color = 'red';
            }
        });
    }

    // 添加测试按钮点击事件
    if (testButton) {
        testButton.addEventListener('click', async function () {
            console.log('测试按钮被点击');
            // 在页面上显示消息
            const message = document.createElement('div');
            message.textContent = '开始测试...';
            message.style.color = 'blue';
            message.style.marginTop = '10px';
            document.body.appendChild(message);

            try {
                // 获取当前标签页
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

                // 注入内容脚本
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['src/content/observeElement.js']
                });

                // 发送消息给content script
                chrome.tabs.sendMessage(tab.id, {
                    action: 'observeElement',
                    selector: '#su' // 百度搜索按钮，用于测试
                }, response => {
                    console.log('收到响应:', response);
                    if (response && response.status === 'success') {
                        message.textContent = response.message;
                        message.style.color = 'blue';
                    } else {
                        message.textContent = '未找到测试元素';
                        message.style.color = 'red';
                    }
                });
            } catch (error) {
                console.error('执行脚本失败:', error);
                message.textContent = '执行失败: ' + error.message;
                message.style.color = 'red';
            }
        });
    }
});
