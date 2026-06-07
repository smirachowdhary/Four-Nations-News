import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const ADMIN_EMAIL =
    "smirachowdhary@gmail.com";

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

    window.location.href =
        "index.html";

});

document
.getElementById("publishBtn")
.addEventListener("click", async () => {

    const title =
        document.getElementById("title").value;

    const author =
        document.getElementById("author").value;

    const image =
        document.getElementById("image").value;

    const summary =
        document.getElementById("summary").value;

    const category =
        document.getElementById("category").value;

    if(
        !title ||
        !author ||
        !image ||
        !summary
    ){
        alert("Fill out all fields");
        return;
    }

    try{

        await addDoc(
            collection(db, "articles"),
            {
                title,
                author,
                image,
                summary,
                category,
                createdAt: Date.now()
            }
        );

        alert("Article Published");

        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("image").value = "";
        document.getElementById("summary").value = "";

        loadArticles();

    }catch(error){

        console.error(error);
        alert("Error publishing article");

    }

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

                <p>
                    ${article.author}
                </p>

                <div class="actions">

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

                const id =
                    button.dataset.id;

                const confirmDelete =
                    confirm(
                        "Delete article?"
                    );

                if(!confirmDelete)
                    return;

                await deleteDoc(
                    doc(
                        db,
                        "articles",
                        id
                    )
                );

                loadArticles();

            }
        );

    });

}
