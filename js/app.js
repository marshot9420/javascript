const navbarToggler = document.querySelector(".navbar-toggler");
const listGroup = document.querySelector(".list-group");

function handleToggleNavbar() {
  if (listGroup.classList.contains("show")) {
    listGroup.classList.remove("show");
  } else {
    listGroup.classList.add("show");
  }
}

navbarToggler.addEventListener("click", handleToggleNavbar);
