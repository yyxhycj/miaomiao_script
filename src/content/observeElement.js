/*
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-06 16:11:44
 * @LastEditTime: 2025-05-09 14:23:00
 * @LastEditors: liyanminghui@codeck.ai
 * @Description: 用来监听小猫观测天空按钮出现
 * @FilePath: /miao_scripts/src/content/observeElement.js
 */

// 全局状态
window.miaomiaoState = window.miaomiaoState || {
    observers: new Map(),
    clickCount: 0,
    settings: {
        observeSkyEnabled: false,
        testEnabled: false,
        autoPlayEnabled: false,
        delayTime: 2000,
        retryCount: 3
    }
};

// 创建提示框
function createAlertBox() {
    const alertBox = document.createElement('div');
    alertBox.style.cssText = 'position:fixed;top:10px;right:10px;padding:10px;background-color:#4CAF50;color:white;border-radius:4px;display:none;z-index:9999;';
    alertBox.className = 'alert-box';
    document.body.appendChild(alertBox);
    return alertBox;
}

/**
 * 监听元素的出现
 * @param {string} selector - 目标元素选择器
 */
function observeElementPresence(selector) {
    // 如果已经存在观察器，先断开连接
    if (window.miaomiaoState.observers.has(selector)) {
        window.miaomiaoState.observers.get(selector).disconnect();
    }

    const alertBox = document.querySelector('.alert-box') || createAlertBox();
    let currentElement = null;

    async function handleElementAppear(element) {
        if (!currentElement) {
            currentElement = element;
            console.log('检测到元素:', element);

            // 显示提示框
            alertBox.textContent = `检测到变化：${element.value || element.textContent}`;
            alertBox.style.display = 'block';
            setTimeout(() => alertBox.style.display = 'none', 3000);

            // 重新获取最新设置
            const settings = await new Promise(resolve => {
                chrome.storage.sync.get({
                    autoPlayEnabled: false
                }, resolve);
            });

            console.log('获取到的设置:', settings);
            window.miaomiaoState.settings.autoPlayEnabled = settings.autoPlayEnabled;

            // 如果启用了自动游戏，则点击按钮
            if (settings.autoPlayEnabled) {
                console.log('准备点击元素');
                try {
                    window.miaomiaoState.clickCount++;
                    element.click();
                    console.log('点击成功，次数:', window.miaomiaoState.clickCount);
                } catch (error) {
                    console.error('点击失败:', error);
                }
            } else {
                console.log('自动游戏未启用，跳过点击');
            }
        }
    }

    function checkForElement() {
        const element = document.querySelector(selector);
        if (element) handleElementAppear(element);
    }

    // 创建观察器
    const observer = new MutationObserver(() => checkForElement());

    // 开始观察
    observer.observe(document.body, { childList: true, subtree: true });
    window.miaomiaoState.observers.set(selector, observer);

    // 立即检查元素
    checkForElement();

    // 定期检查，以防漏检
    const intervalId = setInterval(checkForElement, window.miaomiaoState.settings.delayTime);

    // 返回清理函数
    return () => {
        observer.disconnect();
        clearInterval(intervalId);
        window.miaomiaoState.observers.delete(selector);
    };
}

// 初始化函数
async function initialize() {
    // 加载存储的设置
    console.log('开始加载设置...');
    chrome.storage.sync.get({
        observeSkyEnabled: false,
        testEnabled: false,
        autoPlayEnabled: false,
        delayTime: 2,
        retryCount: 3
    }, function (items) {
        console.log('加载到的设置:', items);
        // 更新状态
        window.miaomiaoState.settings = {
            ...window.miaomiaoState.settings,
            observeSkyEnabled: items.observeSkyEnabled,
            testEnabled: items.testEnabled,
            autoPlayEnabled: items.autoPlayEnabled,
            delayTime: items.delayTime * 1000,
            retryCount: items.retryCount
        };
        console.log('更新后的状态:', state.settings);

        // 如果之前已启用监控，自动开启
        if (items.observeSkyEnabled) {
            observeElementPresence('#observeBtn');
        }
        if (items.testEnabled) {
            observeElementPresence('#su');
        }
    });

    // 监听存储变化
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'sync') {
            Object.entries(changes).forEach(([key, { newValue }]) => {
                switch (key) {
                    case 'observeSkyEnabled':
                        window.miaomiaoState.settings.observeSkyEnabled = newValue;
                        if (newValue) {
                            observeElementPresence('#observeBtn');
                        } else if (window.miaomiaoState.observers.has('#observeBtn')) {
                            window.miaomiaoState.observers.get('#observeBtn').disconnect();
                            window.miaomiaoState.observers.delete('#observeBtn');
                        }
                        break;
                    case 'testEnabled':
                        window.miaomiaoState.settings.testEnabled = newValue;
                        if (newValue) {
                            observeElementPresence('#su');
                        } else if (window.miaomiaoState.observers.has('#su')) {
                            window.miaomiaoState.observers.get('#su').disconnect();
                            window.miaomiaoState.observers.delete('#su');
                        }
                        break;
                    case 'autoPlayEnabled':
                        window.miaomiaoState.settings.autoPlayEnabled = newValue;
                        break;
                    case 'delayTime':
                        window.miaomiaoState.settings.delayTime = newValue * 1000;
                        break;
                    case 'retryCount':
                        window.miaomiaoState.settings.retryCount = newValue;
                        break;
                }
            });
        }
    });
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到消息:', request);
    
    if (request.action === 'observeElement') {
        observeElementPresence(request.selector);
        sendResponse({ status: 'success' });
    } 
    else if (request.action === 'updateSettings') {
        console.log('收到设置更新:', request.settings);
        // 直接更新状态
        Object.assign(window.miaomiaoState.settings, request.settings);
        console.log('更新后的状态:', window.miaomiaoState.settings);
        sendResponse({ status: 'success' });
    }
    
    return true;
});

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initialize);

// 页面刷新或关闭时清理观察器
window.addEventListener('beforeunload', function () {
    window.miaomiaoState.observers.forEach(observer => observer.disconnect());
    window.miaomiaoState.observers.clear();
    if (request.action === 'observeElement') {
        console.log('收到观察元素请求:', request.selector);
        observeElementPresence(
            request.selector,
            (element) => {
                console.log('元素出现:', element);
                sendResponse({ status: 'success', message: '元素已找到并点击' });
            },
            (element) => {
                console.log('元素消失:', element);
                sendResponse({ status: 'error', message: '元素已消失' });
            }
        );
        return true; // 保持消息通道开放
    }
});