
var iframe = document.createElement("iframe")
iframe.width = 600
iframe.height = 400
iframe.src = "https://eduportal.iu.edu.sa/iu/ui/student/homeIndex.faces"
document.body.innerHTML = ""
document.body.appendChild(iframe)


iframe.contentWindow