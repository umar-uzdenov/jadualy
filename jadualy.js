const loadAddress = "http://127.0.0.1:5500/"

function query(selector) {
    return document.querySelector(selector)
}

function  queryAll(selector) {
    return [...document.querySelectorAll(selector)]
}

Node.prototype.query = function(selector) {
    return this.querySelector(selector)
}

Node.prototype.queryAll = function(selector) {
    return this.querySelectorAll(selector)
}

Array.prototype.spliceRandom = function() {
    if (this.length == 0) return undefined

    const index = Math.round(Math.random() * (this.length - 1))
    return this.splice(index, 1)[0]
}

function iOS() {
    return [
        'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
};

function detectMobile() {
    return [
        /Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i
    ].some(toMatch => navigator.userAgent.match(toMatch))
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

// let toastTimeout
// function toast(text) {
//     try {
//         clearTimeout(toastTimeout)
//         if (typeof text == "object") text = JSON.stringify(text, 0, 4)
//         const parent = query("#toast")
//         const child = parent.querySelector("div")
//         child.textContent = text
//         parent.classList.remove("invisible")
//         toastTimeout = setTimeout(() => {
//             parent.classList.add("invisible")
//         }, 10000)
//     } catch (error) {}
// }


function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max))
}

function safeCall(fun, log = false) {
    try { fun() } catch (error) { if (log) console.error(error) }
}

function html(segments, ...args) {
    const string = segments.reduce((acc, segment, i) =>  acc + segment + (args[i] || ''), '')
    const element = new DOMParser().parseFromString(string, "text/html").querySelector("body").childNodes[0]

    safeCall(() => {
        document.head.appendChild(element) // activate element
        document.head.removeChild(element) // deattach it
    })

    return element
}

function css(segments, ...args) {
    return segments.reduce((acc, segment, i) =>  acc + segment + (args[i] || ''), '')
}

function trim(segments, ...args) {
    const lines = segments
        .reduce((acc, segment, i) =>  acc + segment + (args[i] || ''), '') // get raw string
        .trimEnd().split('\n') // Split the raw string into lines
        .filter(line => line != "") // remove empty lines

    // Find the minimum number of leading spaces across all lines
    const minLeadingSpaces = lines.reduce((acc, line) => {
        // Find the number of leading spaces for this line
        const leadingSpaces = line.match(/^ */)[0].length
        // if it has less leading spaces than the previous minimum, set it as the new minimum
        return leadingSpaces < acc ? leadingSpaces :  acc
    }, Infinity)

    // Trim lines, join them and return the result
    return lines.map(line => line.substring(minLeadingSpaces)).join('\n')
}

function random(min, max) { // min and max included
    return Math.ceil(Math.random() * (max - min + 1) + min - 1)
}

// Data
class Int {}
class Lateinit {}
class Nothing {}

class Day {
    names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]

    constructor(id) { Int > Day
        this.id = clamp(id, 0, 4)
        this.code = "day-" + this.id.toString()
        this.name = this.names[this.id]
    }
    equals(day) { Day > Boolean
        return this.id == day.id
    }
    static first = new Day(0)
    static second = new Day(1)
    static third = new Day(2)
    static fourth = new Day(3)
    static fifth = new Day(4)

    static all = [Day.first, Day.second, Day.third, Day.fourth, Day.fifth]
}

class Time {
    constructor(hours, minutes) { Int, Int > Time
        this.hours = clamp(hours, 0, 23)
        this.minutes = clamp(minutes, 0, 59)
    }
    equals(time) { Time > Boolean
        return this.hours === time.hours && this.minutes === time.minutes
    }
}

class Lesson {
    constructor(day, begin, end) { Day, Time, Time > Lesson
        this.day = day
        this.begin = begin
        this.end = end
        this.code = parseInt(`${day.id}${begin.hours}${begin.minutes}${end.hours}${end.minutes}`)
    }
    equals(lesson) { Lesson > Boolean
        return this.code === lesson.code
        // return this.day.equals(lesson.day)
        //     && this.begin.equals(lesson.begin)
        //     && this.end.equals(lesson.end)
    }
    static fromString(string) {
        return string // todo: implement
    }
}

class Teacher {
    constructor(id, name) { Int, String > Teacher
        this.id = id
        this.name = name
    }
    static fromJson(json) {
        return new Teacher(json.id, json.name)
    }
    static notYet = new Teacher(999, "not defined yet")
}

