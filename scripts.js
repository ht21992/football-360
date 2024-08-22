// Load the JSON file
const translations = {
  "ZOB Ahan": "ذوب آهن اصفهان",

  Persepolis: "پرسپولیس تهران",
  Malavan: "ملوان بندر انزلی",
  "Gol Gohar": "گل گهر سیرجان",
  "Esteghlal Khuzestan": "استقلال خوزستان",
  "Aluminium Arak": "آلومینیوم اراک",
  Sepahan: "سپاهان اصفهان",
  Chadormalu: "چادرملو اردکان",
  "Kheybar Khorramabad": "خیبر خرم آباد",
  Havadar: "هوادار",
  Esteghlal: "استقلال تهران",
  "Shams Azar Qazvin": "شمس آذر قزوین",
  "Foolad FC": "فولاد خوزستان",
  "Nassaji Mazandaran": "نساجی مازندران",
  "Mes Rafsanjan": "مس رفسنجان",
  "Tractor Sazi": "تراکتورسازی تبریز",
  "Match Finished": "مسابقه به اتمام رسیده",
  "Not Started": "هنوز آغاز نشده",
  "Imam Khomeini Stadium": "استادیوم امام خمینی",
  "Takhti Stadium": "استادیوم تختی",
  "Shohadaye Foolad Khoozestan": "استادیوم شهدای فولاد خوزستان",
  "Naghsh-e-Jahan Stadium": "استادیوم نقش جهان",
  "Shahr-e Qods Stadium": "استادیوم شهر قدس",
  "Sardare Azadegan Stadium": "استادیوم سردار آزادگان",
  "Vatani Stadium": "استادیوم وطنی",
  "Shohada Mes Rafsanjan Stadium": "استادیوم شهدای مس رفسنجان",
  "Sardar Soleimani Stadium": "استادیوم سردار سلیمانی",
  "Yadegar-e-Emam Stadium": "استادیوم یادگار امام",
  "Imam Reza Stadium": "استادیوم امام رضا",
  "Shahid Dastgerdi Stadium": "استادیوم شهید دستگردی",
  "Ghadir Stadium": "استادیوم غدیر",
  Iran: "ایران",
  "": "",
};

const weeksCounter = {
  1: "هفته اول",
  2: "هفته دوم",
  3: "هفته سوم",
};


if (!localStorage.getItem("profile")) localStorage.setItem("profile", JSON.stringify({"fName":"بهنام","lName":"تاج فیروز","phone":"093213121"}));


const finisedEvents = [



  {
    idEvent: "2126885",
    strHomeTeam: "Persepolis",
    strAwayTeam: "ZOB Ahan",
    intHomeScore: "1",
    intAwayScore: "1",
  },
  {
    idEvent: "2126888",
    strHomeTeam: "Malavan",
    strAwayTeam: "Gol Gohar",
    intHomeScore: "1",
    intAwayScore: "0",
  },
  {
    idEvent: "2126889",
    strHomeTeam: "Esteghlal Khuzestan",
    strAwayTeam: "Aluminium Arak",
    intHomeScore: "0",
    intAwayScore: "0",
  },
  {
    idEvent: "2126886",
    strHomeTeam: "Sepahan",
    strAwayTeam: "Chadormalu",
    intHomeScore: "3",
    intAwayScore: "1",
  },
  {
    idEvent: "2126887",
    strHomeTeam: "Havadar",
    strAwayTeam: "Kheybar Khorramabad",
    intHomeScore: "0",
    intAwayScore: "1",
  },
  {
    idEvent: "2126890",
    strHomeTeam: "Shams Azar Qazvin",
    strAwayTeam: "Esteghlal",
    intHomeScore: "1",
    intAwayScore: "2",
  },
  {
    idEvent: "2126891",
    strHomeTeam: "Nassaji Mazandaran",
    strAwayTeam: "Foolad FC",
    intHomeScore: "0",
    intAwayScore: "1",
  },
  {
    idEvent: "2126892",
    strHomeTeam: "Mes Rafsanjan",
    intHomeScore: "0",
    intAwayScore: "2",
    strAwayTeam: "Tractor Sazi",
  },
];

