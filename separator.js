class Separator {
    static subjects = Lateinit[Subject]
    // static filterWorkers = Array(navigator.hardwareConcurrency ?? 4)
    //     .fill()
    //     .map(() => {
    //         const worker = new Worker("filter-tables-worker.js")
    //         worker.onmessage = event => {
    //             TableCollection.all.push(...event.data.map(options => new Table(options)))
    //         }
    //         return worker
    //     })
    static async generateSubjectTables(subjects) { [Subject] > [Table]
        // return lol()
        Separator.subjects = subjects
        let result = []; [[Subject]]
        for (let length = 2; length <= subjects.length; length++) {
            result = result.concat(Separator.generateSubjectPermutations(length, subjects))
        }
        // console.log(result)

        // console.time("one")
        // for (const preTable of result) {
        //     const filtered = await Separator.filterTables(preTable)
        //     TableCollection.all.push(...filtered)
        //     // console.log(TableCollection.all.length)
        // }
        // console.timeEnd("one")

        // TableCollection.all = []

        console.time("parallel")
        let count = 0
        result = await result.parallelMap(window.jadualyAddress + "filter-tables.js", element => {
            count += element.length
            query("span#all-table-count").textContent = count
            // console.log(count)
        })
        // console.log(count)
        
        result.forEach(tables => {
            TableCollection.all.push(...tables.map(options => new Table(options)))
        })
        console.timeEnd("parallel")

        return TableCollection.all
    }
    static generateSubjectPermutations(length, subjects) { Int, [Subject] > [[Subject]]
        return Array(length).fill() // create
            .map((_, index) => Array(subjects.length - length + 1).fill().map(
                (_, subIndex) => subIndex + index
            ))
            .reduce(Separator.generateMatrix, [])
            .filter(array => {
                for (var i = 1; i < array.length; i++) { // check for order
                    if (array[i] <= array[i - 1]) {
                        return false
                    }
                }
                if (new Set(array).size !== array.length) { // check for repetition maybe redundant
                    return false
                }
                return true
            })
            .map(array => array.map(index => subjects[index]))
    }
    static filterTables(preTable) { [Subject] > Promise[Table]
        return new Promise(resolve => {
            const worker = new Worker("filter-tables-worker.js")
            worker.onmessage = event => {
                resolve(event.data.map(options => new Table(options)))
            }
            worker.postMessage(preTable)
            // console.log(worker)
            // return
        })
        // await sleep(0) // to not freeze interface
        return preTable
            .map(subject => subject.options)
            .reduce(Separator.generateMatrix, [])
            .filter(options => {
                const lessons = options.flatMap(option => option.lessons)
                // if (printed-- > 0) console.log(lessons)
                for (let first = 0; first < lessons.length - 1; first++) {
                    for (let second = first + 1; second < lessons.length; second++) {
                        if (lessons[first].equals(lessons[second])) {
                            return false
                        }
                    }
                }
                return true
            })
            .map(options => new Table(options))
    }
    static generateMatrix(accumulator, subArray) {
        if (accumulator.length == 0) {
            return subArray.map(element => [element])
        }
        return accumulator.flatMap(
            array => subArray.map(element => array.concat(element))
        )
    }
}



function generateIndexes(length, size) {
    const matrix = Array(length).fill().map(
        (_, index) => Array(size - length + 1).fill().map(
            (_, subIndex) => subIndex + index
        )
    )
    let result = matrix.shift().map(element => [element])
    for (const matrixSubArray of matrix) {
        result = result.flatMap(
            subArray => matrixSubArray.map(
                matrixElement => [...subArray, matrixElement]
            )
        )
    }
    return result.filter(array => {
        for (var i = 0; i < array.length - 1; i++) { // check for order
            if (array[i] > array[i + 1]) {
                return false
            }
        }
        if ([...new Set(array)].length !== array.length) { // check for repetition
            return false
        }
        return true
    })
} 

async function lol() {
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    // const ggg = await parallelMap(array, data => {
    //     console.log(data)
    // })
    const ggg = await array.parallelMap("lol-worker.js", (index, element) => {
        console.log(element)
    })
    console.log(ggg)
}

Array.prototype.parallelMap = async function(workerName, callback) {
    const array = this
    const hardwareConcurrency = navigator.hardwareConcurrency ?? 4
    // console.log({hardwareConcurrency})
    const workerStatuses = Array(hardwareConcurrency).fill("work")
    const workerResults = Array(hardwareConcurrency).fill()
    const workerFilters = Array(hardwareConcurrency).fill().map((_, index) => {
        const worker = new Worker(workerName)
        // const worker = new Worker("filter-tables-worker.js")
        worker.onmessage = event => {
            workerStatuses[index] = "wait"
            workerResults[index] = event.data
            callback(event.data.element, event.data.index)
            // TableCollection.all.push(...event.data.map(options => new Table(options)))
        }
        return worker
    })
    const result = {}
    let globalIndex = 0
    for (const worker of workerFilters) { // itital launch
        const element = this[globalIndex]
        worker.postMessage({index: globalIndex, element })
        globalIndex += 1
        // console.log(element)
    }
    while (true) {
        const element = this[globalIndex]
        // console.log(element)
        findWorker:while (true) {
            for (let index = 0; index < hardwareConcurrency; index++) {
                if (workerStatuses[index] == "wait") {
                    result[workerResults[index].index] = workerResults[index].element
                    workerResults[index] = undefined
                    workerStatuses[index] = "work"
                    workerFilters[index].postMessage({index: globalIndex, element})
                    break findWorker
                }
            }
            await new Promise(resolve => setTimeout(resolve, 1))
        }
        globalIndex += 1
        if (globalIndex == this.length) break
    }
    while(true) {
        // console.log("last wait")
        for (let index = 0; index < hardwareConcurrency; index++) {
            if (workerStatuses[index] == "wait") {
                result[workerResults[index].index] = workerResults[index].element
                workerResults[index] = undefined
                workerStatuses[index] = "done"
            }
        }
        if (workerStatuses.indexOf("wait") === -1 && workerStatuses.indexOf("work") === -1) {
            // console.log(workerStatuses)
            break
        }
        await new Promise(resolve => setTimeout(resolve, 1))
    }
    return Object.entries(result)
        .sort((first, second) => +first[0] > +second[0])
        .map(object => object[1])
    console.log(res)
    return result
}