import { db } from "./firebase.js";

import {
    collection,
    addDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const subscribeBtn =
    document.getElementById(
        "subscribeBtn"
    );

if(subscribeBtn){

    subscribeBtn.addEventListener(
        "click",
        async () => {

            const email =
                document
                .getElementById(
                    "newsletterEmail"
                )
                .value
                .trim();

            if(!email){

                alert(
                    "Enter an email."
                );

                return;
            }

            await addDoc(
                collection(
                    db,
                    "subscribers"
                ),
                {
                    email,
                    createdAt:
                        Date.now()
                }
            );

            alert(
                "Subscribed!"
            );

            document
            .getElementById(
                "newsletterEmail"
            )
            .value = "";

        }
    );

}