let MyScore = 0;
const fakeResults = {};
generateFakePredictions = () => {
  finisedEvents.forEach((fEvent) => {
    const fakeHomeScorePred = getRandomNumber(6);
    const fakeAwayScorePred = getRandomNumber(6);
    const fakePrediction = JSON.stringify({
        result: `${fakeHomeScorePred}${fakeAwayScorePred}`,
        homeScore: fakeHomeScorePred,
        awayScore: fakeAwayScorePred,
        homeTeam: fEvent.strHomeTeam,
        awayTeam: fEvent.strAwayTeam,
      })
    localStorage.setItem(
      fEvent.idEvent,
      fakePrediction
    );
    [gainedScore, predictionWinningMsg] = calculateMyScore(
        fakePrediction,
        fEvent.intHomeScore,
        fEvent.intAwayScore
    );

        fakeResults[fEvent.idEvent] ={gainedScore, predictionWinningMsg, "OldScore":MyScore};

  });
};

generateFakePredictions();






function renderPredictionBtn(eventId, eventStatus, homeTeam, awayTeam) {
  if (eventStatus === "Match Finished")
    return `<button class="btn btn-sm btn-danger my-2 predict-btn cursor-forbid" data-event-id="${eventId}" data-home-team="${homeTeam}" data-away-team="${awayTeam}" disabled>مسابقه انجام شده</button>`;
  if (localStorage.getItem(eventId))
    return '<button class="btn btn-sm btn-warning my-2 predict-btn cursor-forbid" data-event-id="${eventId}" data-home-team="${homeTeam}" data-away-team="${awayTeam}" disabled>پیش بینی ثبت شده</button>';
  return `<button class="btn btn-sm btn-success my-2 predict-btn" data-event-id="${eventId}" data-home-team="${homeTeam}" data-away-team="${awayTeam}">ثبت پیش بینی</button>`;
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

function generateThreefakePercentages() {
  let first = getRandomNumber(100);
  let second = getRandomNumber(100 - first);
  let third = 100 - first - second;

  return [first, second, third];
}

function calculateMyScore(prediction, realHomeScore, realAwayScore) {
  let gainedScore = 1; // by default 1 score which relevents to wrong prediction

  if (
    prediction.awayScore == realHomeScore &&
    prediction.homeScore == realAwayScore
  ) {
    // perfect prediction
    gainedScore = 10;
    MyScore += gainedScore;
    return [gainedScore, "پیش بینی دقیق"];
  }

  // goal difference prediction

  let realGoalDifference = Math.abs(realHomeScore - realAwayScore);
  let predictedGoalDifference = Math.abs(
    parseInt(prediction.homeScore) - parseInt(prediction.awayScore)
  );

  if (realGoalDifference == predictedGoalDifference) {
    gainedScore = 6;
    MyScore += gainedScore;
    return [gainedScore, "اختلاف گل صحیح"];
  }

  // winner team

  const realWinnerTeam =
    realHomeScore - realAwayScore > 0
      ? "h"
      : realHomeScore - realAwayScore == 0
      ? "d"
      : "a";
  const predictedWinnerTeam =
    parseInt(prediction.homeScore) - parseInt(prediction.awayScore) > 0
      ? "h"
      : parseInt(prediction.homeScore) - parseInt(prediction.awayScore) == 0
      ? "d"
      : "a";

  if (realWinnerTeam == predictedWinnerTeam) {
    gainedScore = 4;
    MyScore += gainedScore;
    return [gainedScore, "پیش بینی صحیح تیم برنده"];
  }

  MyScore += gainedScore;
  return [gainedScore, "پیش بینی نادرست"];
}

function generateThreeFakeResults() {
  const results = new Set(); // Use a Set to ensure uniqueness

  while (results.size < 3) {
    const h = getRandomNumber(5);
    const a = getRandomNumber(5);
    const result = { h, a };

    // Convert result object to a string and add to Set for uniqueness
    results.add(JSON.stringify(result));
  }

  // Convert the Set back to an array of objects
  return Array.from(results).map(JSON.parse);
}

function renderPopularResults(results, hTeam, aTeam) {
  let popRes = "";
  results.forEach((res) => {
    popRes += `<p>${translations[hTeam]} <span class="bg-dark px-2 " style="border-radius:25px" >${res.h}</span > <span class="bg-dark px-2 " style="border-radius:25px">${res.a}</span> ${translations[aTeam]}</p>`;
  });

  return popRes;
}

function checkPrediction(eventId, homeTeamName, awayTeamName) {
  if (localStorage.getItem(eventId)) {
    const prediction = JSON.parse(localStorage.getItem(eventId));

    return `<p>  پیش بینی شما : ${translations[homeTeamName]} <span class="bg-primary px-2 " style="border-radius:25px" >${prediction.homeScore}</span > <span class="bg-primary px-2 " style="border-radius:25px">${prediction.awayScore}</span> ${translations[awayTeamName]}</p>`;
  }
  return ``;
}

function populateMatches(events, week = 1) {
  const matchesDiv = document.getElementById("matches");
  matchesDiv.innerHTML = "";
  // Loop over the events
  events[week].forEach((event) => {
    const eventId = event.idEvent;
    const prediction = JSON.parse(localStorage.getItem(eventId));
    const intHomeScore = event.intHomeScore;
    const intAwayScore = event.intAwayScore;
    const eventStatus = event.strStatus;
    const homeTeamName = event.strHomeTeam;
    const awayTeamName = event.strAwayTeam;
    const homeTeamBadge = event.strHomeTeamBadge;
    const awayTeamBadge = event.strAwayTeamBadge;

    const dateEvent = event.dateEvent;
    const eventTimeLocal = event.strTimeLocal;
    const strVenue = event.strVenue;
    const percentages = generateThreefakePercentages();
    const hWinPoss = percentages[0];
    const aWinPoss = percentages[1];
    const drawPoss = percentages[2];
    const popularResults = generateThreeFakeResults();
    let gainedScore = null;
    let predictionWinningMsg = null;

    matchesDiv.innerHTML += `<div class="container my-5">
        <div class="row justify-content-center">
          <div class="col col-lg-2 mb-4">
            <div class="event-details text-center my-3">
              <small style="display:block">${getPersianDate(dateEvent)}</small>
              <small style="display:block">ساعت ${
                eventTimeLocal ? eventTimeLocal.slice(0, 5) : "نامشخص"
              } </small>


              ${renderPredictionBtn(
                eventId,
                eventStatus,
                homeTeamName,
                awayTeamName
              )}
              <button class="btn btn-sm btn-info my-2 details-btn" data-event-id="${eventId}">مشاهده جزئیات</button>
            </div>
          </div>
          <div class="col-lg-8">
            <div class="teams">
              <div class="team">
              ${
                eventStatus !== "Match Finished"
                  ? `<div class="match-actions my-3 ">
              <button class="button-${eventId} plus-button ${
                      prediction && "d-none"
                    }" >+</button>
              <span id="away-score-${eventId}">${
                      prediction
                        ? `<span class="bg-primary px-2 " style="border-radius:25px">${prediction.awayScore}</span>`
                        : "0"
                    }</span>
              <button class="button-${eventId} minus-button ${
                      prediction && "d-none"
                    }" >-</button>
            </div>`
                  : `<span class="bg-success px-2 " style="border-radius:25px">${intAwayScore}</span>`
              }

                <span>${translations[awayTeamName]}</span>
                <img src="${awayTeamBadge}" />

              </div>

              <div class="team">
              ${
                eventStatus !== "Match Finished"
                  ? `<div class="match-actions my-3">
              <button class="button-${eventId} plus-button ${
                      prediction && "d-none"
                    }" >+</button>
              <span id="home-score-${eventId}" >${
                      prediction
                        ? `<span class="bg-primary px-2 " style="border-radius:25px">${prediction.homeScore}</span>`
                        : "0"
                    }</span>
              <button class="button-${eventId} minus-button ${
                      prediction && "d-none"
                    }" >-</button>
            </div>`
                  : `<span class="bg-success px-2 " style="border-radius:25px">${intHomeScore}</span>`
              }

                <span>${translations[homeTeamName]}</span>
                <img src="${homeTeamBadge}" />
              </div>
            </div>
            ${
              eventStatus === "Match Finished" && fakeResults[parseInt(eventId)]
                ? `<p class="text-center my-4">${fakeResults[parseInt(eventId)]["predictionWinningMsg"]}</p> <p class="text-center my-4">${ fakeResults[parseInt(eventId)]["gainedScore"] } :   امتیاز دریافتی از این بازی  </p><p class="text-center my-4">مجموع امتیازات شما پس از این بازی : ${  fakeResults[parseInt(eventId)]["OldScore"] }</p>`
                : ""
            }

          </div>

          <div class="col col-lg-2"><p class="week-counter">${
            weeksCounter[week]
          }</p></div>
        </div>
        <div class="container my-2 d-none" style="text-align:right;" id="event-details-container-${eventId}">
        <hr style="border-top: 1px solid white;width:50%">

        <p class="text-center">لیگ برتر خلیج فارس ایران  </p>
        <p class="text-center">کشور محل برگزاری  &nbsp:  &nbspایران</p>
        <p class="text-center">ورزشگاه  &nbsp : &nbsp ${
          translations[strVenue]
        } </p>
        ${checkPrediction(eventId, homeTeamName, awayTeamName)}
        <p class="text-right">آمار پیش بینی احتمال برد هر تیم </p>
        <div style="background-color:transparent"  class="progress my-2" dir="rtl">

        <div  class="progress-bar bg-success px-2 " role="progressbar" style="width: ${hWinPoss}%; border-radius:20px" aria-valuenow="${hWinPoss}" aria-valuemin="0" aria-valuemax="100"></div>
        <p class="mx-2 progress-bar-inline-par">برد ${
          translations[homeTeamName]
        } -  % ${hWinPoss}</p>
        </div>
        <p class="mx-2 progress-bar-par">برد ${
          translations[homeTeamName]
        } -  % ${hWinPoss}</p>
        <div  style="background-color:transparent" class="progress my-2" dir="rtl">

        <div  class="progress-bar bg-info px-2 " role="progressbar" style="width: ${drawPoss}%; border-radius:20px" aria-valuenow="${drawPoss}" aria-valuemin="0" aria-valuemax="100"></div>
        <p class="mx-2 progress-bar-inline-par">تساوی -  % ${drawPoss}</p>
        </div>
        <p class="mx-2 progress-bar-par">تساوی -  % ${drawPoss}</p>
        <div  style="background-color:transparent" class="progress my-2" dir="rtl">

        <div  class="progress-bar bg-danger px-2 " role="progressbar" style="width: ${aWinPoss}%; border-radius:20px" aria-valuenow="${aWinPoss}" aria-valuemin="0" aria-valuemax="100"></div>
        <p class="mx-2 progress-bar-inline-par">برد ${
          translations[awayTeamName]
        } -  % ${aWinPoss}</p>
        </div>
        <p class="mx-2 progress-bar-par">برد ${
          translations[awayTeamName]
        } -  % ${aWinPoss}</p>
        <p class="text-right my-4">پیش بینی های پر طرفدار</p>
         ${renderPopularResults(popularResults, homeTeamName, awayTeamName)}
        </div>
      </div>
      `;
  });


  document.querySelectorAll(".details-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const eventId = this.dataset.eventId;
      document
        .getElementById(`event-details-container-${eventId}`)
        .classList.remove("d-none");
    });
  });

  document.querySelectorAll(".predict-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const eventId = this.dataset.eventId;
      const homeTeam = this.dataset.homeTeam;
      const awayTeam = this.dataset.awayTeam;
      const homeScoreSpan = document.getElementById(`home-score-${eventId}`);
      const awayScoreSpan = document.getElementById(`away-score-${eventId}`);
      const homeScore = homeScoreSpan.innerText;
      const awayScore = awayScoreSpan.innerText;
      localStorage.setItem(
        eventId,
        JSON.stringify({
          result: `${homeScore}${awayScore}`,
          homeScore: homeScore,
          awayScore: awayScore,
          homeTeam: homeTeam,
          awayTeam: awayTeam,
        })
      );

      this.innerHTML = " پیش بینی ثبت شده";
      this.classList.add("cursor-forbid", "btn-warning");
      this.setAttribute("disabled", "true");
      homeScoreSpan.innerHTML = `<span class="bg-primary px-2 " style="border-radius:25px">${homeScore}</span>`;
      awayScoreSpan.innerHTML = `<span class="bg-primary px-2 " style="border-radius:25px">${awayScore}</span>`;
      document.querySelectorAll(`.button-${eventId}`).forEach((element) => {
        element.classList.add("d-none");
      });
    });
  });

  document.querySelectorAll(".plus-button").forEach((button) => {
    button.addEventListener("click", function () {
      const predictionValue = this.nextElementSibling;
      let currentValue = Number(predictionValue.textContent);
      if (!isNaN(currentValue)) {
        predictionValue.textContent = currentValue + 1;
      } else {
        predictionValue.textContent = 1;
      }
    });
  });

  document.querySelectorAll(".minus-button").forEach((button) => {
    button.addEventListener("click", function () {
      const predictionValue = this.previousElementSibling;
      let currentValue = Number(predictionValue.textContent);
      if (!isNaN(currentValue) && currentValue > 0) {
        predictionValue.textContent = currentValue - 1;
      } else {
        predictionValue.textContent = 0;
      }
    });
  });
}

