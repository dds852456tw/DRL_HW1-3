# AI 助手對話紀錄 - DRL_HW1-3

## 2026-03-13

### 使用者請求：連接github
**助手動作：** 檢查了 `Antigravity` 目錄下的 Git 狀態。
- 發現已連接至 `https://github.com/dds852456tw/0303DRL_DIC1.git`。
- 檢查了全域設定與 SSH 金鑰。
- 建議設定正確的 `user.email` 並考慮使用 SSH 連線。

### 使用者請求：要求保存對話紀錄
**使用者指示：** 接下來請你保存所有對話紀錄在 `https://github.com/dds852456tw/DRL_HW1-3.git`，檔名是 `CHAT_LOG.md`。

**助手動作：**
- 在 `Antigravity` 目錄下建立了 `DRL_HW1-3` 專案夾。
- 初始化 Git 並連接至新倉庫 `https://github.com/dds852456tw/DRL_HW1-3.git`。
- 建立此 `CHAT_LOG.md` 檔案。

## 2026-03-13 (續)

### 使用者請求：實作 HW1-3 Value Iteration
**題目要求：**
1. 實現價值迭代算法 (Value Iteration) 並計算最佳政策。
2. 顯示最佳政策（以行動箭頭取代隨機行動）。
3. 顯示價值函數 V(s)。
4. 使用 Flask (後端) 與 HTML/CSS (前端) 建立交互式網格。
5. 支援設置起始點、終點、障礙物，並視覺化政策變化。
6. 考慮折扣因子 $\gamma$。

**助手動作：**
1. **建立後端 (`app.py`)**：
   - 使用 Flask 框架。
   - 實作 `ValueIterationGrid` 類別，根據 Bellman 方程式計算 $V(s)$ 與最佳政策。
   - 設定獎勵機制：抵達終點為正獎勵 (+100)，每步移動為微量負獎勵 (-0.1) 以尋求最短路徑。
2. **建立前端 (`index.html`, `style.css`, `script.js`)**：
   - 採用現代化設計 (Glassmorphism, Google Fonts)。
   - 實作互動式網格，點擊可切換「起點」、「終點」、「障礙物」。
   - 使用 AJAX (`fetch`) 與後端通訊，並動態更新箭頭與價值數值。
3. **部署與提交**：
   - 安裝必要依賴 (`flask`, `numpy`)。
   - 將所有代碼推送到 GitHub 倉庫。

---

*接下來將在此紀錄後續的功課要求與進度。*
