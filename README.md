# 捲線器誤差換算｜手機網頁版

簡單的捲線器米數換算工具，適合手機與電腦瀏覽器使用。使用 HTML、CSS 和 JavaScript 製作，無須安裝套件或執行建置。

## 功能

- 第一組：現有米數 × 倍數 = 實際米數，預設倍數為 **0.66**。
- 第二組：實際米數 × 倍數 = 要放米數，預設倍數為 **1.5**。
- 每組由左到右依序為輸入米數、換算結果、可修改的倍數。
- 點選米數或倍數，開啟數字鍵盤，可輸入整數或小數。
- 確定輸入後立即換算；取消則保留原值。
- 倍數保存在目前瀏覽器的 `localStorage`，重新開啟後會讀取。
- 「清空米數」將兩組米數歸零，保留倍數。
- 使用十進位整數運算，避免常見的浮點數顯示誤差。

例如：輸入 `100`、倍數 `0.66`，結果為 `66` 米。

## 電腦開啟

在 Windows 雙擊 `啟動.cmd` 或 `開啟手機網頁.cmd`，即可用預設瀏覽器開啟。

也可以直接用瀏覽器開啟 `mobile/dist/index.html`。建議使用近期版本的 Chrome、Edge 或 Safari。

## 手機開啟（同一個區域網路）

1. 手機與 Windows 電腦連上同一個 Wi-Fi 或可互通的區域網路。
2. 在電腦雙擊 `啟動手機連線.cmd`。
3. 在手機瀏覽器輸入視窗顯示的網址，例如 `http://192.168.1.100:8765`。請以視窗實際顯示的 IP 為準。
4. 使用期間保持電腦開機，且伺服器視窗維持開啟。按 `Ctrl+C` 可停止服務。

電腦也可透過 `http://localhost:8765` 預覽。若手機無法連線，請確認網路可互通，且 Windows 防火牆允許該連線；訪客 Wi-Fi 或公司網路可能限制裝置互連。

若預設連接埠已被占用，可在專案目錄執行：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\serve-mobile.ps1 -Port 8888
```

此時手機網址的連接埠改為 `8888`。

## 部署成線上網頁

上傳 Git 儲存庫只會保存程式碼，仍需要靜態網站代管服務，才能提供手機直接開啟的線上網址。

本專案的網站檔案是 `mobile/dist/index.html`，可部署到支援靜態 HTML 的服務。若代管服務要求設定：

| 項目 | 設定 |
| --- | --- |
| 網站目錄／發布目錄 | `mobile/dist` |
| 首頁 | `index.html` |
| 建置命令 | 留空，無須建置 |
| 套件安裝 | 不需要 |

若代管服務要求選擇網站根目錄，請將根目錄設為 `mobile/dist`，並以該目錄作為發布內容。GitHub Pages 不支援直接選擇任意子目錄，使用它時需另外設定 Actions 部署，或將 `mobile/dist` 的內容放到發布分支的根目錄。

部署後，手機可直接開啟代管服務提供的網址，電腦不需要持續開機。

## 檔案結構

```text
.
├── README.md                 # 使用與部署說明
├── .gitignore                # Git 排除規則
├── 啟動.cmd                  # 在電腦開啟網頁
├── 開啟手機網頁.cmd          # 在電腦開啟網頁
├── 啟動手機連線.cmd          # 啟動區域網路伺服器
├── serve-mobile.ps1           # Windows 區域網路伺服器
├── converter.ps1              # 原 Windows 視窗版
└── mobile/
    ├── check.mjs              # 網頁功能檢查
    └── dist/
        └── index.html         # 完整手機網頁，含樣式與程式
```

目前 `啟動.cmd` 開啟的是網頁版。若需要原 Windows 視窗版，可執行：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -STA -File .\converter.ps1
```

## 功能檢查

已安裝 Node.js 的環境，可在專案目錄執行：

```sh
node mobile/check.mjs
```

檢查涵蓋小數換算、數字鍵盤、倍數儲存與重新讀取、無效輸入、取消輸入及清空米數。這是程式層級的檢查；手機的實際排版與觸控操作仍需在目標裝置確認。

## 上傳 Git

在 Git 平台建立空白儲存庫，再於已安裝 Git 的電腦、專案目錄中執行：

```sh
git init
git add .
git commit -m "Add mobile reel length converter"
git branch -M main
git remote add origin <你的儲存庫網址>
git push -u origin main
```

請將 `<你的儲存庫網址>` 替換為實際 HTTPS 或 SSH 儲存庫網址。這些指令適用於尚未初始化的新專案。

`.gitignore` 會排除本機工具、暫存檔、Windows 版的個人倍數設定，以及本機 Sites 代管設定。網頁檔 `mobile/dist/index.html` 需要提交，請勿將此專案的 `dist` 目錄排除。

## 資料與使用限制

- 米數與倍數限非負數，每次輸入最多 24 個字元（含小數點）。
- 兩組換算獨立計算，倍數也各自設定。
- 網頁計算在瀏覽器內完成，不會將輸入米數傳送到伺服器。
- 倍數依裝置、瀏覽器及網站來源分開保存；更換網址或清除網站資料後，不會沿用原設定。
- 若瀏覽器禁止儲存，仍可換算，但下次開啟可能使用預設倍數。
