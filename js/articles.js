import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let allArticles = [];

const params =
    new URLSearchParams(
        window.location.search
    );

const pageCategory =
    params.get("category");

async function loadSiteSettings(){

    try{

        const siteRef =
            doc(db,"settings","site");

        const siteSnap =
            await getDoc(siteRef);

        if(!siteSnap.exists()) return;

        const settings =
            siteSnap.data();

        const quoteBox =
            document.querySelector(
                ".quote-card blockquote"
            );

        const quoteAuthor =
            document.querySelector(
                ".quote-card p"
            );

        const spotlightTitle =
            document.querySelector(
                ".spotlight-card h3"
            );

        const spotlightText =
            document.querySelector(
                ".spotlight-card p"
            );

        const spotlightImage =
            document.getElementById(
                "spotlightImage"
            );

        if(quoteBox)
            quoteBox.textContent =
            `"${settings.quoteText}"`;

        if(quoteAuthor)
            quoteAuthor.textContent =
            `— ${settings.quoteAuthor}`;

        if(spotlightTitle)
            spotlightTitle.textContent =
            settings.spotlightName;

        if(spotlightText)
            spotlightText.textContent =
            settings.spotlightDescription;

        if(
            spotlightImage &&
            settings.spotlightImage
        ){
            spotlightImage.src =
            settings.spotlightImage;
        }

    }catch(error){

        console.log(error);

    }

}

async function loadArticles(){

    const snapshot =
        await getDocs(
            collection(db,"articles")
        );

    allArticles = [];

    snapshot.forEach((docSnap)=>{

        allArticles.push({

            id:docSnap.id,

            ...docSnap.data()

        });

    });

    allArticles.sort(

        (a,b)=>

        (b.createdAt || 0)

        -

        (a.createdAt || 0)

    );

    setupHero();

    setupTrending();

    updateStats();

    renderArticles();

}

function setupHero(){

    const featured =

        allArticles.find(

            article =>

            article.featured

        );

    if(!featured) return;

    const heroTitle =
        document.getElementById(
            "heroTitle"
        );

    const heroSummary =
        document.getElementById(
            "heroSummary"
        );

    const heroImage =
        document.getElementById(
            "heroImage"
        );

    if(heroTitle)
        heroTitle.textContent =
        featured.title;

    if(heroSummary)
        heroSummary.textContent =
        featured.summary;

    if(
        heroImage &&
        featured.featuredImage
    ){
        heroImage.src =
        featured.featuredImage;
    }

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

    .forEach(article=>{

        trendingList.innerHTML += `

            <li>

                ${article.title}

            </li>

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

    let articles = [...allArticles];

    if(pageCategory){

        articles =

        articles.filter(

            article =>

            article.category ===

            pageCategory

        );

    }

    const search =

        document

        .getElementById("search")

        ?.value

        ?.toLowerCase()

        || "";

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

        );

    }

    articles

    .slice(0,4)

    .forEach(article=>{

        articleGrid.innerHTML += `

        <a
            href="article.html?id=${article.id}"
            class="article-link"
        >

            <div class="card">

                <img
                    src="${
                        article.featuredImage ||
                        'https://picsum.photos/500'
                    }"
                >

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

loadSiteSettings();

loadArticles();

setupSearch();
