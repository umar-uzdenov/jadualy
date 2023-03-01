function runDataDataTest() {
    const intClassExist = Int !== undefined && Int !== null
    return test(intClassExist, "Int class should exist")
}