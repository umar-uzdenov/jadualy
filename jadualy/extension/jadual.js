with (document.createElement("button")) {
    setAttribute("onclick", `
        const script = document.createElement("script");
        script.src = "http://127.0.0.1:5500/jadual.js";
        document.body.appendChild(script);
    `)
    click()
}