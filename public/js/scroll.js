function onScroll() {
  const header = document.getElementById("header")
  if (window.scrollY > 0) {
    header.classList.add("scrolled")
  } else {
    header.style.transition = "none"
    header.classList.remove("scrolled")
    header.offsetHeight
    header.style.transition = ""
  }
}

document.addEventListener("scroll", onScroll)
