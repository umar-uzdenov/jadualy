(async function main() {
    window.jadualyAddress = "https://jadualy.pages.dev/"
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
        tag.src = jadualyAddress + scriptName
        document.head.appendChild(tag)
    }


    const li = document.createElement("li")
    li.className = "nav-item dropdown"
    const a = document.createElement("a")
    a.className = "nav-link"
    a.textContent = "جدولي - مساعد الحذف والإضافة"
    a.addEventListener("click", async () => {
        document.head.innerHTML = `
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Jadual 4.0</title>
        `

        await new Promise(resolve => setTimeout(resolve, 1000))
    
        for (const styleName of styles) {
            await new Promise(resolve => setTimeout(resolve, 10))
            const tag = document.createElement("link")
            tag.rel = "stylesheet"
            tag.href = jadualyAddress + styleName
            document.head.appendChild(tag)
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
        runUi()
    })
    li.appendChild(a)
    const ul = document.querySelectorAll("#headerForm>ul")[0]
    ul.insertBefore(li, ul.firstChild)
})();