class Option {
    subject = Lateinit[Subject]
    constructor(code, lessons, teacher = Teacher.notYet) { Int, [Lesson], Teacher > Option
        this.code = code
        this.lessons = lessons
        this.teacher = teacher
    }
}

class Subject {
    constructor(code, name, options) { Int, String, [Option] > Subject
        this.fullCode = code
        code = code.split(/\s+/)
        this.code = code[0]
        this.codename = code[1]
        this.name = name
        this.options = options
        this.hours = this.options[0].lessons.length

        this.options.forEach(option => option.subject = this)
    }
}

class Table {
    constructor(options) { [Option] > Table
        this.options = options
        this.hours = this.options.reduce((total, option) => total + option.lessons.length, 0)
        this.subjectCodes = this.options.map(option => option.subject.fullCode)
        this.optionCodes = this.options.map(option => option.code)

        const lessons = this.options.flatMap(option => option.lessons)

        this.lessonCodes = lessons.map(lesson => lesson.code)
        
        const hours = lessons.map(lesson => lesson.begin.hours)

        this.minHour = hours.reduce((min, hour) => min < hour ? min : hour, 99)
        this.maxHour = hours.reduce((max, hour) => max > hour ? max : hour, 0)
    
    }
    hourList() {
        return Array(this.maxHour - this.minHour + 1).fill().map((_, index) => index + this.minHour)
    }
}

class TableCollection {
    static all = []
    static excepted = {
        hours: [],
        subjects: [],
        options: [],
        lessons: [],
    }
    static required = {
        hours: [],
        subjects: [],
        options: [],
        lessons: [],
    }
    static filtered = []
    static hourList = []
    static subjects = []

    static requireHour(requiredHour) {
        TableCollection.required.hours = [requiredHour]
        TableCollection.excepted.hours = TableCollection.hourList
            .filter(hour => hour !== requiredHour)
        TableCollection.filter()
    }
    static allowHour(allowedHour) {
        TableCollection.excepted.hours = TableCollection.excepted.hours
            .filter(hour => hour !== allowedHour)
        TableCollection.required.hours = []
        TableCollection.filter()
    }
    static exceptHour(exceptedHour) {
        TableCollection.excepted.hours = [...new Set(
            TableCollection.excepted.hours.concat(exceptedHour)
        )]
        TableCollection.required.hours = TableCollection.required.hours
            .filter(hour => hour !== exceptedHour)
        TableCollection.filter()
    }

    static requireSubject(requiredSubject) {
        TableCollection.required.subjects = [...new Set(
            TableCollection.required.subjects.concat(requiredSubject)
        )]
        TableCollection.excepted.subjects = TableCollection.excepted.subjects
            .filter(subject => subject !== requiredSubject)
        TableCollection.filter()
    }
    static allowSubject(allowedSubject) {
        TableCollection.required.subjects = TableCollection.required.subjects
            .filter(subject => subject !== allowedSubject)
        TableCollection.excepted.subjects = TableCollection.excepted.subjects
            .filter(subject => subject !== allowedSubject)
        TableCollection.filter()
    }
    static exceptSubject(exceptedSubject) {
        TableCollection.excepted.subjects = [...new Set(
            TableCollection.excepted.subjects.concat(exceptedSubject)
        )]
        TableCollection.required.subjects = TableCollection.required.subjects
            .filter(subject => subject !== exceptedSubject)
        TableCollection.filter()
    }

    static requireOption() {}
    static allowOption() {}
    static exceptOption() {}

    static requireLesson(requiredLesson) {
        TableCollection.required.lessons = [...new Set(
            TableCollection.required.lessons.concat(requiredLesson)
        )]
        TableCollection.excepted.lessons = TableCollection.excepted.lessons
            .filter(lesson => lesson !== requiredLesson)
        TableCollection.filter()
    }
    static allowLesson(allowedLesson) {
        TableCollection.required.lessons = TableCollection.required.lessons
            .filter(lesson => lesson !== allowedLesson)
        TableCollection.excepted.lessons = TableCollection.excepted.lessons
            .filter(lesson => lesson !== allowedLesson)
        TableCollection.filter()
    }
    static exceptLesson(exceptedLesson) {
        TableCollection.excepted.lessons = [...new Set(
            TableCollection.excepted.lessons.concat(exceptedLesson)
        )]
        TableCollection.required.lessons = TableCollection.required.lessons
            .filter(lesson => lesson !== exceptedLesson)
        TableCollection.filter()
    }

