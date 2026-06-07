import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const ADMIN_EMAIL =
    "smirachowdhary@gmail.com";

let editingArticleId = null;

onAuthStateChanged(auth, (user) => {

    if(!user){
        window.location.href = "login.html";
        return;
    }

    if(user.email !== ADMIN_EMAIL){

        alert("Not authorized");

        signOut(auth);

        window.location.href = "index.html";
        return;
    }

    loadArticles();

});

document
.getElementById("logoutBtn")
.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "index.html";

});

function getFormData(){

    return {

        title:
            document.getElementById("title").value,

        author:
            document.getElementById("author").value,

        category:
            document.getElementById("category").value,

        summary:
            document.getElementById("summary").value,

        content:
            document.getElementById("content").value,

        featured:
            document.getElementById("featured").checked,

        breaking:
            document.getElementById("breaking").checked,

        featuredImage:
            document.getElementById("image1").value,

        images:[
            document.getElementById("image1").value,
            document.getElementById("image2").value,
            document.getElementById("image3").value,
            document.getElementById("image4").value
        ].filter(Boolean),

        createdAt:Date.now()
    };

}

document
.getElementById("publishBtn")
.addEventListener("click", async () => {

    const data = getFormData();

    await addDoc(
        collection(db, "articles"),
        data
    );

    location.reload();

});

document
.getElementById("saveBtn")
.addEventListener("click", async () => {

    const data = getFormData();

    await updateDoc(
        doc(
            db,
            "articles",
            editingArticleId
        ),
        data
    );

    alert("Article Updated");

    location.reload();

});

async function loadArticles(){

    const articleList =
        document.getElementById("articleList");

    articleList.innerHTML = "";

    const snapshot =
        await getDocs(
            collection(db, "articles")
        );

    snapshot.forEach((articleDoc) => {

        const article =
            articleDoc.data();

        articleList.innerHTML += `

        <div class="article-item">

            <h3>${article.title}</h3>

            <p>${article.author}</p>

            <p>${article.category}</p>

            <div class="actions">

                <button
                    class="edit-btn"
                    data-id="${articleDoc.id}">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${articleDoc.id}">
                    Delete
                </button>

            </div>

        </div>

        `;

    });

    document
    .querySelectorAll(".delete-btn")
    .forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                await deleteDoc(
                    doc(
                        db,
                        "articles",
                        button.dataset.id
                    )
                );

                loadArticles();

            }
        );

    });

    document
    .querySelectorAll(".edit-btn")
    .forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const snapshot =
                    await getDocs(
                        collection(
                            db,
                            "articles"
                        )
                    );

                snapshot.forEach((articleDoc) => {

                    if(
                        articleDoc.id ===
                        button.dataset.id
                    ){

                        const article =
                            articleDoc.data();

                        editingArticleId =
                            articleDoc.id;

                        document.getElementById("title").value =
                            article.title || "";

                        document.getElementById("author").value =
                            article.author || "";

                        document.getElementById("category").value =
                            article.category || "ATLA";

                        document.getElementById("summary").value =
                            article.summary || "";

                        document.getElementById("content").value =
                            article.content || "";

                        document.getElementById("featured").checked =
                            article.featured || false;

                        document.getElementById("breaking").checked =
                            article.breaking || false;

                        document.getElementById("image1").value =
                            article.images?.[0] || "";

                        document.getElementById("image2").value =
                            article.images?.[1] || "";

                        document.getElementById("image3").value =
                            article.images?.[2] || "";

                        document.getElementById("image4").value =
                            article.images?.[3] || "";

                        document.getElementById("saveBtn").style.display =
                            "inline-block";

                    }

                });

                window.scrollTo({
                    top:0,
                    behavior:"smooth"
                });

            }
        );

    });

}
