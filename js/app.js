const alertBox = document.querySelector(".alert-box");
const openButton = document.querySelector(".open-button");
const closeButton = document.querySelector(".close-button");

function handleAlertBox(displayValue) {
  alertBox.style.display = displayValue;
}

openButton.addEventListener("click", handleAlertBox("flex"));
closeButton.addEventListener("click", handleAlertBox("none"));
