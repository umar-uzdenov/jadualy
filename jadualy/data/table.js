class Table {
    constructor(options) { [Option] > Table
        this.options = options
        this.hours = this.options.reduce((total, option) => total + option.lessons.length, 0)
        this.subjectCodes = this.options.map(option => option.subject.code)
        this.optionCodes = this.options.map(option => option.code)
        this.lessonCodes = this.options.flatMap(option => option.lessons.map(lesson => lesson.code))
    }
}