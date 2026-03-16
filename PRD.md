產品需求文件（PRD）
### 1. 產品概述

產品名稱
GearLog

產品描述
GearLog 是一個讓吉他手整理與管理器材收藏的網站平台。
使用者可以記錄自己的吉他、效果器、擴大機等設備資訊，並可選擇將部分器材公開展示給其他人瀏覽。

此專案的主要目的：

建立一個完整的全端 Web 應用

展示前端、資料庫與身份驗證能力

部署一個可實際使用的作品集專案

### 2. 目標使用者
主要使用者

吉他玩家，希望：

管理自己的器材收藏

記錄器材資訊

紀錄購買價格與日期

展示自己的設備

次要使用者

對吉他設備有興趣的人，希望：

瀏覽其他玩家的器材

發現新設備

### 3. 產品範圍（MVP）

第一版產品（MVP）將專注於：

使用者登入與註冊

個人器材管理

器材 CRUD（新增 / 修改 / 刪除）

公開 / 私密設定

器材圖片上傳

公開器材瀏覽

### 4. 核心功能
4.1 使用者驗證

使用者可以建立帳號並登入系統。

功能包含：

註冊

登入

登出

保持登入狀態

技術：

Supabase Auth

4.2 我的器材（My Gear）

使用者可以管理自己的器材清單。

功能：

查看自己的器材列表

新增器材

編輯器材資訊

刪除器材

上傳器材圖片

設定是否公開

4.3 器材分類

系統提供以下器材分類：

Guitar（吉他）

Pedal（效果器）

Amplifier（擴大機）

Accessory（配件）

每一個器材必須屬於一個分類。

4.4 器材詳細資訊

每筆器材資料包含：

器材名稱

品牌

型號

器材分類

購買價格

購買日期

描述 / 心得

器材圖片

公開 / 私密

狀態（持有 / 已售出 / 想購買）

4.5 公開器材瀏覽

所有訪客可以瀏覽公開的器材。

功能包含：

瀏覽公開器材

搜尋器材名稱

依品牌篩選

依分類篩選

### 5. 管理者功能（Admin）

管理者可以管理系統資料。

管理功能：

管理品牌

管理分類

管理標籤

查看使用者

管理者頁面只有 admin 角色可以存取。

### 6. 使用者情境（User Stories）
使用者登入

User Story 1

作為一名使用者
我希望可以註冊帳號
以便管理自己的器材

User Story 2

作為一名使用者
我希望可以登入系統
以便查看與管理我的器材

器材管理

User Story 3

作為一名使用者
我希望可以新增器材
以便記錄我的設備

User Story 4

作為一名使用者
我希望可以修改器材資訊
以保持資料正確

User Story 5

作為一名使用者
我希望可以刪除器材
以保持器材列表整潔

公開展示

User Story 6

作為一名使用者
我希望可以將器材設定為公開
讓其他人可以看到

User Story 7

作為一名訪客
我希望可以瀏覽公開器材
以探索不同設備

### 7. 系統架構
前端

React / Next.js

shadcn/ui

TailwindCSS

後端

Supabase

PostgreSQL

Row Level Security

部署

Vercel

檔案儲存

Supabase Storage（器材圖片）

### 8. 資料庫設計（簡化版）
users
欄位	型別
id	uuid
email	text
username	text
role	text
created_at	timestamp
gear_items
欄位	型別
id	uuid
user_id	uuid
name	text
brand_id	uuid
category_id	uuid
model	text
purchase_price	numeric
purchase_date	date
description	text
image_url	text
visibility	text
status	text
created_at	timestamp
brands
欄位	型別
id	uuid
name	text
categories
欄位	型別
id	uuid
name	text
tags
欄位	型別
id	uuid
name	text

### 9. 權限模型（Security）

使用 Supabase Row Level Security。

規則：

使用者

可以：

讀取自己的器材

修改自己的器材

刪除自己的器材

公開訪客

可以：

讀取 visibility = public 的器材

管理者

可以：

管理品牌

管理分類

管理標籤

查看所有資料

### 10. MVP 不包含的功能

以下功能不在第一版範圍：

器材評分

留言

追蹤使用者

二手交易

推薦系統

這些可以在未來版本擴展。

### 11. 未來發展方向

可能新增功能：

器材 signal chain（效果器鏈）

器材評價系統

使用者收藏

gear setup 分享

二手市場