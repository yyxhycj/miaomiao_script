/*
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-06 16:11:44
 * @LastEditTime: 2025-05-07 14:27:52
 * @LastEditors: liyanminghui@codeck.ai
 * @Description: 用来监听小猫观测天空按钮出现
 * @FilePath: /miao_scripts/skyBtn-script.js
 */
// ==================== 主功能 ====================
// 创建提示框
const alertBox = document.createElement('div');
alertBox.className = 'alert-box';
document.body.appendChild(alertBox);

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

    console.log('开始监听元素', { selector });
    // 监听元素出现
    function startObservation() {
        // 1. 检查元素是否已存在
        const element = document.querySelector(selector);
        if (element) {
            handleElementAppear(element);
            return;
        }

        console.log('持续监听元素', { selector });
        // 2. 创建父级监听器
        // <div id="observeButton"></div>
        // rightColumn
        const parentObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                try {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const target = node.matches(selector) ? node : node.querySelector(selector);
                            if (target && !currentElement) {
                                handleElementAppear(target);
                            }
                        }
                    });
                } catch (error) {
                    console.log('父级元素mutation', { mutation });
                }
            });
        });
        console.log('最终父级元素', { parentObserver });

        // 3. 监听整个文档（可根据需要缩小范围）

        parentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 处理元素出现
    function handleElementAppear(element) {
        // currentElement = element;
        // console.log('检测到元素出现', { element });
        onAppear?.(element);

        // do something with the element
        // 显示提示框
        alertBox.style.display = 'block';
        alertBox.textContent = `检测到变化：${element.value}`;
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);

        // 点击按钮
        try {
            cur_num += 1;
            element.click();
            console.log('按钮点击成功! 当前次数：', cur_num)
        } catch (error) {
            console.error('按钮点击失败：', { error });
        }

        // 4. 监听元素自身被移除
        const elementObserver = new MutationObserver((mutations, observer) => {
            try {
                if (!document.contains(element)) {
                    observer.disconnect();
                    handleElementDisappear(element);
                }
            } catch (error) {
                console.log('监听元素自身被移除失败：', { error });
                startObservation(); // 重新开始监听
            }
        });

        // 5. 监听元素父级变化
        if (element.parentElement) {
            elementObserver.observe(element.parentElement, {
                childList: true
            });
        } else {
            console.info('元素没有父级，无法监听父级变化');
        }
    }

    // 处理元素消失
    function handleElementDisappear(element) {
        onDisappear?.(element);
        element = null;
        // 6. 重启监听流程
        startObservation();
    }

    // 启动初始监听
    startObservation();
}



// 目标元素选择器
const targetSelector = '#observeBtn';

// 启动
observeElementPresence(
    targetSelector,
    (element) => {
        console.log('元素出现:', { element });
    },
    (element) => {
        console.log('元素消失:', { element });
    }
);

// 监听错误
window.onerror = function (message, source, lineno, colno, error) {
    console.log('出现报错, 重新监控');
    observeElementPresence(
        targetSelector,
        (element) => {
            console.log('元素出现:', { element });
        },
        (element) => {
            console.log('元素消失:', { element });
        }
    );
};


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