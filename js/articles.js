import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let allArticles = [];
let currentCategory = "ALL";

async function loadSiteSettings(){

    const siteRef =
        doc(db, "settings", "site");

    const siteSnap =
        await getDoc(siteRef);

    if(!siteSnap.exists()) return;

    const settings =
        siteSnap.data();

    const quoteBox =
        document.querySelector(".quote-card blockquote");

    const quoteAuthor =
        document.querySelector(".quote-card p");

    const spotlightTitle =
        document.querySelector(".spotlight-card h3");

    const spotlightText =
        document.querySelector(".spotlight-card p");

    const spotlightImage =
        document.getElementById("spotlightImage");

    if(quoteBox){
        quoteBox.textContent =
            `"${settings.quoteText || ""}"`;
    }

    if(quoteAuthor){
        quoteAuthor.textContent =
            `— ${settings.quoteAuthor || ""}`;
    }

    if(spotlightTitle){
        spotlightTitle.textContent =
            settings.spotlightName || "";
    }

    if(spotlightText){
        spotlightText.textContent =
            settings.spotlightDescription || "";
    }

    if(
        spotlightImage &&
        settings.spotlightImage
    ){
        spotlightImage.src =
            settings.spotlightImage;
    }

}

async function loadArticles(){

    const snapshot =
        await getDocs(
            collection(db, "articles")
        );

    allArticles = [];

    snapshot.forEach((doc) => {

        allArticles.push({
            id: doc.id,
            ...doc.data()
        });

    });

    allArticles.sort(
        (a,b) =>
            (b.createdAt || 0) -
            (a.createdAt || 0)
    );

    setupHero();
    setupBreaking();
    setupTrending();
    updateStats();
    renderArticles();

}

function setupHero(){

    const featured =
        allArticles.find(
            article => article.featured
        );

    if(!featured) return;

    document.getElementById(
        "heroTitle"
    ).textContent =
        featured.title;

    document.getElementById(
        "heroSummary"
    ).textContent =
        featured.summary;

    if(featured.featuredImage){

        document.getElementById(
            "heroImage"
        ).src =
            featured.featuredImage;

    }

}

function setupBreaking(){

    const breaking =
        allArticles.find(
            article => article.breaking
        );

    if(!breaking) return;

    document.getElementById(
        "breakingBanner"
    ).textContent =
        "BREAKING NEWS: " +
        breaking.title;

}

function setupTrending(){

    const trendingList =
        document.getElementById(
            "trendingList"
        );

    if(!trendingList) return;

    trendingList.innerHTML = "";

    allArticles
        .slice(0,5)
        .forEach(article => {

            trendingList.innerHTML += `
                <li>${article.title}</li>
            `;

        });

}

function updateStats(){

    const articleCount =
        document.getElementById(
            "articleCount"
        );

    if(articleCount){

        articleCount.textContent =
            allArticles.length;

    }

}

function renderArticles(){

    const articleGrid =
        document.getElementById(
            "articleGrid"
        );

    if(!articleGrid) return;

    articleGrid.innerHTML = "";

    let articles =
        [...allArticles];

    const search =
        document
        .getElementById("search")
        ?.value
        ?.toLowerCase() || "";

    if(currentCategory !== "ALL"){

        articles =
            articles.filter(
                article =>
                    article.category ===
                    currentCategory
            );

    }

    if(search){

        articles =
            articles.filter(article =>

                article.title
                ?.toLowerCase()
                .includes(search)

                ||

                article.summary
                ?.toLowerCase()
                .includes(search)

                ||

                article.content
                ?.toLowerCase()
                .includes(search)

            );

    }

    articles.forEach(article => {

        articleGrid.innerHTML += `

        <a
            href="article.html?id=${article.id}"
            style="
                text-decoration:none;
                color:inherit;
            ">

            <div class="card">

                <img
                    src="${
                        article.featuredImage ||
                        "https://picsum.photos/500"
                    }">

                <div class="card-content">

                    <h3>${article.title}</h3>

                    <p>${article.summary}</p>

                    <p>
                        <strong>
                            ${article.author}
                        </strong>
                    </p>

                </div>

            </div>

        </a>

        `;

    });

}

function setupSearch(){

    const searchBox =
        document.getElementById(
            "search"
        );

    if(!searchBox) return;

    searchBox.addEventListener(
        "input",
        renderArticles
    );

}

function setupCategories(){

    document
    .querySelectorAll(
        "nav a[data-category]"
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            (e) => {

                e.preventDefault();

                currentCategory =
                    link.dataset.category;

                renderArticles();

            }
        );

    });

}

loadSiteSettings();
loadArticles();
setupSearch();
setupCategories();
