function runDataTimeTest() {
    const timeHours = runDataTimeHoursTests()
    const timeMinutes = runDataTimeMinutesTests()
    return test(timeHours && timeMinutes, "Some of Data Time tests failed")
}

function runDataTimeHoursTests() {
    for (let i = 0; i < 1023; i++) {
        const time = new Time(random(-99, 99), random(-99, 99))
        const timeHourMustBeBetween0and23 = time.hours >= 0 && time.hours <= 23
        if (!timeHourMustBeBetween0and23) {
            return fail("Time hours must be between 0 and 23, all included")
        }
    }
    return true
}

function runDataTimeMinutesTests() {
    for (let i = 0; i < 1023; i++) {
        const time = new Time(random(-99, 99), random(-99, 99))
        const timeHourMustBeBetween0and23 = time.minutes >= 0 && time.minutes <= 59
        if (!timeHourMustBeBetween0and23) {
            return fail("Time minutes must be between 0 and 59, all included")
        }
    }
    return true
}