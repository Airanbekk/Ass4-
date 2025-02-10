const express = require("express");
const axios = require("axios");
require("dotenv").config();

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const router = express.Router();
const booksApiUrl = "https://www.googleapis.com/books/v1/volumes?q=";

// 📚 Популярные книги по категориям
const categories = ["Fiction", "Mystery", "Fantasy", "Science", "History"];

router.get("/popular", async (req, res) => {
    try {
        const categoryPromises = categories.map(async (category) => {
            const response = await axios.get(`${booksApiUrl}subject:${category}&maxResults=5&key=${GOOGLE_BOOKS_API_KEY}`);
            return { category, books: response.data.items || [] };
        });

        const popularBooks = await Promise.all(categoryPromises);

        res.render("popularBooks", { popularBooks, user: req.session.user || null });
    } catch (error) {
        console.error("Ошибка при получении популярных книг:", error);
        res.status(500).render("error", { message: "Ошибка при загрузке популярных книг", user: req.session.user || null });
    }
});

module.exports = router;
