# Мини-библиотека с конвейером обработки запросов

<strong>Описание проекта</strong><br>
Проект реализует <strong>мини-библиотеку</strong> на Node.js с веб-службой и визуальным интерфейсом для тестирования. Главная цель — показать, как проходит запрос через <strong>middleware-конвейер</strong>, где каждый шаг делает одну понятную вещь:<br><br>

- <strong>Логирование</strong> запросов и ответов с уникальными идентификаторами.<br>
- <strong>Обработка ошибок</strong> с единым форматом (<code>errorCode</code>, <code>message</code>, <code>requestId</code>).<br>
- <strong>Измерение времени выполнения</strong> запроса и добавление его в журнал.<br><br>

Данные книг хранятся в <strong>памяти процесса (RAM)</strong>, что упрощает демонстрацию работы. При перезапуске сервера все данные теряются.<br><br>

<strong>Эндпоинты</strong><br>
1. <strong>GET /api/items</strong> — получение списка всех книг.<br>
2. <strong>GET /api/items/:id</strong> — получение книги по идентификатору, либо ошибка <code>NotFoundError</code>.<br>
3. <strong>POST /api/items</strong> — добавление новой книги с проверкой правил: название не пустое, количество страниц ≥ 0. Нарушение правил возвращает <code>ValidationError</code>.<br><br>

---


<strong>Установка и запуск</strong><br>
<ol>
<li>Клонируйте репозиторий:<br>
<code>git clone &lt;URL_репозитория&gt;<br>cd &lt;папка_проекта&gt;</code></li>
<li>Установите зависимости:<br>
<code>npm install</code></li>
<li>Запустите сервер:<br>
<code>node index.js</code></li>
<li>Откройте браузер и перейдите по адресу:<br>
<code>http://localhost:3000</code></li>
</ol>
Интерфейс позволяет просматривать книги, добавлять новые и наблюдать логи в реальном времени.

---

<strong>Интерфейс и примеры работы</strong><br>

<h3>All Books</h3>
<strong>Запрос:</strong><br>
<code>GET /api/items</code><br>
<strong>Интерфейс:</strong> таблица всех книг с колонками <code>id</code>, <code>title</code>, <code>pages</code>.<br>
Кнопка <strong>Обновить таблицу</strong>.<br>
<strong>Пример ответа:</strong><br>
<pre>
[
  { "id": 1, "title": "Название книги", "pages": 464 }
]
</pre>

<h3>Book by ID</h3>
<strong>Запрос:</strong><br>
<code>GET /api/items/:id</code><br>
<strong>Интерфейс:</strong> поле ввода ID книги + кнопка <strong>Показать книгу</strong> + блок для JSON-ответа.<br>
<strong>Пример успешного ответа:</strong><br>
<pre>
{ "id": 1, "title": "Название книги", "pages": 464 }
</pre>
<strong>Пример ошибки при отсутствии книги:</strong><br>
<pre>
{
  "errorCode": "NotFound",
  "message": "Book with id 99 not found",
  "requestId": "5a1128db-3f10-43e0-9d1e-1859152fb29a"
}
</pre>

<h3>Add New Book</h3>
<strong>Запрос:</strong><br>
<code>POST /api/items</code><br>
<code>Content-Type: application/json</code><br>
<code>{"title": "Название книги", "pages": 464}</code><br>
<strong>Интерфейс:</strong> два поля для ввода, кнопка <strong>Добавить книгу</strong>, отображение результата или ошибки.<br>
<strong>Пример ошибки валидации:</strong><br>
<pre>
{
  "errorCode": "ValidationError",
  "message": "Title cannot be empty and pages must be non-negative",
  "requestId": "f2c7a7da-88d1-4b44-bc91-1a8f8b2c8f5c"
}
</pre>

---

<strong>Проверка работы</strong><br>
1. Создайте несколько книг через POST-запрос или интерфейс.<br>
2. Получите все книги через GET `/api/items`.<br>
3. Попробуйте получить несуществующую книгу — должен вернуться `NotFoundError`.<br>
4. Проверьте логи: каждая операция записана с `requestId` и временем выполнения.<br>
5. Перезапустите сервер — все данные исчезнут, так как используются RAM-хранилище.<br>

---

<strong>Особенности реализации</strong><br>
- Middleware-конвейер делает код структурированным, расширяемым и позволяет добавлять новые этапы обработки без изменения основной логики.<br>
- Данные хранятся в RAM для демонстрации, но при масштабировании необходимо использовать базу данных.<br>
- Единый формат ошибок упрощает отладку и клиентскую обработку.<br>
- В интерфейсе реализована визуализация логов и данных книг в реальном времени.<br>

