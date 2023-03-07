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

        // if (TableCollection.minHour < 16) {
        //     TableCollection.excepted.hours = TableCollection.excepted.hours.concat(
        //         TableCollection.hourList.filter(hour => hour < 16)
        //     )
        // }

        // if (TableCollection.maxHour > 23) {
        //     TableCollection.excepted.hours = TableCollection.excepted.hours.concat(
        //         TableCollection.hourList.filter(hour => hour > 23)
        //     )
        // }
    }

    static get(number) {
        return Object.entries(TableCollection.filtered.slice(0, number))
        return Object.entries(TableCollection.filtered.reverse().slice(0, number))
        return Object.entries(TableCollection.filtered.slice(0, number))
    }
}