fetch("events.json")
  .then((response) => response.json())
  .then((data) => {
    const events = data.events;

    const categorizedEvents = categorizeEventsIntoWeeks(events);
    let currentWeek = 1;

    populateMatches(categorizedEvents, currentWeek);

    const weekTabs = document.querySelectorAll(".tab");
    let activeBtn = weekTabs[2]; // get first week tab button

    weekTabs.forEach((button) => {
      button.addEventListener("click", function () {
        populateMatches(categorizedEvents, this.dataset.week);
        activeBtn.classList.remove("active");
        this.classList.add("active");
        activeBtn = this;
      });
    });

    document
      .querySelector("#my-predictions-page")
      .addEventListener("click", function () {
        document
          .querySelectorAll(".page")
          .forEach((page) => page.classList.add("d-none"));
        const predContainer = document.querySelector(
          ".my-predictions-container"
        );
        $("#profile-page").css("color","gray");
        document.querySelector("#scoreboard-page").classList.remove("d-none");
        predContainer.classList.remove("d-none");
        predContainer.innerHTML = "";
        predContainer.innerHTML += `<div class="header"><h1>پیش بینی های من</h1><p class="text-center">مجموع امتیازات من : ${MyScore}</p></div>`;
        Object.entries(localStorage).forEach(([key, value]) => {
          if (key !== "length" && key !== "profile") {
            let pred = JSON.parse(value);

            predContainer.innerHTML += `<div class="container my-5">
                <div class="row justify-content-center"><div class="teams">
                <div class="team">

                <span class="bg-primary px-2 " style="border-radius:25px">${
                  pred.awayScore
                }</span>
                <span>${translations[pred.awayTeam]}</span>

                </div>

                <div class="team">

                <span>${translations[pred.homeTeam]}</span>
                <span class="bg-primary px-2 " style="border-radius:25px">${
                  pred.homeScore
                }</span>
                </div>
              </div> </div></div>`;
          }
        });

        document.querySelector("#league-page").classList.remove("d-none");
        $('.nav-link').removeClass("active");

        this.classList.add("d-none");
      });

    document.querySelector("#league-page").addEventListener("click", function () {
      document
        .querySelectorAll(".page")
        .forEach((page) => page.classList.add("d-none"));
        $("#profile-page").css("color","gray");
      document.querySelector(".league-container").classList.remove("d-none");
      document.querySelector("#my-predictions-page").classList.remove("d-none");
      document.querySelector("#scoreboard-page").classList.remove("d-none");
      $('.nav-link').removeClass("active");
      this.classList.add("d-none");
    });


    document.querySelector("#main-page").addEventListener("click", function () {
        document
          .querySelectorAll(".page")
          .forEach((page) => page.classList.add("d-none"));
        $("#profile-page").css("color","gray");
        document.querySelector(".main-container").classList.remove("d-none");
        document.querySelector("#my-predictions-page").classList.remove("d-none");
        document.querySelector("#scoreboard-page").classList.remove("d-none");
        document.querySelector("#league-page").classList.remove("d-none");
        $('.nav-link').removeClass("active");
      });


    document.querySelector("#profile-page").addEventListener("click", function () {
    document
        .querySelectorAll(".page")
        .forEach((page) => page.classList.add("d-none"));
    document.querySelector(".profile-container").classList.remove("d-none");
    document.querySelector("#my-predictions-page").classList.remove("d-none");
    document.querySelector("#scoreboard-page").classList.remove("d-none");
    document.querySelector("#league-page").classList.remove("d-none");
    this.style.color="white";
    const profile = JSON.parse(localStorage.getItem("profile", {"fName":"هوشنگ","lName":"ابتهاج","phone":"093213121"}));
    $('#fName').val(profile.fName);
    $('#lName').val(profile.lName);
    $('#phoneNumber').val(profile.phone);
    $("#profile-alert").html("");
    });


    document.querySelector("#edit-profile-btn").addEventListener("click", function (e) {
        e.preventDefault();
        const fName =  $('#fName').val();
        const lName =  $('#lName').val();
        const phoneNumber = $('#phoneNumber').val();

        if (fName.length === 0 || lName.length === 0  || phoneNumber.length === 0){
            $("#profile-alert").html("تکمیل تمامی فیلدها ضروری است");
            $("#profile-alert").css("color","#AA0000");
            return;
        }

        localStorage.setItem("profile", JSON.stringify({"fName":fName,"lName":lName,"phone":phoneNumber}));
        $("#profile-alert").html("اطلاعات شما با موفقیت ویرایش شد");
        $("#profile-alert").css("color","#32de84");
        });




    document
      .querySelector("#scoreboard-page")
      .addEventListener("click", function () {
        document
          .querySelectorAll(".page")
          .forEach((page) => page.classList.add("d-none"));
        const scoreboardContainer = document.querySelector(
          ".scoreboard-container"
        );
        $("#profile-page").css("color","gray");
        document.querySelector("#my-predictions-page").classList.remove("d-none");
        scoreboardContainer.classList.remove("d-none");
        scoreboardContainer.innerHTML = "";
        scoreboardContainer.innerHTML += `<div class="header"><h1>جدول امتیازات</h1></div>`;

        scoreboardContainer.innerHTML += `<table id="score-table" class="table table-bordered text-light text-center" dir="rtl">
        <thead>
          <tr>
            <th scope="col">رتبه</th>
            <th scope="col">نام</th>
            <th scope="col">نام خانوادگی</th>
            <th scope="col">امتیاز</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td scope="row">1</td>
            <td>سارا</td>
            <td>شاهی</td>
            <td>48</td>
          </tr>
          <tr>
            <td scope="row">2</td>
            <td>احمد</td>
            <td>کاظمی</td>
            <td>42</td>
          </tr>
          <tr>
            <td scope="row">3</td>
            <td>حامد</td>
            <td>آل یاسین</td>
            <td>32</td>
          </tr>
          <tr>
            <td scope="row">4</td>
            <td>خشایار</td>
            <td>زاهدی</td>
            <td>28</td>
          </tr>
          <tr>
            <td scope="row">5</td>
            <td>ستاره</td>
            <td>پاکزاد</td>
            <td>20</td>
          </tr>
          <tr>
            <td scope="row">6</td>
            <td>محمد</td>
            <td>امیری</td>
            <td>8</td>
          </tr>

        </tbody>
      </table>`;

        document.querySelector("#league-page").classList.remove("d-none");
        this.classList.add("d-none");
        const profile = JSON.parse(localStorage.getItem("profile", {"fName":"هوشنگ","lName":"ابتهاج","phone":"093213121"}));
        const newObject = {
          fname: profile.fName,
          lname: profile.lName,
          score: MyScore,
        };
        addRowToTable(newObject);
      });
  })
  .catch((error) => {
    console.error("Error loading the JSON file:", error);
  });

