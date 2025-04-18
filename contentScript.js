(() => {
  const modalCSS = `
  display: flex; 
  color: white; 
  background-color:#0f0f0f; 
  align-items: center; 
  justify-content: center; 
  width: 300px; 
  border-radius: 20px; 
  padding: 5px 10px; 
  position: fixed; 
  top: 60px; 
  left: 0; 
  z-index:999;
`;

  const modalInnerCss = `
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-direction: column;  
  gap: 10px;   
  `;
  const loopBtnStyle = `margin: 0px 12px;`;
  let youtubeLeftControls = null;
  let youtubePlayer = null;
  let previousUrl = null;

	
  chrome.runtime.onMessage.addListener((msg) => {
    let url = getYouTubeVideoID(msg.tab.url);

    if (msg.msg === 'VIDEO') {
      newVideoLoaded(url);
    }
  });

  const newVideoLoaded = (url) => {
    if (previousUrl && previousUrl !== url) {
      stopLoop();
    }

    previousUrl = url;

    const loopBtnClass = document.getElementsByClassName('loop-btn')[0];
    if (!loopBtnClass) {
      const loopBtn = document.createElement('img');
      loopBtn.src = chrome.runtime.getURL('/img/btn-img.png');
      loopBtn.className = 'loop-btn';
      loopBtn.title = 'start the loop';
      loopBtn.curson = 'pointer';
      loopBtn.style.cssText = loopBtnStyle;
      loopBtn.addEventListener('mouseover', function () {
        loopBtn.style.cursor = 'pointer';
      });
      youtubePlayer = document.getElementsByClassName('video-stream')[0];

      youtubeLeftControls =
        document.getElementsByClassName('ytd-watch-metadata')[10];
      youtubeLeftControls.appendChild(loopBtn);
      loopBtn.addEventListener('click', openModal);
    }
  };

  const openModal = () => {
    let modalDiv = document.body.getElementsByClassName('modal');
    if (modalDiv.length > 0) {
      modalDiv[0].remove();
    } else {
      modal();
    }
  };

  function modal() {
    const modalLoop = document.createElement('div');
    modalLoop.className = 'modal';
    modalLoop.style.cssText = modalCSS;

    let modalInner = document.createElement('div');
    modalInner.classList = 'modal-inner';
    modalInner.style.cssText = modalInnerCss;
    modalInner.innerHTML = `
       <label for="startMinute">startMinute</label>
       <input type="number" id="startMinute" />
       
        <label for="startSecond">startSecond</label>
        <input type="number" id="startSecond" />
        
        <label for="endMinute">endMidnute</label>
        <input type="number" id="endMinute" />
        
        <label for="endSecond">endSecond</label>
        <input type="number" id="endSecond" />
        <button id="startLoopBtn" class = "btn" >Start The Loop</button>
        <button id="stopLoopBtn" class = "btn" >Stop The Loop</button>
        `;
    modalLoop.appendChild(modalInner);
    document.body.appendChild(modalLoop);

    let startLoopBtn = document.getElementById('startLoopBtn');
    let stopLoopBtn = document.getElementById('stopLoopBtn');
    startLoopBtn.addEventListener('click', startLoop);
    stopLoopBtn.addEventListener('click', stopLoop);
    let buttons = document.querySelectorAll('.btn');

    buttons.forEach((button) => {
      button.style.display = 'inline-block';
      button.style.fontWeight = 'bold';
      button.style.textAlign = 'center';
      button.style.textDecoration = 'none';
      button.style.color = '#fff';
      button.style.backgroundColor = '#007bff';
      button.style.border = 'none';
      button.style.borderRadius = '8px';
      button.style.cursor = 'pointer';
    });
  }

  let timeUpdateListener;

  function startLoop() {

    let startMinute = document.getElementById('startMinute');
    let startSecond = document.getElementById('startSecond');
    let endMinute = document.getElementById('endMinute');
    let endSecond = document.getElementById('endSecond');

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

    youtubePlayer.addEventListener('timeupdate', timeUpdateListener);
  }

  function stopLoop() {
    if (timeUpdateListener) {
      youtubePlayer.removeEventListener('timeupdate', timeUpdateListener);
      timeUpdateListener = null;
	previousUrl = null;
    }
  }
  function getYouTubeVideoID(url) {
    const parts = url.split('v=');
    if (parts.length > 1) {
      return parts[1].split('&')[0];
    }
    return null;
  }
})();
