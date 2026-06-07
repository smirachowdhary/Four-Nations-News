import { db } from "./firebase.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const params =
    new URLSearchParams(
        window.location.search
    );

const articleId =
    params.get("id");

loadArticle();

async function loadArticle(){

    if(!articleId){
        return;
    }

    const articleRef =
        doc(
            db,
            "articles",
            articleId
        );

    const articleSnap =
        await getDoc(articleRef);

    if(!articleSnap.exists()){
        return;
    }

    const article =
        articleSnap.data();

    document.title =
        article.title;

    document.getElementById(
        "title"
    ).textContent =
        article.title;

    document.getElementById(
        "author"
    ).textContent =
        article.author;

    document.getElementById(
        "category"
    ).textContent =
        article.category;

    document.getElementById(
        "content"
    ).textContent =
        article.content;

    document.getElementById(
        "featuredImage"
    ).src =
        article.featuredImage;

    const gallery =
        document.getElementById(
            "gallery"
        );

    if(article.images){

        article.images.forEach(
            image => {

                gallery.innerHTML += `
                    <img src="${image}">
                `;

            }
        );

    }

}
