// 当popup页面加载完成时
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有设置元素
    const autoPlayEnabled = document.getElementById('autoPlayEnabled');
    const delayTime = document.getElementById('delayTime');
    const retryCount = document.getElementById('retryCount');
    const saveButton = document.getElementById('saveSettings');

    // 从storage中加载保存的设置
    chrome.storage.sync.get({
        autoPlayEnabled: false,
        delayTime: 2,
        retryCount: 3
    }, function(items) {
        autoPlayEnabled.checked = items.autoPlayEnabled;
        delayTime.value = items.delayTime;
        retryCount.value = items.retryCount;
    });

    // 保存设置
    saveButton.addEventListener('click', function() {
        chrome.storage.sync.set({
            autoPlayEnabled: autoPlayEnabled.checked,
            delayTime: parseInt(delayTime.value),
            retryCount: parseInt(retryCount.value)
        }, function() {
            // 显示保存成功的提示
            saveButton.textContent = '已保存';
            saveButton.style.backgroundColor = '#4CAF50';
            
            // 2秒后恢复按钮原样
            setTimeout(() => {
                saveButton.textContent = '保存设置';
                saveButton.style.backgroundColor = '#2196F3';
            }, 2000);
        });
    });
});
