const btn = document.getElementById("darkToggle");

btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );
});

if(localStorage.getItem("darkMode") === "true"){
    document.body.classList.add("dark");
}
