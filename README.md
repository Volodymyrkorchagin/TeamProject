🥗 Fitness & Nutrition Web App

Веб-додаток для трекінгу харчування та фізичної активності. Дозволяє шукати продукти, розраховувати калорійність та КБЖУ, а також керувати базою даних продуктів (додавання, редагування, видалення).

🎨 Design & Layout

Макет проєкту розроблено у Figma:
https://www.figma.com/design/Y6o1uSMnvNhlU8XUgxbxvn/Untitled?node-id=0-1&t=7NoHf3AMhO8lRVcr-1

🚀 Технологічний стек

Frontend: React.js, JavaScript (ES6+), HTML5, CSS3
Backend API: .NET / C# ASP.NET Web API (підключено через Ngrok)
Автентифікація: JWT Token (збереження в `localStorage`)

✨ Основні можливості

Пошук продуктів: Зручний фільтр за назвою в реальному часі.
Розрахунок КБЖУ: Інтерактивні степери для коригування калорій, білків, жирів та вуглеводів з вибором одиниць виміру (грам, мг, ккал).
Управління даними (CRUD): 
`POST /api/Products` — додавання нових продуктів (`PascalCase` формат).
`DELETE /api/Products/delete/{id}` — видалення продуктів.

🛠 Інструкція з локального запуску

1. Клонування репозиторію
git clone [https://github.com/Volodymyrkorchagin/TeamProject.git](https://github.com/Volodymyrkorchagin/TeamProject.git)
cd TeamProject

3. Встановити всі потрібні бібліотеки (залежності)
npm install

3. Запустити локальний сервер розробки
npm start
