import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    console.log(user);

    if(!user){

        alert("NO USER FOUND");
        return;
    }

    alert("SIGNED IN AS: " + user.email);

});

document
.getElementById("logoutBtn")
.addEventListener("click", async () => {

    await signOut(auth);

    alert("Signed out");

});
