const express = require('express');
const bookRoutes = require('./routes/bookRoutes');

const requestIdMiddleware = require('./middlewares/requestIdMiddleware');
const timingMiddleware = require('./middlewares/timingMiddleware');
const { loggingMiddleware, getLogs } = require('./middlewares/loggingMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const PORT = 3000;

app.use(express.json());

// 🔹 Middleware конвейер
app.use(requestIdMiddleware);
app.use(timingMiddleware);
app.use(loggingMiddleware);

// 🔹 Главная страница с UI
app.get('/', (req, res) => {
    res.send(`
    <html>
      <head>
        <title>API Monitor</title>
        <style>
          body { font-family: Arial; display: flex; height: 100vh; margin: 0; }
          .panel { width: 50%; padding: 20px; overflow-y: auto; }
          .left { background: #f4f4f4; }
          .right { background: #1e1e1e; color: #b200ff; font-family: monospace; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #999; padding: 5px 10px; text-align: left; }
          th { background: #ddd; }
          button { margin-bottom: 10px; }
          input { padding: 5px; width: 150px; margin-right: 5px; }
        </style>
      </head>
      <body>
        <div class="panel left">
         <h2>All Books</h2>
         <p><em>Запрос: GET /api/items</em></p>
          <button onclick="loadItems()">Обновить таблицу</button>
          <table id="items-table">
            <thead>
              <tr><th>id</th><th>title</th><th>pages</th></tr>
            </thead>
            <tbody></tbody>
          </table>

          <h2>Book by ID</h2>
          <p><em>Запрос: GET /api/items/:id</em></p>
          <input id="bookId" placeholder="Введите id" type="number">
          <button onclick="loadSingleItem(document.getElementById('bookId').value)">Показать книгу</button>
          <pre id="single-item"></pre>

          <h2>Add New Book</h2>
          <p><em>Запрос: POST /api/items</em></p>
          <input id="newTitle" placeholder="Название книги" type="text">
          <input id="newPages" placeholder="Страниц" type="number">
          <button onclick="createBook()">Добавить книгу</button>
        </div>

        <div class="panel right">
          <h2>Logs</h2>
          <pre id="logs"></pre>
        </div>

        <script>
          async function loadItems() {
            const res = await fetch('/api/items');
            const data = await res.json();
            const tbody = document.querySelector('#items-table tbody');
            tbody.innerHTML = '';
            data.forEach(book => {
              const row = document.createElement('tr');
              row.innerHTML = \`<td>\${book.id}</td><td>\${book.title}</td><td>\${book.pages}</td>\`;
              tbody.appendChild(row);
            });
          }

          async function loadSingleItem(id) {
            if (!id) return;
            try {
              const res = await fetch('/api/items/' + id);
              const data = await res.json();
              document.getElementById('single-item').textContent =
                JSON.stringify(data, null, 2);
            } catch (err) {
              document.getElementById('single-item').textContent = err;
            }
          }

         async function createBook() {
  const title = document.getElementById('newTitle').value;
  const pages = parseInt(document.getElementById('newPages').value, 10);

  try {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, pages })
    });

    const data = await res.json();

    // отображаем в блоке single-item **любое тело ответа** — и успешный POST, и ошибку
    document.getElementById('single-item').textContent = JSON.stringify(data, null, 2);

    // если POST успешный — обновляем таблицу
    if (res.status >= 200 && res.status < 300) {
      loadItems();
    }

  } catch (err) {
    const errorObj = {
      errorCode: "NetworkError",
      message: err.message,
      requestId: "client-side"
    };
    document.getElementById('single-item').textContent = JSON.stringify(errorObj, null, 2);
  }
}
          async function loadLogs() {
            const res = await fetch('/logs');
            const data = await res.json();
            document.getElementById('logs').textContent = data.join('\\n');
          }

          // авто-обновление логов
          setInterval(() => {
            loadLogs();
          }, 1000);

          // начальная загрузка
          loadItems();
          loadLogs();
        </script>
      </body>
    </html>
  `);
});

// 🔹 API маршруты
app.use('/api/items', bookRoutes);

// 🔹 Эндпоинт логов
app.get('/logs', (req, res) => {
    res.json(getLogs());
});

// 🔹 error middleware — ВСЕГДА ПОСЛЕДНИЙ
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});