const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const booksApiUrl = "https://www.googleapis.com/books/v1/volumes?q=";

// 📚 Поиск книги по названию
router.get("/search/:query", async (req, res) => {
    try {
        const query = req.params.query;
        const response = await axios.get(`${booksApiUrl}${query}&key=${GOOGLE_BOOKS_API_KEY}`);
        const books = response.data.items || [];

        res.render("googleBooks", { books, user: req.session.user || null });
    } catch (error) {
        console.error("Ошибка при получении данных из Google Books API:", error);
        res.status(500).render("error", { message: "Ошибка при поиске книг", user: req.session.user || null });
    }
});

module.exports = router;
