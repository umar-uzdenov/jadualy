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

