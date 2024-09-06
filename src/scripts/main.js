"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // --- Display Date ---
  const today = new Date();
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const day = today.getDate();
  const month = months[today.getMonth()];
  const formattedDate = `${day} ${month}`;
  document.getElementById("date").textContent = formattedDate;

  // --- Countdown Timer ---
  const webinarEndTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    21,
    0,
    0
  );

  function updateTime() {
    const now = new Date();
    const remainingTime = webinarEndTime - now;

    if (remainingTime > 0) {
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      document.getElementById(
        "duration"
      ).textContent = `${hours}ч ${minutes}мин`;
    } else {
      document.getElementById("duration").textContent = "Вебинар завершён";
    }
  }

  setInterval(updateTime, 1000);
  updateTime();

  // --- Initialize Phone Input ---
  const phoneInputField = document.getElementById("phone");
  const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "auto",
    geoIpLookup: function (callback) {
      fetch("https://ipinfo.io/json")
        .then((resp) => resp.json())
        .then((resp) => {
          const countryCode = resp && resp.country ? resp.country : "us";
          callback(countryCode);
        });
    },
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  // --- Form Validation & Submission ---
  const form = document.getElementById("registration-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = phoneInput.getNumber().trim();
    const email = document.getElementById("email").value.trim();

    // Check if any field is empty
    if (!name || !phone || !email) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Введите корректный email.");
      return;
    }

    // Phone number validation using intlTelInput
    if (!phoneInput.isValidNumber()) {
      alert("Введите корректный номер телефона.");
      return;
    }

    sendFormDataToTelegram(name, phone, email);
  });

  function sendFormDataToTelegram(name, phone, email) {
    const token = "7304495894:AAHcSG-VFjzTL3upk8S4bYSVqnmcnULSkkc";
    const chatId = "-1002369335147";
    const message = `Ім'я: ${name}\nТелефон: ${phone}\nEmail: ${email}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Данные успешно отправленны!");
        } else {
          alert("Ошибка при отправлении данных.");
        }
      })
      .catch((error) => {
        alert("Случилась ошибка: " + error.message);
      });
  }
});
