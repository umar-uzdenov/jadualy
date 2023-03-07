;(function runTests() {
    // test(
    //     runDataTests(),
    //     "Some",
    //     "All tests passed"
    // )

    // setTimeout(globalTest, 1)
})();

const subjectData = [
    {
        code: "قرأ 3002",
        name: "القرآن الكريم",
    },
    {
        code: "لغة 3007",
        name: "النحو",
    },
    {
        code: "فسر 3001",
        name: "المدخل إلى علم التفسير",
    },
    {
        code: "سنه 3011",
        name: "المدخل إلى الحديث النبوي",
    },
    {
        code: "ترخ 3007",
        name: "السيرة النبوية",
    },
    {
        code: "دعو 3001",
        name: "أصول الدعوة و طرقها",
    },
    {
        code: "نظم 3011",
        name: "المدخل إلى دراسة الأنظمة",
    },
    {
        code: "عقد 3014",
        name: "التوحيد",
    },
    {
        code: "فقه 3505",
        name: "أخلاقيات المهنة",
    },
]

async function globalTest() {
    console.log("running global test")
    const subjectCount = 9
    const subjects = []
    const lessonCounts = [2, 3, 3, 3, 4, 5, 1, 1, 2, 2]
    for (let subjectIndex = 0; subjectIndex < subjectCount; subjectIndex++) {
        const subj = subjectData.spliceRandom()
        const subjectCode = subj.code
        const subjectName = subj.name

        const options = []
        const optionCount = random(2, 5)
        const lessonCount = lessonCounts.spliceRandom()
        for (let optionIndex = 0; optionIndex < optionCount; optionIndex++) {
            const optionCode = random(3, 15) * 100 + random(11, 99)
            const teacher = Teacher.fromJson(mockTeachers.spliceRandom())

            const lessons = []
            const days = [0, 1, 2, 3, 4]
            for (let lessonIndex = 0; lessonIndex < lessonCount; lessonIndex++) {
                const lessonDay = days.spliceRandom()
                const lessonHour = random(8, 13)
                const begin = new Time(lessonHour, 0)
                const end = new Time(lessonHour, 50)
                lessons.push(new Lesson(new Day(lessonDay), begin, end))
            }

            options.push(new Option(optionCode, lessons, teacher))
        }
        subjects.push(new Subject(subjectCode, subjectName, options))
    }
    const colors = ["#9007", "#0907", "#0097", "#9907", "#9097", "#0997", "#9557", "#595", "#559"]
    subjects.forEach(subject => subject.color = colors.spliceRandom())
    console.log(subjects.map(subject => [subject.codename, subject.name]))

    // console.time("separator")

    // const interval = setInterval(() => {
    //     query("#body").innerHTML = TableCollection.all.length
    // }, 1);
    // await sleep(300)
    showInitialSubjects(subjects)
    await Separator.generateSubjectTables(subjects)
    await TableCollection.filter()
    // clearInterval(interval)
    console.log(TableCollection.all.length)
    query("span#all-table-count").textContent = TableCollection.all.length
    query("span#filtered-table-count").textContent = TableCollection.filtered.length
    // console.timeEnd("separator")
    showList()
}
