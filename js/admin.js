import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
    setDoc
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

onAuthStateChanged(auth, async (user) => {

    if(!user){
        window.location.href = "login.html";
        return;
    }

    if(user.email !== ADMIN_EMAIL){

        alert("Not authorized");

        await signOut(auth);

        window.location.href =
            "index.html";

        return;
    }

    await loadArticles();
    await loadSettings();

});

document
.getElementById("logoutBtn")
.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href =
        "index.html";

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

    if(data.featured){
        await clearFeatured();
    }


    await addDoc(
        collection(db, "articles"),
        data
    );

    alert("Article Published");

    location.reload();

});

const saveBtn =
    document.getElementById("saveBtn");

if(saveBtn){

    saveBtn.addEventListener(
        "click",
        async () => {

            const data =
                getFormData();

            if(data.featured){
                await clearFeatured();
            }

            if(data.breaking){
                await clearBreaking();
            }

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

        }
    );

}

async function clearFeatured(){

    const snapshot =
        await getDocs(
            collection(db, "articles")
        );

    for(const articleDoc of snapshot.docs){

        await updateDoc(
            doc(
                db,
                "articles",
                articleDoc.id
            ),
            {
                featured:false
            }
        );

    }

}

async function clearBreaking(){

    const snapshot =
        await getDocs(
            collection(db, "articles")
        );

    for(const articleDoc of snapshot.docs){

        await updateDoc(
            doc(
                db,
                "articles",
                articleDoc.id
            ),
            {
                breaking:false
            }
        );

    }

}

async function loadArticles(){

    const articleList =
        document.getElementById(
            "articleList"
        );

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

            <p>
                Featured:
                ${article.featured ? "Yes" : "No"}
            </p>

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

                const ok =
                    confirm(
                        "Delete article?"
                    );

                if(!ok){
                    return;
                }

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

                const articleRef =
                    doc(
                        db,
                        "articles",
                        button.dataset.id
                    );

                const articleSnap =
                    await getDoc(
                        articleRef
                    );

                const article =
                    articleSnap.data();

                editingArticleId =
                    button.dataset.id;

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

                window.scrollTo({
                    top:0,
                    behavior:"smooth"
                });

            }
        );

    });

}

async function loadSettings(){

    const siteRef =
        doc(
            db,
            "settings",
            "site"
        );

    const siteSnap =
        await getDoc(
            siteRef
        );

    if(!siteSnap.exists()){
        return;
    }

    const data =
        siteSnap.data();

    document.getElementById("quoteText").value =
        data.quoteText || "";

    document.getElementById("quoteAuthor").value =
        data.quoteAuthor || "";

    document.getElementById("spotlightName").value =
        data.spotlightName || "";

    document.getElementById("spotlightDescription").value =
        data.spotlightDescription || "";

    document.getElementById("spotlightImage").value =
        data.spotlightImage || "";

}

document
.getElementById("saveQuote")
.addEventListener("click", saveSettings);

document
.getElementById("saveSpotlight")
.addEventListener("click", saveSettings);

async function saveSettings(){

    await setDoc(
        doc(
            db,
            "settings",
            "site"
        ),
        {
            quoteText:
                document.getElementById("quoteText").value,

            quoteAuthor:
                document.getElementById("quoteAuthor").value,

            spotlightName:
                document.getElementById("spotlightName").value,

            spotlightDescription:
                document.getElementById("spotlightDescription").value,

            spotlightImage:
                document.getElementById("spotlightImage").value
        }
    );

    alert("Settings Saved");

}
