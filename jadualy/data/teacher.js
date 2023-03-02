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