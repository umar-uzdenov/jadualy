(function main() {
    // const address = "http://127.0.0.1:5500/"
    // const scripts = [
    //     "data/data.js",
    //     "data/time.js",
    //     "data/day.js",
    //     "data/lesson.js",
    //     "data/option.js",
        
    //     "utils.js",
    //     "ui.js",
    // ]

    // scripts.forEach(name => {
    //     const tag = document.createElement("script")
    //     tag.src = address + name
    //     document.body.appendChild(tag)
    // })



    const li = document.createElement("li")
    li.className = "nav-item dropdown"
    const a = document.createElement("a")
    a.className = "nav-link"
    a.textContent = "جدولي - مساعد الحذف والإضافة"
    a.addEventListener("click", () => console.log("launching jadual"))
    li.appendChild(a)
    const ul = document.querySelectorAll("#headerForm>ul")[0]
    ul.insertBefore(li, ul.firstChild)
})();
