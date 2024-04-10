(() => {
  // Define CSS styles for the modal
  const modalCSS = `
  display: flex; 
  color: white; 
  background-color:#3f3f3f; 
  align-items: center; 
  justify-content: center; 
  width: 300px; 
  border-radius: 20px; 
  padding: 5px 10px; 
  position: fixed; 
  top: 60px; 
  left: 0; 
`;

  // Define CSS styles for the inner modal
  const modalInnerCss = `
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-direction: column;  
  gap: 10px;
  `;

  let youtubeLeftControls, youtubePlayer;

  // Listen for messages from the extension
  chrome.runtime.onMessage.addListener((msg) => {
    // If the message is "VIDEO", call the newVideoLoaded function
    if (msg === "VIDEO") {
      newVideoLoaded();
    }
  });

  // Function to handle new video loaded
  const newVideoLoaded = () => {
    // Check if loop button already exists
    const loopBtnClass = document.getElementsByClassName("loop-btn")[0];
    // If not, create loop button
    if (!loopBtnClass) {
      const loopBtn = document.createElement("img");
      loopBtn.src = chrome.runtime.getURL("/img/btn-img.png");
      loopBtn.className = "loop-btn";
      loopBtn.title = "start the loop";
      loopBtn.curson = "pointer";
      loopBtn.addEventListener("mouseover", function () {
        loopBtn.style.cursor = "pointer";
      });
      // Selecting the video element
      youtubePlayer = document.getElementsByClassName("video-stream")[0];
      // Append loop button to YouTube left controls
      youtubeLeftControls =
        document.getElementsByClassName("ytd-watch-metadata")[10];
      youtubeLeftControls.appendChild(loopBtn);
      // Add click event listener to loop button
      loopBtn.addEventListener("click", openModal);
    }
  };

  // Function to open modal
  const openModal = () => {
    // Check if modal already exists
    let modalDiv = document.body.getElementsByClassName("modal");
    // If modal exists, remove it. Otherwise, create new modal
    if (modalDiv.length > 0) {
      modalDiv[0].remove();
    } else {
      modal();
    }
  };

  // Function to create modal
  function modal() {
    // Create modal element
    const modalLoop = document.createElement("div");
    modalLoop.className = "modal";
    modalLoop.style.cssText = modalCSS;

    // Create inner modal element
    let modalInner = document.createElement("div");
    modalInner.classList = "modal-inner";
    modalInner.style.cssText = modalInnerCss;
    // Add HTML content to inner modal
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
    // Append inner content to modal
    modalLoop.appendChild(modalInner);
    // Append modal to document body
    document.body.appendChild(modalLoop);

    // Get start and stop loop buttons and add event listeners
    let startLoopBtn = document.getElementById("startLoopBtn");
    let stopLoopBtn = document.getElementById("stopLoopBtn");
    startLoopBtn.addEventListener("click", startLoop);
    stopLoopBtn.addEventListener("click", stopLoop);
  }

  // Function to start the loop
  let timeUpdateListener;
  function startLoop() {
    // Get start and end time inputs
    let startMinute = document.getElementById("startMinute");
    let startSecond = document.getElementById("startSecond");
    let endMinute = document.getElementById("endMinute");
    let endSecond = document.getElementById("endSecond");

    // Convert start and end times to seconds
    let convertStartMinute = startMinute.value * 60;
    let convertStartSecond = startSecond.value % 60;
    let convertEndMinute = endMinute.value * 60;
    let convertEndSecond = endSecond.value % 60;

    // Set video current time to start time
    youtubePlayer.currentTime = convertStartMinute + convertStartSecond;

    // Add timeupdate event listener to check for end time
    timeUpdateListener = () => {
      if (youtubePlayer.currentTime >= convertEndMinute + convertEndSecond) {
        youtubePlayer.currentTime = convertStartMinute + convertStartSecond;
      }
    };
    youtubePlayer.addEventListener("timeupdate", timeUpdateListener);
  }

  // Function to stop the loop
  function stopLoop() {
    // Remove timeupdate event listener
    if (timeUpdateListener) {
      youtubePlayer.removeEventListener("timeupdate", timeUpdateListener);
      timeUpdateListener = null;
    }
  }
})();
