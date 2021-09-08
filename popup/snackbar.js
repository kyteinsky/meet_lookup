
module.exports = () => {
  const snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  setTimeout(() => {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}
