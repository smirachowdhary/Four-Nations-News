import { db } from "./firebase.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function loadArticles() {

    const articleGrid =
        document.getElementById("articleGrid");

    const trendingList =
        document.getElementById("trendingList");

    const heroImage =
        document.getElementById("heroImage");

    const heroTitle =
        document.getElementById("heroTitle");

    const heroSummary =
        document.getElementById("heroSummary");

    const breakingBanner =
        document.getElementById("breakingBanner");

    articleGrid.innerHTML = "";
    trendingList.innerHTML = "";

    const snapshot =
        await getDocs(
            collection(db, "articles")
        );

    const articles = [];

    snapshot.forEach((doc) => {

        articles.push({
            id: doc.id,
            ...doc.data()
        });

    });

    if(articles.length === 0){

        heroTitle.textContent =
            "No Articles Yet";

        heroSummary.textContent =
            "Publish your first article from the admin dashboard.";

        return;
    }

    const featuredArticle =
        articles.find(
            article => article.featured
        );

    if(featuredArticle){

        heroTitle.textContent =
            featuredArticle.title;

        heroSummary.textContent =
            featuredArticle.summary;

        if(featuredArticle.featuredImage){

            heroImage.src =
                featuredArticle.featuredImage;

        }

    }

    const breakingArticle =
        articles.find(
            article => article.breaking
        );

    if(breakingArticle){

        breakingBanner.textContent =
            "BREAKING NEWS: " +
            breakingArticle.title;

    }

    articles
    .slice(0, 5)
    .forEach(article => {

        trendingList.innerHTML += `
            <li>${article.title}</li>
        `;

    });

    const displayArticles = [];

    articles.forEach(article => {

        for(let i = 0; i < 8; i++){

            displayArticles.push(article);

        }

    });

    displayArticles.forEach(article => {

        const image =
            article.featuredImage ||
            article.image ||
            "https://picsum.photos/400/300";

        articleGrid.innerHTML += `

            <div class="card">

                <img
                    src="${image}"
                    alt="${article.title}">

                <div class="card-content">

                    <h3>
                        ${article.title}
                    </h3>

                    <p>
                        ${article.summary}
                    </p>

                    <p>

                        <strong>
                            ${article.author}
                        </strong>

                    </p>

                </div>

            </div>

        `;

    });

}

loadArticles();
