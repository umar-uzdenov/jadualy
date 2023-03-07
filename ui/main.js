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
                <div id="select-nav"></div>
            </header>
            <div id="select-area" class="select-area"></div>
            <main id="table-list" class="table-list"></main>
        </div>
    `)
    showSelectArea()
    // showInitialSubjects()
    setTimeout(globalTest, 1)
}

function showSelectArea() {
    const selectNav = query("#select-nav")
    const selectArea = query("#select-area")

    selectNav.appendChild(html`
        <nav>
            <button id="select-close-button">
                اختيار
            </button>
            <button id="select-hours-button">
                الساعات
            </button>
            <button id="select-subjects-button">
                المقررات
            </button>
            <button id="select-lessons-button">
                أوقات الدروس
            </button>
        </nav>
    `)

    const selectClose = selectNav.query("#select-close-button")
    const selectHours = selectNav.query("#select-hours-button")
    const selectSubjects = selectNav.query("#select-subjects-button")
    const selectLessons = selectNav.query("#select-lessons-button")


    let hoursSelectOpen = false
    let subjectsSelectOpen = false
    let lessonsSelectOpen = false

    selectClose.addEventListener("click", selectCloseListener)

    selectHours.addEventListener("click", async () => {
        if (hoursSelectOpen) {
            return selectCloseListener()
        }
        selectArea.classList.add("open")
        // await sleep(290)
        showHoursSelect()
        hoursSelectOpen = true
        subjectsSelectOpen = false
        lessonsSelectOpen = false
    })

    selectSubjects.addEventListener("click", async () => {
        if (subjectsSelectOpen) {
            return selectCloseListener()
        }
        selectArea.classList.add("open")
        // await sleep(290)
        showSubjectsSelect()
        subjectsSelectOpen = true
        hoursSelectOpen = false
        lessonsSelectOpen = false
    })

    selectLessons.addEventListener("click", async () => {
        if (lessonsSelectOpen) {
            return selectCloseListener()
        }

        selectArea.classList.add("open")
        showLessonsSelect()
        lessonsSelectOpen = true
        hoursSelectOpen = false
        subjectsSelectOpen = false
    })

    async function selectCloseListener() {
        selectArea.classList.remove("open")
        await sleep(200)
        selectArea.removeAllChild()
        hoursSelectOpen = false
        subjectsSelectOpen = false
        lessonsSelectOpen = false
    }
}

function showHoursSelect() {
    query("#select-area").removeAllChild()

    for (const hour of TableCollection.hourList) {
        const hourButton = html`
            <div class="select-hour-area">
                <div class="select-status">
                    <span class="required">لازم</span>
                    <span class="allowed">جائز</span>
                    <span class="excepted">ممنوع</span>
                </div>
                <div class="hour-count">ساعات - ${hour}</div>
            </div>
        `
        hourButton.query("span.required").addEventListener("click", () => {
            TableCollection.requireHour(hour)
            showHoursSelect() // just rerender
        })
        hourButton.query("span.allowed").addEventListener("click", () => {
            TableCollection.allowHour(hour)
            showHoursSelect() // just rerender
        })
        hourButton.query("span.excepted").addEventListener("click", () => {
            TableCollection.exceptHour(hour)
            showHoursSelect() // just rerender
        })
        if (TableCollection.required.hours.includes(hour)) {
            hourButton.query(".hour-count").classList.add("required")
        } else if (TableCollection.excepted.hours.includes(hour)) {
            hourButton.query(".hour-count").classList.add("excepted")
        } else {
            hourButton.query(".hour-count").classList.add("allowed")
        }
        query("#select-area").appendChild(hourButton)
    }
    showList()
}

function showSubjectsSelect() {
    query("#select-area").removeAllChild()

    for (const subject of TableCollection.subjects) {
        const subjectButton = html`
            <div class="select-subject-area">
                <div class="select-status">
                    <span class="required">لازم</span>
                    <span class="allowed">جائز</span>
                    <span class="excepted">ممنوع</span>
                </div>
                <div class="subject-name">${subject.name}</div>
            </div>
        `
        subjectButton.query("span.required").addEventListener("click", () => {
            TableCollection.requireSubject(subject.fullCode)
            showSubjectsSelect() // just rerender
        })
        subjectButton.query("span.allowed").addEventListener("click", () => {
            TableCollection.allowSubject(subject.fullCode)
            showSubjectsSelect() // just rerender
        })
        subjectButton.query("span.excepted").addEventListener("click", () => {
            TableCollection.exceptSubject(subject.fullCode)
            showSubjectsSelect() // just rerender
        })
        if (TableCollection.required.subjects.includes(subject.fullCode)) {
            subjectButton.query(".subject-name").classList.add("required")
        } else if (TableCollection.excepted.subjects.includes(subject.fullCode)) {
            subjectButton.query(".subject-name").classList.add("excepted")
        } else {
            subjectButton.query(".subject-name").classList.add("allowed")
        }
        query("#select-area").appendChild(subjectButton)
    }
    showList()
}

function showLessonsSelect() {
    query("#select-area").removeAllChild()

    const tableBody = html`
        <div class="table-body" style="position:relative"></div>
    `
    query("#select-area").appendChild(tableBody)

    const hoursColumn = html`
        <div class="table-body-column"></div>
    `
    for (const hour of TableCollection.selectLessonHours) {
        hoursColumn.appendChild(html`
            <div class="table-cell table-hour-cell">${hour}</div>
        `)
    }

    tableBody.appendChild(hoursColumn)

    for (const day of Day.all) {
        tableBody.appendChild(html`
            <div class="table-${day.code} table-body-column"></div>
        `)
    }

    for (const lesson of TableCollection.lessons) {
        let status = "allowed"
        if (TableCollection.required.lessons.includes(lesson.code)) {
            status = "required"
        } else if (TableCollection.excepted.lessons.includes(lesson.code)) {
            status = "excepted"
        }

        let text = "جائز"
        if (status == "required") {
            text = "لازم"
        } else if (status == "excepted") {
            text = "ممنوع"
        }

        const topCoefficent = (lesson.begin.hours - TableCollection.lessonMinHour).toString()
        const lessonCell = html`
            <div
                class="table-cell select-cell required ${status}"
                style="position: absolute; top: calc(7 * ${topCoefficent} * var(--mid));"
            >
                ${text}
            </div>
        `

        lessonCell.addEventListener("click", () => {
            const requiredMessage = status == "required" ? "اترك" : "اجعل"
            const allowedMessage = status == "allowed" ? "اترك" : "اجعل"
            const exceptedMessage = status == "excepted" ? "اترك" : "اجعل"
            const popup = html`
                <div class="select-lesson-popup">
                    <div class="select-lesson-title ${status}">
                        <span>
                            ${lesson.begin.hours}:${lesson.begin.minutes.toString().padStart(2, 0)}
                            -
                            ${lesson.end.hours}:${lesson.end.minutes}
                        </span>
                        <span>${text}</span>
                    </div>
                    <div class="select-lesson-body">
                        <span class="required">${requiredMessage} لازما</span>
                        <span class="allowed">${allowedMessage} جائزا</span>
                        <span class="excepted">${exceptedMessage} ممنوعا</span>
                    </div>
                </div>
            `
            popup.query("span.required").addEventListener("click", () => {
                TableCollection.requireLesson(lesson.code)
                showLessonsSelect()
            })
            popup.query("span.allowed").addEventListener("click", () => {
                TableCollection.allowLesson(lesson.code)
                showLessonsSelect()
            })
            popup.query("span.excepted").addEventListener("click", () => {
                TableCollection.exceptLesson(lesson.code)
                showLessonsSelect()
            })
            tableBody.appendChild(popup)
        })

        tableBody.query(`.table-${lesson.day.code}`).appendChild(lessonCell)
    }
    showList()
}

function showInitialSubjects(subjects) {
    query("#table-list").removeAllChild()
    const subjectList = html`
        <div class="initial-subject-list">
            <div class="select-subject-area">
                <div class="subject-name">عدد المقررات - ${subjects.length}</div>
            </div>
        </div>
    `
    query("#table-list").appendChild(subjectList)

    for (const subject of subjects) {
        subjectList.appendChild(html`
            <div class="select-subject-area" style="background:${subject.color}">
                <div class="subject-name">${subject.fullCode} - ${subject.name}</div>
            </div>
        `)
    }
}

function showList() {
    // return
    const tableList = query("#table-list")
    tableList.removeAllChild()
    for (const [index, table] of TableCollection.get(100)) {
        const button = html`
            <div class="table-list-button">
                <div class="table-header">
                    <span class="table-header-index">جدول - ${+index + 1}</span>
                    <span>ساعات - ${table.hours}</span>
                    <span class="table-header-subjects">المقررات - ${table.options.length}</span>
                </div>
                <div class="table-area"></div>
            </div>
        `
        let isTableOpen = false
        let isSubjectsOpen = false
        const tableArea = button.query(".table-area")
        button.query(".table-header-index").addEventListener("click", () => {
            tableArea.removeAllChild()
            if (!isTableOpen) {
                showTable(table, tableArea)
                isTableOpen = true
                isSubjectsOpen = false
            } else {
                isTableOpen = false
            }
        })
        button.query(".table-header-subjects").addEventListener("click", () => {
            console.log("open subjects")
            console.log({isSubjectsOpen, isTableOpen})
            tableArea.removeAllChild()
            if (!isSubjectsOpen) {
                showSubjects(table, tableArea)
                isSubjectsOpen = true
                isTableOpen = false
            } else {
                isSubjectsOpen = false
            }
        })
        tableList.appendChild(button)
    }
}

function showTable(table, tableArea) {
    const tableBody = html`
        <div class="table-body">
            <div id="table-body-hours" class="table-body-column"></div>
        </div>
    `

    const hoursColumn = tableBody.query("#table-body-hours")
    for (const hour of table.hourList()) {
        hoursColumn.appendChild(html`
            <div class="table-cell">${hour}</div>
        `)
        // <div class="table-cell">${hour}:00-${hour}:50</div>
    }

    for (const day of Day.all) {
        const dayColumn = html`
            <div id="table-${day.code}" class="table-body-column">
                <div class="day-lesson-shadow"></div>
            </div>
        `
        tableBody.appendChild(dayColumn)
    }

    for (const option of table.options) {
        for (const lesson of option.lessons) {
            // console.log(lesson.begin.hours - 10)
            const topCoefficent = (lesson.begin.hours - table.minHour).toString()
            const lessonCell = html`
                <div
                    class="table-cell"
                    style="position: absolute; top: calc(7 * ${topCoefficent} * var(--mid));background:${option.subject.color};"
                >
                    ${option.subject.code} - ${option.code}
                </div>
            `
            // console.log(lesson.day.code)
            tableBody.query(`#table-${lesson.day.code}`).appendChild(lessonCell)
        }
    }
    tableArea.appendChild(tableBody)
}

function showSubjects(table, tableArea) {

    tableArea.removeAllChild()

    for (const option of table.options) {
        const optionButton = html`
            <div class="select-subject-area" style="background:${option.subject.color}">
                <div class="option-name">
                    <div>${option.subject.name}</div>
                    <div>شعبة ${option.code}</div>
                </div>
            </div>
        `
        tableArea.appendChild(optionButton)
    }
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
