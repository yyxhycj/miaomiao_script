/*
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-06 16:11:44
 * @LastEditTime: 2025-05-06 19:41:08
 * @LastEditors: liyanminghui@codeck.ai
 * @Description: 用来监听小猫观测天空按钮出现
 * @FilePath: /miao_scripts/skyBtn-script.js
 */

//<div id="observeButton"></div>
// 创建提示框
const alertBox = document.createElement('div');
alertBox.className = 'alert-box';
document.body.appendChild(alertBox);

// 目标元素选择器
const targetSelector = '#observeBtn';

// 记录点击次数
cur_num = 0

/**
 * 持续监听元素的出现和消失
 * @param {string} selector - 目标元素选择器（如 ".dynamic-element"）
 * @param {Function} onAppear - 元素出现时的回调
 * @param {Function} onDisappear - 元素消失时的回调（可选）
 */
function observeElementPresence(selector, onAppear, onDisappear) {
    let currentElement = null;
    let observer = null;

    // 监听元素出现
    function startObservation() {
        // 1. 检查元素是否已存在
        const element = document.querySelector(selector);
        if (element) {
            handleElementAppear(element);
            return;
        }

        // 2. 创建父级监听器
        const parentObserver = new MutationObserver((mutations) => {
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

        // 3. 监听整个文档（可根据需要缩小范围）
        parentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 处理元素出现
    function handleElementAppear(element) {
        currentElement = element;
        onAppear?.(element);

        // do something with the element
        // 显示提示框
        alertBox.style.display = 'block';
        alertBox.textContent = `检测到变化：${target.value}`;
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);

        // 点击按钮
        cur_num += 1
        target.click();
        console.log('按钮点击成功！', "出现次数：", cur_num);

        // 4. 监听元素自身被移除
        const elementObserver = new MutationObserver((mutations, observer) => {
            if (!document.contains(element)) {
                handleElementDisappear();
                observer.disconnect();
            }
        });

        // 5. 监听元素父级变化
        elementObserver.observe(element.parentElement, {
            childList: true
        });
    }

    // 处理元素消失
    function handleElementDisappear() {
        onDisappear?.(currentElement);
        currentElement = null;
        // 6. 重启监听流程
        startObservation();
    }

    // 启动初始监听
    startObservation();
}

// 启动
observeElementPresence(
    targetSelector,
    (element) => {
        console.log('元素出现:', element);
    },
    (element) => {
        console.log('元素消失:', element);
    }
);

// 监听错误
window.onerror = function (message, source, lineno, colno, error) {
    console.log('出现报错, 重新监控');
    observeElementPresence(
        targetSelector,
        (element) => {
            console.log('元素出现:', element);
        },
        (element) => {
            console.log('元素消失:', element);
        }
    );
};
