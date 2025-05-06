/*
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-06 16:11:44
 * @LastEditTime: 2025-05-06 21:58:51
 * @LastEditors: liyanminghui@codeck.ai
 * @Description: 用来监听小猫观测天空按钮出现
 * @FilePath: /miao_scripts/skyBtn-script.js
 */
// ==================== 独立的日志模块 ====================
/**
 * 创建日志记录器（独立模块）
 * @param {Object} options - 日志配置
 * @param {function} [options.formatter] - 自定义格式化函数
 * @param {function} [options.handler] - 自定义日志处理器（默认输出到控制台）
 * @param {number} [options.debounce=200] - 防抖间隔（毫秒）
 */
function createLogger(options = {}) {
    const config = {
        debounce: 200,
        formatter: (type, message, data) => ({
            timestamp: new Date().toISOString(),
            type,
            message,
            data
        }),
        handler: (formatted) => {
            const styles = {
                INFO: 'color: #4CAF50;',
                WARN: 'color: #FF9800;',
                ERROR: 'color: #f44336;',
                DEBUG: 'color: #2196F3;'
            };
            console.log(
                `%c[${formatted.type}] ${formatted.message}`,
                styles[formatted.type] || '',
                formatted.data
            );
        },
        ...options
    };

    let lastLogTime = 0;

    return {
        log: (type, message, data) => {
            const now = Date.now();
            if (now - lastLogTime < config.debounce) return;
            lastLogTime = now;

            try {
                const formatted = config.formatter(type, message, data);
                config.handler(formatted);
            } catch (error) {
                console.error('日志记录失败:', error);
            }
        }
    };
};

const logger = createLogger({
    debounce: 300,
    handler: (log) => {
        // 扩展：同时发送到服务器
        // fetch('/api/logs', {
        //     method: 'POST',
        //     body: JSON.stringify(log)
        // });
        // 保留默认控制台输出
        console.log(`[${log.type}] ${log.message}`, log.data);
    }
});

// ==================== 主功能 ====================
// 创建提示框
const alertBox = document.createElement('div');
alertBox.className = 'alert-box';
document.body.appendChild(alertBox);

// 目标元素选择器
const targetSelector = '#observeBtn';

// 记录点击次数
cur_num = 0

// 日志模块
const { log } = logger;

/**
 * 持续监听元素的出现和消失
 * @param {string} selector - 目标元素选择器（如 ".dynamic-element"）
 * @param {Function} onAppear - 元素出现时的回调
 * @param {Function} onDisappear - 元素消失时的回调（可选）
 */
function observeElementPresence(selector, onAppear, onDisappear) {
    let currentElement = null;
    let observer = null;

    log('INFO', '开始监听元素', { targetSelector });
    // 监听元素出现
    function startObservation() {
        // 1. 检查元素是否已存在
        const element = document.querySelector(selector);
        if (element) {
            handleElementAppear(element);
            return;
        }

        log('INFO', '持续监听元素', { targetSelector });
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
        alertBox.textContent = `检测到变化：${element.value}`;
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);

        // 点击按钮
        try {
            cur_num += 1;
            element.click();
            log('INFO', '按钮点击成功! 当前次数：', { cur_num });
        } catch (error) {
            log('ERROR', '按钮点击失败：', { error });
        }

        // 4. 监听元素自身被移除
        const elementObserver = new MutationObserver((observer) => {
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
        log('INFO', '元素出现:', { element });
    },
    (element) => {
        log('INFO', '元素消失:', { element });
    }
);

// 监听错误
window.onerror = function (message, source, lineno, colno, error) {
    log('INFO', '出现报错, 重新监控');
    observeElementPresence(
        targetSelector,
        (element) => {
            log('INFO', '元素出现:', { element });
        },
        (element) => {
            log('INFO', '元素消失:', { element });
        }
    );
};

// // 测试用
// observeElementPresence(
//     '#su',
//     (element) => {
//         log('INFO', '元素出现:', { element });
//     },
//     (element) => {
//         log('INFO', '元素消失:', { element });
//     }
// );
