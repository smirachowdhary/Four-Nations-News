import { db } from "./firebase.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

loadTeam();

async function loadTeam(){

    const teamGrid =
        document.getElementById(
            "teamGrid"
        );

    const snapshot =
        await getDocs(
            collection(
                db,
                "team"
            )
        );

    teamGrid.innerHTML = "";

    snapshot.forEach(doc=>{

        const member =
            doc.data();

        teamGrid.innerHTML += `

        <div class="card">

            <img
                src="${
                    member.image ||
                    "https://picsum.photos/400"
                }"
            >

            <div class="card-content">

                <h3>
                    ${member.name}
                </h3>

                <p>

                    <strong>

                        ${member.role}

                    </strong>

                </p>

                <p>

                    ${member.bio}

                </p>

            </div>

        </div>

        `;

    });

}
