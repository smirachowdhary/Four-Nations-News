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

        window.location.href =
            "index.html";

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

    const category =
        document.getElementById("category").value;

    const image1 =
        document.getElementById("image1").value;

    const image2 =
        document.getElementById("image2").value;

    const image3 =
        document.getElementById("image3").value;

    const image4 =
        document.getElementById("image4").value;

    const summary =
        document.getElementById("summary").value;

    const content =
        document.getElementById("content").value;

    const featured =
        document.getElementById("featured").checked;

    const breaking =
        document.getElementById("breaking").checked;

    if(
        !title ||
        !author ||
        !image1 ||
        !summary
    ){
        alert("Fill out all required fields");
        return;
    }

    try{

        await addDoc(
            collection(db, "articles"),
            {
                title,
                author,
                category,

                summary,
                content,

                featured,
                breaking,

                featuredImage:image1,

                images:[
                    image1,
                    image2,
                    image3,
                    image4
                ].filter(Boolean),

                createdAt:Date.now()
            }
        );

        alert("Article Published");

        location.reload();

    }catch(error){

        console.error(error);

        alert(
            "Error publishing article"
        );

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
                    <strong>Author:</strong>
                    ${article.author}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${article.category}
                </p>

                <p>
                    <strong>Featured:</strong>
                    ${article.featured ? "Yes" : "No"}
                </p>

                <p>
                    <strong>Breaking:</strong>
                    ${article.breaking ? "Yes" : "No"}
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

                if(!confirmDelete){
                    return;
                }

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