    static filter() {
        const { excepted, required } = TableCollection
        console.log("filter tables")
        console.log({excepted, required})
        TableCollection.filtered = TableCollection.all // pre
            .filter(table => {
                if (required.hours.length == 1 && table.hours != required.hours[0]) {
                    return false
                }
                for (const exceptedHours of excepted.hours) {
                    if (table.hours === exceptedHours) {
                        return false
                    }
                }
                for (const requiredSubject of required.subjects) {
                    if (!table.subjectCodes.includes(requiredSubject)) {
                        return false
                    }
                }
                for (const exceptedSubject of excepted.subjects) {
                    if (table.subjectCodes.includes(exceptedSubject)) {
                        return false
                    }
                }
                for (const requiredOption of required.options) {
                    if (!table.optionCodes.includes(requiredOption)) {
                        return false
                    }
                }
                for (const exceptedOption of excepted.options) {
                    if (table.optionCodes.includes(exceptedOption)) {
                        return false
                    }
                }
                for (const requiredLesson of required.lessons) {
                    if (!table.lessonCodes.includes(requiredLesson)) {
                        return false
                    }
                }
                for (const exceptedLesson of excepted.lessons) {
                    if (table.lessonCodes.includes(exceptedLesson)) {
                        return false
                    }
                }

                return true
            })
        query("#filtered-table-count").textContent = TableCollection.filtered.length
    }

    static prepare() {
        TableCollection.minHour = 99
        TableCollection.maxHour = 0
        for (const table of TableCollection.all) {
            if (table.hours < TableCollection.minHour) {
                TableCollection.minHour = table.hours
            }
            if (table.hours > TableCollection.maxHour) {
                TableCollection.maxHour = table.hours
            }
        }
        console.log({arrayLength: TableCollection.maxHour - TableCollection.minHour + 1})
        TableCollection.hourList = Array(TableCollection.maxHour - TableCollection.minHour + 1)
            .fill()
            .map((_, index) => index + TableCollection.minHour)

        TableCollection.lessons = TableCollection.subjects
            .flatMap(subject => subject.options)
            .flatMap(option => option.lessons)
            .reduce((lessons, lesson) => {
                for (const tableLesson of lessons) {
                    if (tableLesson.code === lesson.code) {
                        return lessons
                    }
                }
                return lessons.concat(lesson)
            }, [])

        TableCollection.lessonMinHour = 99
        TableCollection.lessonMaxHour = 1

        TableCollection.lessons.forEach(lesson => {
            if (lesson.begin.hours < TableCollection.lessonMinHour) {
                TableCollection.lessonMinHour = lesson.begin.hours
            }
            if (lesson.begin.hours > TableCollection.lessonMaxHour) {
                TableCollection.lessonMaxHour = lesson.begin.hours
            }
        })
        
        TableCollection.selectLessonHours = Array(
                TableCollection.lessonMaxHour - TableCollection.lessonMinHour + 1
            )
            .fill()
            .map((_, index) => index + TableCollection.lessonMinHour)
    }

    static get(number) {
        return Object.entries(TableCollection.filtered.slice(0, number))
    }
}

