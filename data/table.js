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