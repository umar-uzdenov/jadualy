// postMessage("worker start")
// setTimeout(() => postMessage(101), 300)

onmessage = event => {
    postMessage({ index: event.data.index, element: filterTables(event.data.element) })
}

function filterTables(preTable) {
    return preTable
        .map(subject => subject.options)
        .reduce(generateMatrix, [])
        .filter(options => {
            const lessons = options.flatMap(option => option.lessons)
            // console.log(lessons)
            // if (printed-- > 0) console.log(lessons)
            for (let first = 0; first < lessons.length - 1; first++) {
                for (let second = first + 1; second < lessons.length; second++) {
                    if (lessons[first].code === (lessons[second].code)) {
                        return false
                    }
                }
            }
            return true
        })
}

function generateMatrix(accumulator, subArray) {
    if (accumulator.length == 0) {
        return subArray.map(element => [element])
    }
    return accumulator.flatMap(
        array => subArray.map(element => array.concat(element))
    )
}