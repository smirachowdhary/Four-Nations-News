import { auth } from "./firebase.js";

import {
    GoogleAuthProvider,
    signInWithPopup
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

document
.getElementById("googleLogin")
.addEventListener("click", async () => {

    try{

        await signInWithPopup(auth, provider);

        window.location.href = "admin.html";

    }catch(error){

        console.log(error);

    }

});
