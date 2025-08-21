const toggle = document.querySelector(".navbar_toggle");
const menu = document.querySelector(".navbar_menu");
const icon = toggle.querySelector("i");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
  toggle.classList.toggle("open");

  if (icon.classList.contains("fa-bars")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-xmark");
  } else {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  }
});
