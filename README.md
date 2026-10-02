# AI 工作坊示範遊戲（Gemini Canvas × Google Apps Script）

香港中學教師工作坊「用 Gemini Canvas 製作跨學科網上小遊戲，再用 Google Apps Script 追蹤學習數據」嘅示範作品。

| 示範 | 網址 | 內容 |
|---|---|---|
| 示範一 | https://danielshtong.github.io/ai-workshop-demos/demo1/ | 中二科學 10 題選擇題遊戲（計時、進度條、即時回饋、再玩一次） |
| 示範二 | https://danielshtong.github.io/ai-workshop-demos/demo2/ | 同一遊戲加開始畫面（班別、學號、姓名），完成後將成績 POST 去 Google Sheet |

## 點樣改成自己學科
- 每個遊戲都係單一 HTML 檔案，冇任何外部依賴。
- 題目放喺 `<script>` 頂部嘅 `QUESTIONS` 陣列：`{ question, options: [4 個選項], answer: 正確選項索引(0–3), explanation }`。只換題目，唔使改其他程式。

## 示範二：連接 Google Sheet
1. 開一個 Google Sheet，「擴充功能」>「Apps Script」，貼上 [`demo2/Code.gs`](demo2/Code.gs)。
2. 「部署」>「新增部署」> 網頁應用程式；執行身分「我」，存取權「所有人」。
3. 複製以 `/exec` 結尾嘅網址，貼入 `demo2/index.html` 頂部嘅 `SCRIPT_URL`。
4. 遊戲用 `fetch`（`mode: 'no-cors'`、`Content-Type: text/plain;charset=utf-8`）傳送 JSON：
   `{ timestamp, class, studentNo, name, score, total, timeSpent, wrongItems }`，
   寫入「記錄」工作表：時間、班別、學號、姓名、分數、總分、用時（秒）、錯題。

> 私隱提示：盡量只收學號或化名，唔好收敏感個人資料，並遵從學校私隱政策。
