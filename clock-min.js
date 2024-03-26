function updateClock() {
  let currentDate = new Date();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  if (hours > 12) {
    hours -= 12;
    meridiem = "PM";
  } else if (hours === 0) {
    hours = 12;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  document.getElementById("clock-min").textContent = +minutes;
}
updateClock();
setInterval(updateClock, 1000);
