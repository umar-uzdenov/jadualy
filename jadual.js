    const li = document.createElement("li")
    li.className = "nav-item dropdown"
    const a = document.createElement("a")
    a.className = "nav-link"
    a.textContent = "جدولي - مساعد الحذف والإضافة"
    a.addEventListener("click", () => console.log("launching jadual"))
    li.appendChild(a)
    document.querySelectorAll("#headerForm>ul")[0].appendChild(li)