class Separator {
    static subjects = Lateinit[Subject]
    // static filterWorkers = Array(navigator.hardwareConcurrency ?? 4)
    //     .fill()
    //     .map(() => {
    //         const worker = new Worker("filter-tables-worker.js")
    //         worker.onmessage = event => {
    //             TableCollection.all.push(...event.data.map(options => new Table(options)))
    //         }
    //         return worker
    //     })
    static async generateSubjectTables(subjects) { [Subject] > [Table]
        // return lol()
        Separator.subjects = subjects
        TableCollection.subjects = subjects
        let result = []; [[Subject]]
        for (let length = 2; length <= subjects.length; length++) {
            result = result.concat(Separator.generateSubjectPermutations(length, subjects))
        }

        for (const preTable of result) {
            const filtered = await Separator.filterTables(preTable)
            await sleep(1)
            TableCollection.all.push(...filtered)
            query("span#all-table-count").textContent = TableCollection.all.length
            // console.log(TableCollection.all.length)
        }

        TableCollection.prepare()

        return TableCollection.all
    }
    static generateSubjectPermutations(length, subjects) { Int, [Subject] > [[Subject]]
        return Array(length).fill() // create
            .map((_, index) => Array(subjects.length - length + 1).fill().map(
                (_, subIndex) => subIndex + index
            ))
            .reduce(Separator.generateMatrix, [])
            .filter(array => {
                for (var i = 1; i < array.length; i++) { // check for order
                    if (array[i] <= array[i - 1]) {
                        return false
                    }
                }
                if (new Set(array).size !== array.length) { // check for repetition maybe redundant
                    return false
                }
                return true
            })
            .map(array => array.map(index => subjects[index]))
    }
    static filterTables(preTable) { [Subject] > Promise[Table]
        return preTable
            .map(subject => subject.options)
            .reduce(Separator.generateMatrix, [])
            .filter(options => {
                const lessons = options.flatMap(option => option.lessons)
                // if (printed-- > 0) console.log(lessons)
                for (let first = 0; first < lessons.length - 1; first++) {
                    for (let second = first + 1; second < lessons.length; second++) {
                        if (lessons[first].equals(lessons[second])) {
                            return false
                        }
                    }
                }
                return true
            })
            .map(options => new Table(options))
    }
    static generateMatrix(accumulator, subArray) {
        if (accumulator.length == 0) {
            return subArray.map(element => [element])
        }
        return accumulator.flatMap(
            array => subArray.map(element => array.concat(element))
        )
    }
}

