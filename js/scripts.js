var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let video;
let ambientLight;
let animationHasEnded = false;
const videoId = "jeQFX9fE7Xc";

function createAmbientLight() {
  if (!animationHasEnded) return;

  ambientLight = new YT.Player("ambient-light", {
    videoId,
    events: {
      onReady: ambientLightReady,
      onStateChange: ambientStateChange,
    },
  });
}

window.onYouTubeIframeAPIReady = function () {
  video = new YT.Player("video", {
    // O elemento que estiver com esse ID (video) no documento HTML será substituído pelo um iframe.
    videoId,
    events: {
      onStateChange: videoStateChange,
    },
  });
};

function videoStateChange(event) {
  switch (event.data) {
    case YT.PlayerState.PLAYING:
      if (!ambientLight) return;
      ambientLight.seekTo(event.target.getCurrentTime()); // Esso código aqui vai colocar o video de baixo no mesmo tempo que o video principal.
      ambientLight.playVideo();
      break;
    case YT.PlayerState.PAUSED:
      if (!ambientLight) return;
      ambientLight.seekTo(event.target.getCurrentTime());
      ambientLight.pauseVideo();
      break;
  }
}

function betterAmbientLight(event) {
  event.target.mute();

  const qualityLevels = event.target.getAvailableQualityLevels();
  if (qualityLevels && qualityLevels.length && qualityLevels.length > 0) {
    qualityLevels.reverse();
    const lowestLevel =
      qualityLevels[qualityLevels.findIndex((q) => q !== "auto")];

    event.target.setPlaybackQuality(lowestLevel);
  }
}

function ambientLightReady(event) {
  betterAmbientLight(event);
}

function ambientStateChange(event) {
  switch (event.data) {
    case YT.PlayerState.BUFFERING:
    case YT.PlayerState.PLAYING:
      betterAmbientLight(event);
      break;
  }
}

const app = document.querySelector("#app");
app.addEventListener("animationend", (e) => {
  if (e.animationName !== "appear") return;

  animationHasEnded = true;
  createAmbientLight();
});
