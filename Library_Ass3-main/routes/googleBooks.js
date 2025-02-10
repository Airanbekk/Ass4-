const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const booksApiUrl = "https://www.googleapis.com/books/v1/volumes?q=";

// 📚 Популярные книги по жанрам
const categories = [
    { name: "Фантастика", query: "subject:science fiction" },
    { name: "Детективы", query: "subject:detective" },
    { name: "Фэнтези", query: "subject:fantasy" },
    { name: "Романы", query: "subject:romance" },
    { name: "История", query: "subject:history" }
];

router.get("/popular", async (req, res) => {
    try {
        const categoryResults = await Promise.all(
            categories.map(async (category) => {
                const response = await axios.get(`${booksApiUrl}${category.query}&key=${GOOGLE_BOOKS_API_KEY}`);
                const books = response.data.items?.slice(0, 5).map(item => ({
                    title: item.volumeInfo.title || "Без названия",
                    author: item.volumeInfo.authors?.join(", ") || "Неизвестный автор",
                    image: item.volumeInfo.imageLinks?.thumbnail || "/default-cover.jpg"
                })) || [];

                return { name: category.name, books };
            })
        );

        res.render("popularBooks", { categories: categoryResults });
    } catch (error) {
        console.error("Ошибка при получении популярных книг:", error);
        res.status(500).render("error", { message: "Ошибка при загрузке популярных книг", user: req.session.user || null });
    }
});

module.exports = router;
