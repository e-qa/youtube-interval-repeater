(() => {
  let youtubeLeftControls, youtubePlayer;

  chrome.runtime.onMessage.addListener((obj) => {
    const { type } = obj;

    if (type === "LOOP_VIDEO") {
      newVideoLoaded();
    }
  });

  const newVideoLoaded = () => {
    const loopBtnClass = document.getElementsByClassName("loop-btn")[0];

    if (!loopBtnClass) {
      const loopBtn = document.createElement("img");
      loopBtn.src = chrome.runtime.getURL("/img/btn-img.png");

      loopBtn.className = "loop-btn";
      loopBtn.title = "start the loop";
      loopBtn.curson = "pointer";
      loopBtn.addEventListener("mouseover", function () {
        loopBtn.style.cursor = "pointer";
      });

      youtubeLeftControls =
        document.getElementsByClassName("ytd-watch-metadata")[10];

      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.appendChild(loopBtn);

      loopBtn.addEventListener("click", openModal);
    }
  };

  const openModal = () => {
    let modalDiv = document.body.getElementsByClassName("modal");

    if (modalDiv.length > 0) {
      modalDiv[0].remove();
    } else {
      modal();
    }
  };

  function modal() {
    // modal
    let modalLoop = document.createElement("div");
    modalLoop.className = "modal";

    //modal css
    modalLoop.style.display = "flex";
    modalLoop.style.backgroundColor = "#3f3f3f";
    modalLoop.style.color = "white";
    modalLoop.style.alignItems = "center";
    modalLoop.style.justifyContent = "center";
    modalLoop.style.width = "300px";
    modalLoop.style.borderRadius = "20px";
    modalLoop.style.padding = "5px 10px";

    modalLoop.style.position = "fixed";
    modalLoop.style.top = "60px";
    modalLoop.style.left = "0";

    // modalInner
    let modalInner = document.createElement("div");
    modalInner.classList = "modal-inner";

    //modalInner css
    modalInner.style.display = "flex";
    modalInner.style.alignItems = "center";
    modalInner.style.justifyContent = "center";
    modalInner.style.flexDirection = "column";
    modalInner.style.gap = "10px";

    modalInner.innerHTML = `
       <label for="startMinute">startMinute</label>
        <input type="number" id="startMinute" />
  
        <label for="startSecond">startSecond</label>
        <input type="number" id="startSecond" />
  
        <label for="endMinute">endMidnute</label>
        <input type="number" id="endMinute" />
  
        <label for="endSecond">endSecond</label>
        <input type="number" id="endSecond" />
        <button id="startLoopBtn" >Start The Loop</button>
        <button id="stopLoopBtn" >Stop The Loop</button>

  `;

    // append
    modalLoop.appendChild(modalInner);
    document.body.appendChild(modalLoop);

    let startLoopBtn = document.getElementById("startLoopBtn");
    let stopLoopBtn = document.getElementById("stopLoopBtn");
    startLoopBtn.addEventListener("click", startLoop);
    stopLoopBtn.addEventListener("click", stopLoop);
  }

  let timeUpdateListener;

  function startLoop() {
    let startMinute = document.getElementById("startMinute");
    let startSecond = document.getElementById("startSecond");
    let endMinute = document.getElementById("endMinute");
    let endSecond = document.getElementById("endSecond");

    let convertStartMinute = startMinute.value * 60;
    let convertStartSecond = startSecond.value % 60;
    let convertEndMinute = endMinute.value * 60;
    let convertEndSecond = endSecond.value % 60;

    youtubePlayer.currentTime = convertStartMinute + convertStartSecond;

    timeUpdateListener = () => {
      if (youtubePlayer.currentTime >= convertEndMinute + convertEndSecond) {
        youtubePlayer.currentTime = convertStartMinute + convertStartSecond;
      }
    };
    youtubePlayer.addEventListener("timeupdate", timeUpdateListener);
  }

  function stopLoop() {
    if (timeUpdateListener) {
      youtubePlayer.removeEventListener("timeupdate", timeUpdateListener);
      timeUpdateListener = null;
    }
  }
})();