// Sample JSON data
const data = {
  events: [
    {
      idEvent: "2126885",
      strEvent: "Persepolis vs ZOB Ahan",
      dateEventLocal: "2024-08-15",
    },
    {
      idEvent: "2126888",
      strEvent: "Malavan vs Gol Gohar",
      dateEventLocal: "2024-08-15",
    },
    // Add more events as needed
  ],
};

// Function to categorize events into weeks
function categorizeEventsIntoWeeks(events) {
  // Helper function to calculate the difference in days between two dates
  function daysDifference(date1, date2) {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Sort events by dateEventLocal
  events.sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent));

  const weeks = {};
  let currentWeek = 1;
  let lastDate = null;

  events.forEach((event) => {
    const currentDate = event.dateEvent;

    if (lastDate && daysDifference(lastDate, currentDate) > 3) {
      // Start a new week if the difference is greater than 3 days
      currentWeek++;
    }

    if (!weeks[currentWeek]) {
      weeks[currentWeek] = [];
    }

    weeks[currentWeek].push(event);
    lastDate = currentDate;
  });

  return weeks;
}

getPersianDate = (strDate, format) => {
  let week = new Array(
    "يكشنبه",
    "دوشنبه",
    "سه شنبه",
    "چهارشنبه",
    "پنج شنبه",
    "جمعه",
    "شنبه"
  );
  let months = new Array(
    "فروردين",
    "ارديبهشت",
    "خرداد",
    "تير",
    "مرداد",
    "شهريور",
    "مهر",
    "آبان",
    "آذر",
    "دي",
    "بهمن",
    "اسفند"
  );
  let date = new Date(strDate);
  let d = date.getDay();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getYear();
  year = window.navigator.userAgent.indexOf("MSIE") > 0 ? year : 1900 + year;
  if (year == 0) {
    year = 2000;
  }
  if (year < 100) {
    year += 1900;
  }
  y = 1;
  for (i = 0; i < 3000; i += 4) {
    if (year == i) {
      y = 2;
    }
  }
  for (i = 1; i < 3000; i += 4) {
    if (year == i) {
      y = 3;
    }
  }
  if (y == 1) {
    year -= month < 3 || (month == 3 && day < 21) ? 622 : 621;
    switch (month) {
      case 1:
        day < 21 ? ((month = 10), (day += 10)) : ((month = 11), (day -= 20));
        break;
      case 2:
        day < 20 ? ((month = 11), (day += 11)) : ((month = 12), (day -= 19));
        break;
      case 3:
        day < 21 ? ((month = 12), (day += 9)) : ((month = 1), (day -= 20));
        break;
      case 4:
        day < 21 ? ((month = 1), (day += 11)) : ((month = 2), (day -= 20));
        break;
      case 5:
      case 6:
        day < 22 ? ((month -= 3), (day += 10)) : ((month -= 2), (day -= 21));
        break;
      case 7:
      case 8:
      case 9:
        day < 23 ? ((month -= 3), (day += 9)) : ((month -= 2), (day -= 22));
        break;
      case 10:
        day < 23 ? ((month = 7), (day += 8)) : ((month = 8), (day -= 22));
        break;
      case 11:
      case 12:
        day < 22 ? ((month -= 3), (day += 9)) : ((month -= 2), (day -= 21));
        break;
      default:
        break;
    }
  }
  if (y == 2) {
    year -= month < 3 || (month == 3 && day < 20) ? 622 : 621;
    switch (month) {
      case 1:
        day < 21 ? ((month = 10), (day += 10)) : ((month = 11), (day -= 20));
        break;
      case 2:
        day < 20 ? ((month = 11), (day += 11)) : ((month = 12), (day -= 19));
        break;
      case 3:
        day < 20 ? ((month = 12), (day += 10)) : ((month = 1), (day -= 19));
        break;
      case 4:
        day < 20 ? ((month = 1), (day += 12)) : ((month = 2), (day -= 19));
        break;
      case 5:
        day < 21 ? ((month = 2), (day += 11)) : ((month = 3), (day -= 20));
        break;
      case 6:
        day < 21 ? ((month = 3), (day += 11)) : ((month = 4), (day -= 20));
        break;
      case 7:
        day < 22 ? ((month = 4), (day += 10)) : ((month = 5), (day -= 21));
        break;
      case 8:
        day < 22 ? ((month = 5), (day += 10)) : ((month = 6), (day -= 21));
        break;
      case 9:
        day < 22 ? ((month = 6), (day += 10)) : ((month = 7), (day -= 21));
        break;
      case 10:
        day < 22 ? ((month = 7), (day += 9)) : ((month = 8), (day -= 21));
        break;
      case 11:
        day < 21 ? ((month = 8), (day += 10)) : ((month = 9), (day -= 20));
        break;
      case 12:
        day < 21 ? ((month = 9), (day += 10)) : ((month = 10), (day -= 20));
        break;
      default:
        break;
    }
  }
  if (y == 3) {
    year -= month < 3 || (month == 3 && day < 21) ? 622 : 621;
    switch (month) {
      case 1:
        day < 20 ? ((month = 10), (day += 11)) : ((month = 11), (day -= 19));
        break;
      case 2:
        day < 19 ? ((month = 11), (day += 12)) : ((month = 12), (day -= 18));
        break;
      case 3:
        day < 21 ? ((month = 12), (day += 10)) : ((month = 1), (day -= 20));
        break;
      case 4:
        day < 21 ? ((month = 1), (day += 11)) : ((month = 2), (day -= 20));
        break;
      case 5:
      case 6:
        day < 22 ? ((month -= 3), (day += 10)) : ((month -= 2), (day -= 21));
        break;
      case 7:
      case 8:
      case 9:
        day < 23 ? ((month -= 3), (day += 9)) : ((month -= 2), (day -= 22));
        break;
      case 10:
        day < 23 ? ((month = 7), (day += 8)) : ((month = 8), (day -= 22));
        break;
      case 11:
      case 12:
        day < 22 ? ((month -= 3), (day += 9)) : ((month -= 2), (day -= 21));
        break;
      default:
        break;
    }
  }
  if (format === null || format === undefined)
    return `${week[d]} ${day} ${months[month - 1]} ${year}`;
  if (format === "y/m/d") return `${year}/${month}/${day}`;
  if (format === "d/m/y") return `${day}/${month}/${year}`;
};

