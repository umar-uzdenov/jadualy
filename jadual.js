(async function main() {
    const address = "https://jadualy.pages.dev/"
    // const address = "http://127.0.0.1:5500/"
    const scripts = [
    //     "utils.js",
    //     "data/data.js",
    //     "data/time.js",
    //     "data/day.js",
    //     "data/lesson.js",
    //     "data/option.js",
        
    //     "ui.js",
    // ]

        "utils.js",

        "data/data.js",
        "data/time.js",
        "data/day.js",
        "data/lesson.js",
        "data/option.js",
        "data/subject.js",
        "data/teacher.js",
        "data/table.js",
        "test/utils.js",
        "table-collection.js",

        "separator.js",
        "test/mock-teachers.js",
        "test/index.js",

        "ui/main.js",
    ]

    const styles = [
        "css/style.css"
    ]

    for (const scriptName of scripts) {
        await new Promise(resolve => setTimeout(resolve, 10))
        const tag = document.createElement("script")
        tag.src = address + scriptName
        document.body.appendChild(tag)
    }

    for (const styleName of styles) {
        await new Promise(resolve => setTimeout(resolve, 10))
        const tag = document.createElement("link")
        tag.rel = "stylesheet"
        tag.href = address + styleName
        document.body.appendChild(tag)
    }



    const li = document.createElement("li")
    li.className = "nav-item dropdown"
    const a = document.createElement("a")
    a.className = "nav-link"
    a.textContent = "جدولي - مساعد الحذف والإضافة"
    a.addEventListener("click", () => {
        runUi()
    })
    li.appendChild(a)
    const ul = document.querySelectorAll("#headerForm>ul")[0]
    ul.insertBefore(li, ul.firstChild)
})();
