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