function addRowToTable(newObject) {
  // Get the table and its rows
  const table = document.getElementById("score-table");

  const rows = table.getElementsByTagName("tr");

  // Iterate through the rows to find the correct position
  let inserted = false;

  for (let i = 1; i < rows.length; i++) {
    // Start from 1 to skip the header row
    const scoreCell = rows[i].getElementsByTagName("td")[3]; // Assuming score is in the 4th column

    const currentScore = parseFloat(scoreCell.textContent);

    // If the new object's score is higher, insert the new row here
    if (newObject.score > currentScore) {
      const newRow = table.insertRow(i);
      newRow.insertCell(0).textContent = i; // Insert position
      newRow.insertCell(1).textContent = newObject.fname;
      newRow.insertCell(2).textContent = newObject.lname;
      newRow.insertCell(3).textContent = newObject.score;
      newRow.style.backgroundColor = "#32de84";
      newRow.style.color = "black";
      newRow.style.fontWeight="bolder";

      inserted = true;
      break;
    }
  }

  // If the new object has the lowest score, add it to the end
  if (!inserted) {
    const newRow = table.insertRow(rows.length);
    newRow.insertCell(0).textContent = rows.length; // Insert position
    newRow.insertCell(1).textContent = newObject.fname;
    newRow.insertCell(2).textContent = newObject.lname;
    newRow.insertCell(3).textContent = newObject.score;
  }

  // Update positions for all rows
  updateTablePositions(table);
}

function updateTablePositions(table) {
  const rows = table.getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    // Start from 1 to skip the header row
    rows[i].getElementsByTagName("td")[0].textContent = i; // Update position column
  }
}

//   console.log(getPersianDate('2024-08-15'));
//   console.log(getPersianDate("y/m/d"));
//   console.log(getPersianDate("d/m/y"));
