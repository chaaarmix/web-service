const bookStorage = require('../storage/bookStorage');
const {
    NotFoundError,
    ValidationError
} = require('../utils/errors');

function getAllBooks(req, res) {
    const books = bookStorage.getAll();
    res.json(books);
}

function getBookById(req, res) {
    const id = parseInt(req.params.id);

    const book = bookStorage.getById(id);
    if (!book) {
        throw new NotFoundError(`Book with id ${id} not found`);
    }

    res.json(book);
}

function createBook(req, res) {
    const { title, pages } = req.body;

    if (!title || title.trim() === '') {
        throw new ValidationError('Title must not be empty');
    }

    if (title.length > 100) {
        throw new ValidationError('Title must be less than 100 characters');
    }

    if (!pages || pages <= 0) {
        throw new ValidationError('Pages must be greater than 0');
    }

    const newBook = bookStorage.create({ title, pages });
    res.status(201).json(newBook);
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook
};