const alertBox = document.querySelector(".alert-box");
const openButton = document.querySelector(".open-button");
const closeButton = document.querySelector(".close-button");

function openAlertBox() {
  alertBox.style.display = "flex";
}

function closeAlertBox() {
  alertBox.style.display = "none";
}

openButton.addEventListener("click", openAlertBox);
closeButton.addEventListener("click", closeAlertBox);
