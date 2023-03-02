class Time {
    constructor(hours, minutes) { Int, Int > Time
        this.hours = clamp(hours, 0, 23)
        this.minutes = clamp(minutes, 0, 59)
    }
    equals(time) { Time > Boolean
        return this.hours === time.hours && this.minutes === time.minutes
    }
}