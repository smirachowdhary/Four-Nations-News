import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    increment,
    collection,
    addDoc,
    getDocs,
    query,
    where
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const params =
    new URLSearchParams(
        window.location.search
    );

const articleId =
    params.get("id");

let currentArticle = null;

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

    await updateDoc(
        articleRef,
        {
            views:
                increment(1)
        }
    );

    const articleSnap =
        await getDoc(
            articleRef
        );

    if(!articleSnap.exists()){
        return;
    }

    currentArticle =
        articleSnap.data();

    document.title =
        currentArticle.title;

    document.getElementById(
        "title"
    ).textContent =
        currentArticle.title;

    document.getElementById(
        "author"
    ).textContent =
        currentArticle.author;

    document.getElementById(
        "category"
    ).textContent =
        currentArticle.category;

    document.getElementById(
        "content"
    ).textContent =
        currentArticle.content;

    document.getElementById(
        "featuredImage"
    ).src =
        currentArticle.featuredImage ||
        "https://picsum.photos/1200/600";

    document.getElementById(
        "views"
    ).textContent =
        currentArticle.views || 0;

    document.getElementById(
        "likes"
    ).textContent =
        currentArticle.likes || 0;

    const gallery =
        document.getElementById(
            "gallery"
        );

    gallery.innerHTML = "";

    if(currentArticle.images){

        currentArticle.images.forEach(
            image => {

                gallery.innerHTML += `
                    <img src="${image}">
                `;

            }
        );

    }

    loadComments();

    loadRelatedArticles();

}

document
.getElementById("likeBtn")
.addEventListener(
    "click",
    async () => {

        const articleRef =
            doc(
                db,
                "articles",
                articleId
            );

        await updateDoc(
            articleRef,
            {
                likes:
                    increment(1)
            }
        );

        const likesSpan =
            document.getElementById(
                "likes"
            );

        likesSpan.textContent =
            Number(
                likesSpan.textContent
            ) + 1;

    }
);

document
.getElementById("postComment")
.addEventListener(
    "click",
    async () => {

        const name =
            document.getElementById(
                "commentName"
            ).value;

        const comment =
            document.getElementById(
                "commentText"
            ).value;

        if(
            !name ||
            !comment
        ){
            return;
        }

        await addDoc(
            collection(
                db,
                "comments"
            ),
            {
                articleId,
                name,
                comment,
                createdAt:
                    Date.now()
            }
        );

        document.getElementById(
            "commentName"
        ).value = "";

        document.getElementById(
            "commentText"
        ).value = "";

        loadComments();

    }
);

async function loadComments(){

    const commentsList =
        document.getElementById(
            "commentsList"
        );

    commentsList.innerHTML = "";

    const q =
        query(
            collection(
                db,
                "comments"
            ),
            where(
                "articleId",
                "==",
                articleId
            )
        );

    const snapshot =
        await getDocs(q);

    snapshot.forEach(
        commentDoc => {

            const comment =
                commentDoc.data();

            commentsList.innerHTML += `

                <div class="comment-card">

                    <strong>
                        ${comment.name}
                    </strong>

                    <p>
                        ${comment.comment}
                    </p>

                </div>

            `;

        }
    );

}

async function loadRelatedArticles(){

    if(!currentArticle){
        return;
    }

    const related =
        document.getElementById(
            "relatedArticles"
        );

    related.innerHTML = "";

    const snapshot =
        await getDocs(
            collection(
                db,
                "articles"
            )
        );

    let count = 0;

    snapshot.forEach(
        articleDoc => {

            const article =
                articleDoc.data();

            if(
                articleDoc.id ===
                articleId
            ){
                return;
            }

            if(
                article.category !==
                currentArticle.category
            ){
                return;
            }

            if(count >= 3){
                return;
            }

            count++;

            related.innerHTML += `

            <a
                class="related-card"
                href="article.html?id=${articleDoc.id}"
            >

                <img
                    src="${
                        article.featuredImage ||
                        "https://picsum.photos/500"
                    }"
                >

                <div>

                    <h3>
                        ${article.title}
                    </h3>

                </div>

            </a>

            `;

        }
    );

}
