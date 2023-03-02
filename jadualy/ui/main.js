// document.addEventListener("DOMContentLoaded", runUi)

async function runUi() {
    console.log("lol")
    query("body").innerHTML = ""
    query("body").appendChild(html`
        <div id="app">
            <header>
                <div class="table-count">
                    <span>
                        عدد الجداول
                        &nbsp:&nbsp
                    </span>
                    <span class="table-counter" id="filtered-table-count">0</span>
                    /
                    <span class="table-counter" id="all-table-count">0</span>
                </div>
                <nav>
                    <div class="">
                        اختيار
                    </div>
                    <button>
                        الساعات
                    </button>
                    <button>
                        المقررات
                    </button>
                    <button>
                        أوقات الدروس
                    </button>
                </nav>
            </header>
            <div id="app-body-container" class="app-body-container">
                <aside id="table-list" class="table-list">
                </aside>
                <main id="main" class="main"></main>
            </div>
        </div>
    `)
    setTimeout(globalTest, 1)
}

function showList() {
    const tableList = query("#table-list")
    tableList.removeAllChild()
    for (const [index, table] of TableCollection.get(100)) {
        const button = html`
            <button class="table-list-button">
                جدول - ${+index + 1} | ساعات - ${table.hours}
            </button>
        `
        button.addEventListener("click", () => {
            showTable(index + 1, table)
        })
        tableList.appendChild(button)
    }
}

function showTable(index, table) {
    const tableArea = query("main")
    tableArea.removeAllChild()

    const title = html`
        <div class="table-title">
            <div class="table-title-index">
                جدول - ${index}
            </div>
            <div class="table-title-hours">
                عدد الساعات - ${table.hours}
            </div>
            <div class="table-title-subjects">
                عدد المقررات - ${table.options.length}
            </div>
        </div>
    `
    tableArea.appendChild(title)

    const tableBody = html`
        <div class="table-body">
            <div id="table-body-hours" class="table-body-column"></div>
        </div>
    `

    const hoursColumn = tableBody.query("#table-body-hours")
    for (const hour of [9, 10, 11, 12, 13, 14, 15]) {
        hoursColumn.appendChild(html`
            <div class="table-cell">${hour}:00-${hour}:50</div>
        `)
    }

    for (const day of Day.all) {
        const dayColumn = html`
            <div id="table-${day.code}" class="table-body-column">
                <div class="day-lesson-shadow"></div>
            </div>
        `
        tableBody.appendChild(dayColumn)
        // for (const hour of [9, 10, 11, 12, 13, 14, 15]) {
        //     dayColumn.query(".day-lesson-shadow").appendChild(html`
        //         <div class="table-cell"></div>
        //     `)
        // }
    }

    for (const option of table.options) {
        for (const lesson of option.lessons) {
            // console.log(lesson.begin.hours - 10)
            const topCoefficent = (lesson.begin.hours - 9).toString()
            const lessonCell = html`
                <div class="table-cell" style="position: absolute; top: calc(7 * ${topCoefficent} * var(--mid));background:${option.subject.color};">
                    ${option.subject.code}
                </div>
            `
            // console.log(lesson.day.code)
            tableBody.query(`#table-${lesson.day.code}`).appendChild(lessonCell)
        }
    }
    tableArea.appendChild(tableBody)
}

Node.prototype.removeAllChild = function() {
    for (const child of Array.from(this.childNodes)) {
        this.removeChild(child)
    }
}

// Node.extend(function() {
//     let field = number
//     return {
//         set field(value) {
//             field = value
//         },
//         get field() {
//             return field
//         }
//     }
// })

function loadData() {
    function erasePageContent() {}
    function openPageInIframe() {}
    function parseData() {}
}
