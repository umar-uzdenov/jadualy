function query(selector) {
    return document.querySelector(selector)
}

function  queryAll(selector) {
    return [...document.querySelectorAll(selector)]
}

Node.prototype.query = function(selector) {
    return this.querySelector(selector)
}

Node.prototype.queryAll = function(selector) {
    return this.querySelectorAll(selector)
}

function iOS() {
    return [
        'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
};

function detectMobile() {
    return [
        /Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i
    ].some(toMatch => navigator.userAgent.match(toMatch))
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

// let toastTimeout
// function toast(text) {
//     try {
//         clearTimeout(toastTimeout)
//         if (typeof text == "object") text = JSON.stringify(text, 0, 4)
//         const parent = query("#toast")
//         const child = parent.querySelector("div")
//         child.textContent = text
//         parent.classList.remove("invisible")
//         toastTimeout = setTimeout(() => {
//             parent.classList.add("invisible")
//         }, 10000)
//     } catch (error) {}
// }


function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max))
}

function safeCall(fun, log = false) {
    try { fun() } catch (error) { if (log) console.error(error) }
}

function html(segments, ...args) {
    const string = segments.reduce((acc, segment, i) =>  acc + segment + (args[i] || ''), '')
    const element = new DOMParser().parseFromString(string, "text/html").querySelector("body").childNodes[0]

    safeCall(() => {
        document.head.appendChild(element) // activate element
        document.head.removeChild(element) // deattach it
    })

    return element
}

function css(segments, ...args) {
    return segments.reduce((acc, segment, i) =>  acc + segment + (args[i] || ''), '')
}

function trim(segments, ...args) {
    const lines = segments
        .reduce((acc, segment, i) =>  acc + segment + (args[i] || ''), '') // get raw string
        .trimEnd().split('\n') // Split the raw string into lines
        .filter(line => line != "") // remove empty lines

    // Find the minimum number of leading spaces across all lines
    const minLeadingSpaces = lines.reduce((acc, line) => {
        // Find the number of leading spaces for this line
        const leadingSpaces = line.match(/^ */)[0].length
        // if it has less leading spaces than the previous minimum, set it as the new minimum
        return leadingSpaces < acc ? leadingSpaces :  acc
    }, Infinity)

    // Trim lines, join them and return the result
    return lines.map(line => line.substring(minLeadingSpaces)).join('\n')
}

function random(min, max) { // min and max included
    return Math.ceil(Math.random() * (max - min + 1) + min - 1)
}