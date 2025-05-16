/*
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-06 16:11:44
 * @LastEditTime: 2025-05-16 15:37:34
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
        // 检查元素是否发生变化
        if (currentElement !== element) {
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

                    // 检查是否超过重试次数
                    if (window.miaomiaoState.clickCount >= window.miaomiaoState.settings.retryCount) {
                        console.log('已达到最大重试次数:', window.miaomiaoState.settings.retryCount);
                        window.miaomiaoState.clickCount = 0; // 重置计数
                    }

                    // 点击后重置 currentElement，允许再次点击
                    setTimeout(() => {
                        currentElement = null;
                        console.log('重置状态，准备下一次点击');
                    }, window.miaomiaoState.settings.delayTime); // 使用设置的延迟时间
                } catch (error) {
                    console.error('点击失败:', error);
                    currentElement = null; // 失败时也重置
                }
            } else {
                console.log('自动游戏未启用，跳过点击');
                currentElement = null; // 未启用时也重置
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
    console.log('脚本开始初始化...');

    // 加载存储的设置
    const items = await new Promise(resolve => {
        chrome.storage.sync.get({
            observeSkyEnabled: false,
            testEnabled: false,
            autoPlayEnabled: false,
            delayTime: 2,
            retryCount: 3
        }, resolve);
    });

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

    console.log('初始化状态:', window.miaomiaoState.settings);

    // 自动启动监控
    if (window.location.hostname === 'lolitalibrary.com') {
        console.log('在游戏页面中，启动监控...');
        if (items.observeSkyEnabled) {
            console.log('开始监控天空按钮');
            observeElementPresence('#observeBtn');
        }
    } else if (window.location.hostname === 'www.baidu.com') {
        console.log('在测试页面中，启动监控...');
        if (items.testEnabled) {
            console.log('开始监控测试按钮');
            observeElementPresence('#su');
        }
    }

    // 监听存储变化
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'sync') {
            console.log('检测到设置变化:', changes);

            // 更新状态
            Object.entries(changes).forEach(([key, { newValue }]) => {
                window.miaomiaoState.settings[key] = key === 'delayTime' ? newValue * 1000 : newValue;
            });

            // 根据当前页面处理监控状态
            if (window.location.hostname === 'lolitalibrary.com') {
                if ('observeSkyEnabled' in changes) {
                    if (changes.observeSkyEnabled.newValue) {
                        console.log('开始监控天空按钮');
                        observeElementPresence('#observeBtn');
                    } else if (window.miaomiaoState.observers.has('#observeBtn')) {
                        console.log('停止监控天空按钮');
                        window.miaomiaoState.observers.get('#observeBtn').disconnect();
                        window.miaomiaoState.observers.delete('#observeBtn');
                    }
                }
            } else if (window.location.hostname === 'www.baidu.com') {
                if ('testEnabled' in changes) {
                    if (changes.testEnabled.newValue) {
                        console.log('开始监控测试按钮');
                        observeElementPresence('#su');
                    } else if (window.miaomiaoState.observers.has('#su')) {
                        console.log('停止监控测试按钮');
                        window.miaomiaoState.observers.get('#su').disconnect();
                        window.miaomiaoState.observers.delete('#su');
                    }
                }
            }

            console.log('更新后的状态:', window.miaomiaoState.settings);
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