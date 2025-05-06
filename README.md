<!--
 * @Author: liyanminghui@codeck.ai
 * @Date: 2025-05-06 17:25:02
 * @LastEditTime: 2025-05-06 17:25:18
 * @LastEditors: liyanminghui@codeck.ai
 * @Description: 
 * @FilePath: /miao_scripts/README.md
-->
# Game Script 浏览器扩展 v1.0

基于Chrome扩展manifest V3规范的脚本注入工具，自动在指定页面加载定制化样式和交互脚本。

## 功能特性
🎯 自动匹配目标页面：https://lolitalibrary.com/maomao/*
🎨 动态样式注入（alert.css）
🛠️ 脚本功能扩展（skyBtn-script.js）
🔌 Manifest V3 安全架构

## 安装步骤
1. 克隆本仓库
2. 打开Chrome浏览器
3. 访问 chrome://extensions/
4. 启用"开发者模式" 
5. 点击"加载已解压的扩展程序"
6. 选择本项目目录

## 使用方法
1. 安装扩展后访问目标页面
2. 页面将自动加载定制样式和脚本
3. 查看控制台输出获取运行状态（F12 > Console）

## 开发说明
```bash
# 调试脚本
chrome://extensions/ > 点击对应扩展的"检查视图背景页"

# 修改样式后需要：
chrome.runtime.reload()
```

## 版本日志
### 1.0 (2024-05-06)
- 初始发布版本
- 支持目标页面自动注入
- 基础样式和脚本功能

## 许可证
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
