onmessage = event => {
    setTimeout(() => {
        postMessage({index: event.data.index, element: `result: ${event.data.element}`})
    }, Math.round(Math.random() * 700 + 300))
}