class Subject {
    constructor(code, name, options) { Int, String, [Option] > Subject
        this.code = code
        this.name = name
        this.options = options
        this.hours = this.options[0].lessons.length

        this.options.forEach(option => option.subject = this)
    }
}