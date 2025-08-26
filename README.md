# environment
  - vue 3
  - nuxt 3
  - vite
  - deploy: gh-pages

# step
  1. 拉下專案： `git clone https://github.com/yangyangisgood/chen-and-yang.git`
  2. 安裝npm套件： `npm ci`（不建議使用 `npm install`）
  3. 在根目錄建立.env檔，存放OpenAI token
  4. 開發模式： `npm run dev`
  5. 佈署： `npm run deploy`

# document structure
  - 頁面放在 /pages
  - 元件放在 /components
  - 頁面使用圖片放在 /public/image，請勿放在pages內的資料夾（為了讓gh-pages打包對應路徑）
  - 共用樣式放在 /asstes/css/style.css

# rules
  - use TypeScript ESLint
  - rule of three: 元件使用三次以上再寫進components
  - 頁面style一律限定scoped，若有多個頁面的共用樣式再寫進 /assets/style/style.css
