import { db } from "./firebase.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const searchInput =
    document.getElementById(
        "search"
    );

const searchModal =
    document.getElementById(
        "searchModal"
    );

const searchResults =
    document.getElementById(
        "searchResults"
    );

const closeSearch =
    document.getElementById(
        "closeSearch"
    );

let articles = [];

async function loadArticles(){

    const snapshot =
        await getDocs(
            collection(
                db,
                "articles"
            )
        );

    snapshot.forEach(
        articleDoc => {

            articles.push({

                id:articleDoc.id,

                ...articleDoc.data()

            });

        }
    );

}

loadArticles();

searchInput.addEventListener(
    "focus",
    () => {

        searchModal.style.display =
            "flex";

    }
);

closeSearch.addEventListener(
    "click",
    () => {

        searchModal.style.display =
            "none";

        searchInput.value = "";

        searchResults.innerHTML = "";

    }
);

searchInput.addEventListener(
    "input",
    () => {

        const value =
            searchInput.value
            .toLowerCase();

        searchResults.innerHTML = "";

        if(!value){
            return;
        }

        const matches =
            articles.filter(article =>

                article.title
                ?.toLowerCase()
                .includes(value)

                ||

                article.summary
                ?.toLowerCase()
                .includes(value)

            );

        matches.slice(0,10)
        .forEach(article => {

            searchResults.innerHTML += `

            <a
                href="article.html?id=${article.id}"
                class="search-result"
            >

                <img
                    src="${
                        article.featuredImage
                        ||
                        "https://picsum.photos/200"
                    }"
                >

                <div>

                    <h3>
                        ${article.title}
                    </h3>

                    <p>
                        ${article.category}
                    </p>

                </div>

            </a>

            `;

        });

    }
);
