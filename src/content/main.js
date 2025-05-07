/*
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-07 14:29:19
 * @LastEditTime: 2025-05-07 17:15:39
 * @LastEditors: liyanminghui@codeck.ai
 * @Description: 主功能脚本
 * @FilePath: /miao_scripts/src/content/main.js
 */
// import observeElementPresence from './observeElement.js';


// 监听观测天空

// // 目标元素选择器
// const targetSelector = '#su';

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