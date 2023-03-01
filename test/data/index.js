function runDataTests() {
    return test(
        runDataDataTest() &&
        runDataTimeTest() &&
        runDataDayTest(),
        "Data"
    )
}