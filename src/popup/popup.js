/*
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-07 15:31:20
 * @LastEditTime: 2025-05-09 15:46:09
 * @LastEditors: liyanminghui@codeck.ai
 * @Description: 设置页面逻辑
 * @FilePath: /miao_scripts/src/popup/popup.js
 */

console.log('popup.js 开始加载');

// 当popup页面加载完成时
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded 事件触发');

    // 获取元素
    const observeSkyEnabled = document.getElementById('observeSkyEnabled');
    const sendHunterEnabled = document.getElementById('sendHunterEnabled');
    const testEnabled = document.getElementById('testEnabled');
    const autoPlayEnabled = document.getElementById('autoPlayEnabled');
    const delayTime = document.getElementById('delayTime');
    const retryCount = document.getElementById('retryCount');
    const messageContainer = document.getElementById('messageContainer');
    const statusContainer = document.getElementById('statusContainer');
    const saveSettings = document.getElementById('saveSettings');

    // 加载所有保存的设置
    chrome.storage.sync.get({
        observeSkyEnabled: false,
        sendHunterEnabled: false,
        testEnabled: false,
        autoPlayEnabled: false,
        delayTime: 2,
        retryCount: 3
    }, function (items) {
        // 设置监控选项
        observeSkyEnabled.checked = items.observeSkyEnabled;
        sendHunterEnabled.checked = items.sendHunterEnabled;
        testEnabled.checked = items.testEnabled;

        // 设置游戏相关选项
        autoPlayEnabled.checked = items.autoPlayEnabled;
        delayTime.value = items.delayTime;
        retryCount.value = items.retryCount;

        // 如果之前已启用监控，自动开启
        if (items.observeSkyEnabled) {
            startObservation('#observeBtn', '天空按钮');
        }
        if (items.sendHunterEnabled) {
            startObservation('#fastHuntContainer', '猎人按钮');
        }
        if (items.testEnabled) {
            startObservation('#su', '测试按钮');
        }
    });

    // 显示消息的通用函数
    function showMessage(text, type = 'info') {
        messageContainer.innerHTML = `<div style="padding:8px;margin-bottom:8px;border-radius:4px;background-color:${type === 'success' ? '#E8F5E9' : type === 'error' ? '#FFEBEE' : '#E3F2FD'};color:${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'}">${text}</div>`;
    }

    // 开始观察的函数
    async function startObservation(selector, name) {
        showMessage(`开始观察${name}...`, 'info');
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['src/content/observeElement.js']
            });
            chrome.tabs.sendMessage(tab.id, {
                action: 'observeElement',
                selector: selector
            }, response => {
                showMessage(response?.status === 'success' ? `开始持续监控${name}` : `未找到${name}`, response?.status === 'success' ? 'success' : 'error');
            });
        } catch (error) {
            showMessage('执行失败: ' + error.message, 'error');
        }
    }

    // 观测天空开关事件
    observeSkyEnabled.addEventListener('change', function () {
        chrome.storage.sync.set({ observeSkyEnabled: this.checked });
        if (this.checked) {
            startObservation('#observeBtn', '天空按钮');
        }
    });

    // 派出猎人开关事件
    sendHunterEnabled.addEventListener('change', function () {
        chrome.storage.sync.set({ sendHunterEnabled: this.checked });
        if (this.checked) {
            startObservation('#sendHunterBtn', '猎人按钮');
        }
    });

    // 测试开关事件
    testEnabled.addEventListener('change', function () {
        chrome.storage.sync.set({ testEnabled: this.checked });
        if (this.checked) {
            startObservation('#su', '测试按钮');
        }
    });

    // 自动游戏开关事件
    autoPlayEnabled.addEventListener('change', async function () {
        console.log('自动游戏开关状态改变:', this.checked);
        updateGameSettings();
    });

    // 延迟时间设置事件
    delayTime.addEventListener('change', function () {
        updateGameSettings();
    });

    // 重试次数设置事件
    retryCount.addEventListener('change', function () {
        updateGameSettings();
    });

    // 更新游戏设置的通用函数
    async function updateGameSettings() {
        const settings = {
            autoPlayEnabled: autoPlayEnabled.checked,
            delayTime: parseInt(delayTime.value),
            retryCount: parseInt(retryCount.value)
        };

        // 保存设置
        await chrome.storage.sync.set(settings);
        showMessage('游戏设置已更新', 'success');

        // 获取当前标签页
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
            console.error('未找到当前标签页');
            return;
        }

        // 先重新注入脚本
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['src/content/observeElement.js']
        });

        // 通知内容脚本更新设置
        chrome.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            settings: settings
        }, response => {
            console.log('设置更新响应:', response);
            if (response?.status === 'success') {
                showMessage('设置已同步到页面', 'success');
            }
        });
    }

    // 保存设置按钮事件
    saveSettings.addEventListener('click', function () {
        const settings = {
            delayTime: parseInt(delayTime.value) || 2,
            retryCount: parseInt(retryCount.value) || 3
        };

        chrome.storage.sync.set(settings, function () {
            showMessage('设置已保存', 'success');
        });
    });
});