async function runUi() {

    Node.prototype.removeAllChild = function() {
        for (const child of Array.from(this.childNodes)) {
            this.removeChild(child)
        }
    }
        console.log("lol")
        query("body").innerHTML = ""
        const styleElement = document.createElement("style")
        styleElement.innerHTML = `
        * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    button {
        outline-color: transparent;
        border-color: transparent;
        background: transparent;
        color: inherit;
        font-size: inherit;
    }
    
    :root {
        --min: min(1vw, 1vh);
        --mid: calc(0.5vw + 0.5vh);
        --max: max(1vw, 1vh);
    }
    
    html, body, #app {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
    
    #app {
        background: #333;
        color: #eee;
        font-size: calc(3 * var(--mid));
        font-weight: 400;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }
    
    header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100vw;
        height: calc(14 * var(--mid));
    }
    
    header .table-count {
        background: #0905;
        /* width: calc(45 * var(--mid)); */
        width: 100%;
        height: calc(7 * var(--mid));
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 calc(3 * var(--mid));
    }
    
    header .table-count span.table-counter {
        display: flex;
        justify-content: center;
        /* background: #000; */
        width: 25%;
    }
    
    header nav {
        /* width: calc(55 * var(--mid)); */
        width: 100%;
        height: calc(7 * var(--mid));
        /* background: rgb(0, 154, 149); */
        display: flex;
        justify-content: space-between;
        /* padding: 0 calc(1 * var(--mid)); */
        padding: 0 calc(3 * var(--mid));
        align-items: center;
        cursor: default;
        user-select: none;
    }
    
    header nav button {
        width: 100%;
        height: 100%;
        /* background: #6e0096; */
        cursor: pointer;
        transition: .3s;
    }
    
    header nav button:hover {
        background: #0907;
    }
    
    header nav button:active {
        background: #0909;
    }
    
    /* .app-body-container {
        background: rgb(124, 2, 2);
        width: 100vw;
        height: calc(100vh - 7 * var(--mid));
        display: flex;
        padding: var(--min);
        gap: var(--min);
    } */
    
    .select-area {
        /* background: rgba(255, 0, 0, 0.27); */
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--max);
        transition: .3s;
        overflow: auto;
        min-height: 0px;
        /* max-height: 0px;
        height: 0px; */
    
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    
    .select-area::-webkit-scrollbar {
    /* Hide scrollbar for Chrome, Safari and Opera */
        display: none;
    }
    
    .select-area.open {
        min-height: calc(100vh - 14 * var(--mid));
    }
    
    .select-hour-area,
    .select-subject-area {
        width: 100%;
        display: flex;
        flex-direction: column;
        user-select: none;
    }
    
    .select-hour-area .select-status,
    .select-subject-area .select-status {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        height: calc(7 * var(--mid));
    }
    
    
    .select-hour-area .select-status span,
    .select-subject-area .select-status span {
        width: 35%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(7 * var(--mid));
        cursor: pointer;
    }
    
    .required {
        background: #07f5;
    }
    
    .allowed {
        background: #0f75;
    }
    
    .excepted {
        background: #f335;
    }
    
    .select-hour-area .hour-count,
    .select-subject-area .subject-name {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(7 * var(--mid));
    }
    
    .option-name {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: calc(5 * var(--max));
        padding: 0 calc(7 * var(--max));
        height: calc(7 * var(--mid));
    }
    
    .table-list {
        width: calc(100%);
        /* background: rgb(88, 88, 0); */
        overflow-x: hidden;
        overflow-x: scroll;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        display: flex;
        flex-direction: column;
    }
    
    .table-list::-webkit-scrollbar {
        /* Hide scrollbar for Chrome, Safari and Opera */
        display: none;
    }
    
    .table-list-button {
        display: flex;
        /* justify-content: space-between; */
        flex-direction: column;
        align-items: center;
        /* min-height: calc(10 * var(--mid)); */
        background: #0953;
        /* cursor: pointer; */
        transition: 0.3s;
        border-bottom: 1px solid #777;
        user-select: none;
    }
    
    /* .table-list-button:hover {
        background: #0957;
    }
    
    .table-list-button:active {
        background: #095b;
    } */
    .table-header {
        width: 100%;
        min-height: calc(10 * var(--mid));
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 calc(3 * var(--mid));
    }
    
    .table-header span {
        width: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(10 * var(--mid));
    }
    
    .table-header-index, .table-header-subjects {
        cursor: pointer;
    }
    
    .table-header-index:hover, .table-header-index:active,
    .table-header-subjects:hover, .table-header-subjects:active {
        background: #0f03;
    }
    
    .table-area {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .table-body {
        width: 100%;
        height: 100%;
        background: rgb(38, 1, 125);
        display: flex;
    }
    
    .table-body-column {
        background: #333;
        height: 100%;
        width: 17%;
        position: relative;
    }
    
    .table-cell {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: calc(7 * var(--mid));
        font-size: calc(2.7 * var(--mid)) !important; /* why need important? */
        /* border: 2px dotted rgb(1, 1, 104); */
    }
    
    #table-body-column .day-lesson-shadow  {
        position: absolute;
        top: 0;
        width: 100%;
    }
    
    #table-body-hours .table-cell {
        border-bottom: 1px solid #aaa;
    }
    
    .table-hour-cell {
        border-bottom: 1px solid #aaa;
    }
    
    .select-cell {
        box-shadow: inset 0 0 0 calc(0.5 * var(--min)) #333;
    }
    
    .select-lesson-popup {
        position: absolute;
        background: #333;
        border: 1px solid #def;
        font-size: calc(5 * var(--mid));
        width: 70%;
        top: 10%;
        left: 15%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10%;
        gap: calc(7 * var(--mid));
    }
    
    .select-lesson-title {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: calc(2 * var(--mid));
    }
    
    .select-lesson-body {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: calc(3 * var(--mid));
    }
    
    .select-lesson-body span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        gap: calc(3 * var(--mid));
        padding: calc(2 * var(--mid));
    }
    
    .initial-subject-list {
        position: absolute;
        width: 90%;
        height: 80%;
        top: 14%;
        left: 5%;
        display: flex;
        flex-direction: column;
        gap: var(--max);
        padding: var(--max);
        border: 1px solid #def;
        font-size: calc(3.5 * var(--mid));
        overflow: auto;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    
    .initial-subject-list::-webkit-scrollbar {
        /* Hide scrollbar for Chrome, Safari and Opera */
        display: none;
    }
    
    .initial-subject-list .select-subject-area {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--max);
        /* border: 1px solid #def; */
    }
    `
    document.body.appendChild(styleElement)
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
        // setTimeout(globalTest, 1)
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
    

;(async function main() {
    loadStyle();
    const subjectJsonList = await loadData()
    const subjects = await parseSubjects(subjectJsonList)
    console.log(subjects)
    runUi()
    showInitialSubjects(subjects)
    await Separator.generateSubjectTables(subjects)
    TableCollection.filter()
    query("span#all-table-count").textContent = TableCollection.all.length
    query("span#filtered-table-count").textContent = TableCollection.filtered.length
    showList()

})();
// hazf ua idofa
async function loadStyle() {
    document.head.innerHTML = `
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jadual 4.0</title>
    `

    await new Promise(resolve => setTimeout(resolve, 1000))

    await new Promise(resolve => setTimeout(resolve, 10))
    const tag = document.createElement("link")
    tag.rel = "stylesheet"
    tag.href = jadualyAddress + "style.css"
    document.head.appendChild(tag)
    await new Promise(resolve => setTimeout(resolve, 1000))
}




async function parseSubjects(subjectJsonList) {
    const subjectCount = subjectJsonList.length
    const subjects = []
    const lessonCounts = [2, 3, 3, 4, 3, 4, 5, 1, 1, 2, 2]

    for (let subjectIndex = 0; subjectIndex < subjectCount; subjectIndex++) {


        const subjectCode = subjectJsonList[subjectIndex].fullCode
        const subjectName = subjectJsonList[subjectIndex].name

        const options = []
        const optionCount = subjectJsonList[subjectIndex].options.length
        const lessonCount = subjectJsonList[subjectIndex].hours
        for (let optionIndex = 0; optionIndex < optionCount; optionIndex++) {
            const optionJson = subjectJsonList[subjectIndex].options[optionIndex]
            const optionCode = +optionJson.code
            // const teacher = Teacher.fromJson(mockTeachers.spliceRandom())

            const lessons = []

            // console.log(optionJson)
            for (let lessonIndex = 0; lessonIndex < lessonCount; lessonIndex++) {
                const lessonJson = optionJson.lessons[lessonIndex]
                if (lessonJson === undefined) {
                    console.log({subjectCode, subjectName, optionCode, optionJson, lessonJson, lessonIndex})
                    break
                }
                const lessonDay = lessonJson.day
                const begin = new Time(lessonJson.beginHours, lessonJson.beginMinutes)
                const end = new Time(lessonJson.endHours, lessonJson.endMinutes)
                lessons.push(new Lesson(new Day(lessonDay), begin, end))
            }

            options.push(new Option(optionCode, lessons)) // to teacher by now
        }
        subjects.push(new Subject(subjectCode, subjectName, options))
    }
    const colors = [
        "#9007", "#0907", "#0097", "#9907", "#9097", "#0997", "#9557", "#595", "#559", "#000"
    ]
    subjects.forEach(subject => subject.color = colors.spliceRandom())
    console.log(subjects.map(subject => [subject.codename, subject.name]))
    return subjects

}











function loadData() {
    return new Promise(resolve => {
    document.body.innerHTML = "<div style='font-size:48px'>Please wait</div>"
    var iframe = document.createElement("iframe")
    document.body.appendChild(iframe)
    iframe.width = 0
    iframe.height = 0
    iframe.src = "https://eduportal.iu.edu.sa/iu/ui/student/homeIndex.faces"

    const waitDuration = 7000
    const waitStep = 1000

    iframe.onload = async function() {
        console.log("loaded main")
        // await sleep(1000)
        var hazfIdofaLink = iframe.contentDocument.getElementById("menuForm:serLinkDropAdd2")
        
        hazfIdofaLink.click()
        iframe.onload = async function() {
            iframe.onload = () => {}
            console.log("loaded hazf ua idofa")
            var doc = iframe.contentDocument
            const subjectsJson = await findSubjects(doc)
            console.log(subjectsJson)
            resolve(subjectsJson)
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async function findSubjects(doc) {
        const subjectRows = doc.querySelectorAll("tr[align='center'")
        console.log(subjectRows.length)
        const subjectList = []
        console.log("reading subjects")

        for (const subjectRow of subjectRows) {
            // break;
            const children = [...subjectRow.querySelectorAll("td")]
            // const reversed = [...subjectRow.querySelectorAll("td")].reverse()

            const fullCode = children[0].innerText
            const name = children[1].innerText
            const hours = +children[3].innerText
            const firstOptionCode = children[4].innerText


            const daysAndTimesNodes = [...subjectRow.querySelectorAll("td.fontTextSmall")]
            const daysAndTimes = parseDaysAndTimes(daysAndTimesNodes, {fullCode})

            const options = [
                {
                    code: firstOptionCode,
                    lessons: daysAndTimes,
                }
            ]

            // console.log({options})



            subjectRow.querySelectorAll("a")[2].click()

            await sleep(waitDuration)
            console.log("options opened")

            const additionalOptionsTable = doc.querySelector("div#divsData")
            const closeButton = additionalOptionsTable.querySelector("img[align='bottom']")
            // console.log({closeButton})

            try {
                const optionRows = [
                    ...doc
                        .querySelector("div#tabelSectionContainer")
                        .querySelector("tbody")
                        .childNodes
                ].filter((_, index) => index % 2 == 0)

                optionRows.pop() // remove last

                for (const optionRow of optionRows) {
                    const optionCode = +optionRow.querySelector("a").innerText

                    const daysAndTimesNodes = [...optionRow.querySelectorAll("nobr")]
                    const daysAndTimes = parseDaysAndTimes(daysAndTimesNodes, {fullCode, sec:"second"})

                    options.push({
                        code: optionCode,
                        lessons: daysAndTimes
                    })
                }
            } catch (error) {}

            // console.log({optionRows})

            await sleep(waitDuration)
            closeButton.click()
            await sleep(waitDuration)

            console.log("options closed")

            

            subjectList.push({ fullCode, name, hours, options })
            document.body.appendChild(html`
                <div style="font-size:36px">${fullCode} ${name}</div>
            `)

        }


        doc.querySelector("td.fontText[align='right'] a").click()

        await sleep(waitDuration)
        
        const additionalSubjectRows = [
            ...iframe.contentDocument.querySelectorAll("tr[align='center']")
        ]
        for (const subjectRow of additionalSubjectRows) {
            try {
            subjectRow.querySelector("input[type='checkbox']").click()
            // console.log(subjectRow)

            const subjectCode = subjectRow.querySelectorAll("td")[1].innerText
            const subjectName = subjectRow.querySelectorAll("td")[2].innerText
            const subjectHours = +(subjectRow.querySelectorAll("td")[2].innerText)
            subjectRow.querySelector("img").parentNode.click()
            await sleep(waitDuration)



            const additionalOptionsTable = doc.querySelector("div#divsData")
            const closeButton = additionalOptionsTable.querySelector("img[align='bottom']")
            // console.log({closeButton})

            const options = []

            try {
                const optionRows = [
                    ...iframe.contentDocument
                        .querySelectorAll("div#divsData tbody .tableContainer")
                ]

                // optionRows.pop() // remove last

                for (const optionRow of optionRows) {
                    console.log({optionRow})
                    const optionCode = +(optionRow.querySelector("a").innerText)
                    console.log({optionCode})

                    const daysAndTimesNodes = [...optionRow.querySelectorAll("nobr")]

                    const daysAndTimes = parseDaysAndTimes(daysAndTimesNodes, {lol:1})

                    options.push({
                        code: optionCode,
                        lessons: daysAndTimes
                    })
                }
            } catch (error) {
                console.log(error)
            }

            await sleep(waitDuration)

            closeButton.click()

            await sleep(waitDuration)


            console.log({options})

            subjectList.push({ fullCode: subjectCode, name: subjectName, hours: subjectHours, options })
            document.body.appendChild(html`
                <div style="font-size:36px">${subjectCode} ${subjectName}</div>
            `)

            subjectRow.querySelector("input[type='checkbox']").click()
        } catch (error) {
            console.log(error)
        }

        }


        await sleep(1000)



        return subjectList
    }
    })

    function parseDaysAndTimes(daysAndTimesNodes, info) {
        const daysAndTimes = []
        for (let index = 0; index < daysAndTimesNodes.length; index += 3) {
            const days = daysAndTimesNodes[index].innerText
            let time = daysAndTimesNodes[index + 1].innerText
            let timeAddition = 0;
            if (time.split("").includes("م")) {
                timeAddition = 12
            }
            time = time.replace(/[مص\s]+/gi, "")
            let [beginHours, beginMinutes, endHours, endMinutes] = time
                .split("-")
                .flatMap(t => t.split(":"))
                .map(str => +str)
            
            if (beginHours != 12) {
                beginHours = beginHours + timeAddition
                endHours = endHours + timeAddition
            }

            if (beginHours == 0) {
                console.log({beginHours, info})
            }

            // console.log({beginHours, timeAddition})
                
            for (const day of days.split(" ").map(day => +day)) {
                daysAndTimes.push({ day, beginHours, beginMinutes, endHours, endMinutes })
            }
        }
        return daysAndTimes
    }
}
