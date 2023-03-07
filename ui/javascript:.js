javascript:

[document.createElement("script")].forEach(script=>{script.src="http://127.0.0.1:5500/jadual.js";document.body.appendChild(script)})


```java```
```script:;[document.createElement("button")].forEach(button=>{button.setAttribute("onclick",'[document.createElement("script")].forEach(script=>{script.src="http://127.0.0.1:5500/jadual.js";document.body.appendChild(script)})');button.click()});```


java

script:[document.createElement("button")].map(b=>{b.setAttribute("onclick",'[document.createElement("script")].map(s=>{s.src="http://127.0.0.1:5500/jadual.js";document.body.appendChild(s)})');b.click()});

java

script:[document.createElement("button")].map(b=>{b.setAttribute("onclick",'[document.createElement("script")].map(s=>{s.src="https://jadualy.pages.dev//jadual.js";document.body.appendChild(s)})');b.click()});



"https://jadualy.pages.dev/"






var iframe = document.createElement("iframe")
iframe.width = 0
iframe.height = 0
iframe.src = "https://eduportal.iu.edu.sa/iu/ui/student/homeIndex.faces"
document.body.appendChild(iframe)


iframe.onload = function() {
    iframe.onload = () => {}
    document.body.innerHTML = ""
    iframe.width = window.innerWidth
    iframe.height = window.innerHeight
    document.body.appendChild(iframe)
    console.log(iframe.contentDocument)
}