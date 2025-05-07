/*
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-06 16:11:44
 * @LastEditTime: 2025-05-07 19:16:13
 * @LastEditors: liyanminghui@codeck.ai
 * @Description: 用来监听小猫观测天空按钮出现
 * @FilePath: /miao_scripts/src/content/observeElement.js
 */

// 创建提示框
const alertBox = document.createElement('div');
alertBox.className = 'alert-box';
document.body.appendChild(alertBox);

// 记录点击次数
let cur_num = 0;

/**
 * 持续监听元素的出现和消失
 * @param {string} selector - 目标元素选择器
 * @param {Function} onAppear - 元素出现时的回调
 * @param {Function} onDisappear - 元素消失时的回调（可选）
 */
function observeElementPresence(selector, onAppear, onDisappear) {
    let currentElement = null;
    console.log('开始监听元素:', selector);

    // 监听元素出现
    function startObservation() {
        // 1. 检查元素是否已存在
        const element = document.querySelector(selector);
        if (element) {
            handleElementAppear(element);
            return;
        }

        // 2. 创建观察器
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const target = node.matches(selector) ? node : node.querySelector(selector);
                        if (target && !currentElement) {
                            handleElementAppear(target);
                        }
                    }
                });
            });
        });

        // 3. 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 处理元素出现
    function handleElementAppear(element) {
        currentElement = element;
        console.log('检测到元素出现:', element);
        onAppear?.(element);

        // 显示提示框
        alertBox.style.display = 'block';
        alertBox.textContent = `检测到变化：${element.value || element.textContent}`;
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);

        // 点击按钮
        try {
            cur_num += 1;
            element.click();
            console.log('按钮点击成功! 当前次数：', cur_num);
        } catch (error) {
            console.error('按钮点击失败：', error);
        }
    }

    // 启动监听
    startObservation();
}



// // 目标元素选择器
// const targetSelector = '#observeBtn';

// // 启动
// observeElementPresence(
//     targetSelector,
//     (element) => {
//         console.log('元素出现:', { element });
//     },
//     (element) => {
//         console.log('元素消失:', { element });
//     }
// );

// // 监听错误
// window.onerror = function (message, source, lineno, colno, error) {
//     console.log('出现报错, 重新监控');
//     observeElementPresence(
//         targetSelector,
//         (element) => {
//             console.log('元素出现:', { element });
//         },
//         (element) => {
//             console.log('元素消失:', { element });
//         }
//     );
// };


// const testSelector = '#su';
// // 测试用
// observeElementPresence(
//     testSelector,
//     (element) => {
//         console.log('INFO', '元素出现:', { element });
//     },
//     (element) => {
//         console.log('INFO', '元素消失:', { element });
//     }
// );


// // 每隔 3 秒切换元素状态
// setInterval(() => {
//     if (document.querySelector(testSelector)) {
//         document.querySelector(testSelector).remove();
//     } else {
//         document.body.innerHTML += '<div id=#su>测试元素</div>';
//     }
// }, 3000);

// 监听来自popup的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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