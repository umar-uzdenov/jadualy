class Lesson {
    constructor(day, begin, end) { Day, Time, Time > Lesson
        this.day = day
        this.begin = begin
        this.end = end
        this.code = parseInt(`${day.id}${begin.hours}${begin.minutes}${end.hours}${end.minutes}`)
    }
    equals(lesson) { Lesson > Boolean
        return this.code === lesson.code
        return this.day.equals(lesson.day)
            && this.begin.equals(lesson.begin)
            && this.end.equals(lesson.end)
    }
}