function runDataDayTest() {
    for (index = 0; index < 999; index++) {
        const day = new Day(random(-99, 99))
        const dayBetween0and4 = day.id >=0 && day.id <= 4
        if (!dayBetween0and4) {
            return fail("Day id must be between 0..4")
        }
    }
    return true
}