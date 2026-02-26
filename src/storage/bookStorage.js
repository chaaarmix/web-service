let books = [];
let currentId = 1;

function getAll() {
    return books;
}

function getById(id) {
    return books.find(b => b.id === id);
}

function create(bookData) {
    const newBook = {
        id: currentId++,
        ...bookData
    };

    books.push(newBook);
    return newBook;
}

module.exports = {
    getAll,
    getById,
    create
};