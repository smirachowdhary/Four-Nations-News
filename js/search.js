import { db } from "./firebase.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const searchBox =
    document.getElementById("search");

let articles = [];

async function loadArticles(){

    const snapshot =
        await getDocs(
            collection(
                db,
                "articles"
            )
        );

    articles = [];

    snapshot.forEach(doc=>{

        articles.push({

            id:doc.id,

            ...doc.data()

        });

    });

}

loadArticles();

searchBox?.addEventListener(
    "keydown",
    (e)=>{

        if(e.key !== "Enter"){
            return;
        }

        const query =
            searchBox.value.trim();

        if(!query){
            return;
        }

        window.location.href =
            `search.html?q=${encodeURIComponent(query)}`;

    }
);
