import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const ADMIN_EMAIL =
    "your@email.com";

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
    }

});

document
.getElementById("logoutBtn")
.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href =
        "index.html";

});
