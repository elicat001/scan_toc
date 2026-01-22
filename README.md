# 棠小一 (Tang Xiao Yi) - 高级移动端点餐系统

这是一个基于 React 19 和 TypeScript 构建的、面向生产环境标准的移动端点餐应用。本项目不仅实现了完整的业务闭环（扫码点餐、自取、外送、会员中心），更在前端工程化、数据精确性以及交互稳定性上做了深度优化。

## 🌟 核心业务功能

-   **多模式点餐**：支持扫码堂食（Scan to Order）、门店自取（Pickup）及外送服务（Delivery）。
-   **智能购物车**：基于规格（Specs）自动生成唯一标识，支持同商品不同规格并存。
-   **会员体系**：集成会员码、储值中心（Top-up）、积分商城（Points Mall）及 VIP 权益系统。
-   **交易链路**：高交互的订单确认页，包含自动最优券推荐、支付状态机管理、防重复下单逻辑。
-   **AI 辅助**：集成 Google Gemini API，根据菜单提供智能化推荐服务。

## 🏗️ 工程化亮点（P0 级设计）

本项目拒绝“Demo 式代码”，采用了一系列工业级前端解决方案：

### 1. 财务级金额处理 (`amountCent`)
为规避 JavaScript 浮点数运算产生的精度误差（如 `0.1 + 0.2 !== 0.3`），系统全链路采用 **Integer Cent（分）** 作为基本单位。仅在 UI 渲染层进行 `/ 100` 格式化。

### 2. 领域驱动设计 (DDD) 与 DTO 映射
-   **Domain Model**：前端业务逻辑专用的不变量模型（如 `CartItem`）。
-   **DTO (Data Transfer Object)**：严格定义后端契约（如 `CreateOrderPayloadDTO`）。
-   **Mapping Utility**：通过 `mapCartToOrderItems` 实现模型转换，确保“再来一单”等功能的数据一致性。

### 3. 高级副作用管理
-   **竞态保护**：在 `useCheckout` 中通过 `reqSeq` 机制处理异步数据加载，防止旧请求覆盖新交互。
-   **状态机驱动支付**：支付流程采用明确的状态机管理（`idle` -> `creating` -> `paying` -> `success/failed`），并针对失败原因（余额不足、库存不足）提供差异化的 CTA 引导。

### 4. 交互与动效
-   使用 Tailwind CSS 结合 `animate-in` 实现丝滑的 Modal 弹出与列表入场。
-   针对订单状态（制作中、配送中）实现了可视化的进度模拟。

## 🛠️ 技术栈

-   **核心框架**: React 19 (ESM Mode)
-   **开发语言**: TypeScript (Strict Mode)
-   **样式方案**: Tailwind CSS (移动端优先)
-   **图标库**: Lucide React
-   **AI 集成**: @google/genai (Gemini 3 Flash)

## 📂 目录结构规范

```text
src/
├── components/          # 跨页面通用 UI 组件 (Header, Toast, Skeleton)
├── domain/              # 核心业务逻辑与模型转换 (Mapping, Business Rules)
├── features/            # 复杂业务功能模块化 (Checkout)
│   └── checkout/        # 包含私有组件、Hooks、计算逻辑及类型
├── hooks/               # 全局共享 Hooks (useCart)
├── services/            # 数据层 (API 定义, HTTP 封装, DTO 定义)
├── views/               # 页面级容器组件
├── types.ts             # 全局强类型定义
└── App.tsx              # 路由编排与全局 Context
```

## 🚀 快速开始

1.  **环境配置**：确保拥有有效的 `process.env.API_KEY` 以启用 AI 推荐功能。
2.  **开发模式**：应用基于标准 ESM 模块运行，直接通过 Vite 或类似工具启动 index.html 即可。
3.  **编译检查**：
    ```bash
    npm run typecheck  # 验证类型系统的健壮性
    ```

---

**棠小一** - *匠心烘焙与精品咖啡，用工程化思维重构用户体验。*
