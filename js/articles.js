import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function loadArticles() {

    const articleGrid =
        document.getElementById("articleGrid");

    articleGrid.innerHTML = "";

    const querySnapshot =
        await getDocs(collection(db, "articles"));

    const articles = [];

    querySnapshot.forEach((doc) => {

        const article = doc.data();

        for(let i = 0; i < 6; i++){
            articles.push(article);
        }

    });

    articles.forEach((article) => {

        articleGrid.innerHTML += `
            <div class="card">

                <img src="${article.image}" alt="Article Image">

                <div class="card-content">

                    <h3>${article.title}</h3>

                    <p>${article.summary}</p>

                    <p>
                        <strong>${article.author}</strong>
                    </p>

                </div>

            </div>
        `;

    });
}

loadArticles();
