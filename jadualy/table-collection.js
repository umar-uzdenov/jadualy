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

    static exceptHours(...hours) {}
    static allowHours() {}
    static requireHours() {}

    static exceptSubjects() {}
    static allowSubjects() {}
    static requireSubjects() {}

    static exceptOptions() {}
    static allowOptions() {}
    static requireOptions() {}

    static exceptLessons() {}
    static allowLessons() {}
    static requireLessons() {}

    static async filter() {
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
    }

    static get(number) {
        return Object.entries(TableCollection.filtered.reverse().slice(0, number))
        return Object.entries(TableCollection.filtered.slice(0, number))
    }
}