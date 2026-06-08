import { db } from "./firebase.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const params =
    new URLSearchParams(
        window.location.search
    );

const queryText =
    params.get("q")
    ?.toLowerCase() || "";

document.getElementById(
    "searchTitle"
).textContent =
    `Results for "${queryText}"`;

loadResults();

async function loadResults(){

    const articleGrid =
        document.getElementById(
            "articleGrid"
        );

    const snapshot =
        await getDocs(
            collection(
                db,
                "articles"
            )
        );

    articleGrid.innerHTML = "";

    snapshot.forEach(doc=>{

        const article =
            doc.data();

        const matches =

            article.title
            ?.toLowerCase()
            .includes(queryText)

            ||

            article.summary
            ?.toLowerCase()
            .includes(queryText)

            ||

            article.content
            ?.toLowerCase()
            .includes(queryText)

            ||

            article.author
            ?.toLowerCase()
            .includes(queryText);

        if(!matches){
            return;
        }

        articleGrid.innerHTML += `

        <a
            href="article.html?id=${doc.id}"
            class="article-link"
        >

            <div class="card">

                <img
                    src="${
                        article.featuredImage ||
                        "https://picsum.photos/500"
                    }"
                >

                <div class="card-content">

                    <h3>
                        ${article.title}
                    </h3>

                    <p>
                        ${article.summary}
                    </p>

                </div>

            </div>

        </a>

        `;

    });

}
