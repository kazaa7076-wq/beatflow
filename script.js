let songs = [];

fetch("songs.json")
  .then(response => response.json())
  .then(data => {
    songs = data;

    createPlaylist();
    loadSong(0);
  });

function createPlaylist(){

  const playlist =
  document.getElementById("playlist");

  playlist.innerHTML = "";

  songs.forEach((song,index)=>{

    const li =
    document.createElement("li");

    li.innerHTML = `
      <div>
        <strong>${song.title}</strong>
        <br>
        <small>${song.artist}</small>
      </div>
    `;

    li.addEventListener("click",()=>{

      currentSong = index;

      loadSong(index);

      audio.play();

    });

    playlist.appendChild(li);

  });

}

const audio = document.getElementById("audio");

const title = document.getElementById("title");
const artist = document.getElementById("artist");

const miniTitle = document.getElementById("miniTitle");
const miniArtist = document.getElementById("miniArtist");

const cover = document.getElementById("cover");
const miniCover = document.getElementById("miniCover");

const playlist = document.getElementById("playlist");

const progress = document.getElementById("progress");

const volume = document.getElementById("volume");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const search = document.getElementById("search");

const downloadBtn = document.getElementById("downloadBtn");

const playBtn = document.getElementById("play");
const heroPlay = document.getElementById("heroPlay");

let currentSong =
parseInt(localStorage.getItem("lastSong")) || 0;

let repeatMode = false;

let likedSongs =
JSON.parse(localStorage.getItem("likedSongs")) || [];

function formatTime(seconds){

if(isNaN(seconds)) return "0:00";

const min = Math.floor(seconds / 60);

const sec = Math.floor(seconds % 60);

return `${min}:${String(sec).padStart(2,"0")}`;

}

function loadSong(index){

const song = songs[index];

title.textContent = song.title;
artist.textContent = song.artist;

miniTitle.textContent = song.title;
miniArtist.textContent = song.artist;

cover.src = song.cover;
miniCover.src = song.cover;

audio.src = song.file;

downloadBtn.href = song.file;

localStorage.setItem(
"lastSong",
index
);

document
.querySelectorAll("#playlist li")
.forEach((item,i)=>{

item.classList.toggle(
"active",
i === index
);

});

}

songs.forEach((song,index)=>{

const li = document.createElement("li");

li.innerHTML = `
<div>
<strong>${song.title}</strong>
<br>
<small>${song.artist}</small>
</div>
`;

li.addEventListener("click",()=>{

currentSong = index;

loadSong(index);

audio.play();

cover.classList.add("playing");

updatePlayIcons();

});

playlist.appendChild(li);

});

function updatePlayIcons(){

if(audio.paused){

playBtn.innerHTML =
'<i class="fa-solid fa-play"></i>';

heroPlay.innerHTML =
'<i class="fa-solid fa-play"></i> پخش';

cover.classList.remove("playing");

}else{

playBtn.innerHTML =
'<i class="fa-solid fa-pause"></i>';

heroPlay.innerHTML =
'<i class="fa-solid fa-pause"></i> توقف';

cover.classList.add("playing");

}

}

function togglePlay(){

if(audio.paused){

audio.play();

}else{

audio.pause();

}

updatePlayIcons();

}

playBtn.addEventListener(
"click",
togglePlay
);

heroPlay.addEventListener(
"click",
togglePlay
);

document
.getElementById("next")
.addEventListener("click",()=>{

currentSong++;

if(currentSong >= songs.length){

currentSong = 0;

}

loadSong(currentSong);

audio.play();

updatePlayIcons();

});

document
.getElementById("prev")
.addEventListener("click",()=>{

currentSong--;

if(currentSong < 0){

currentSong = songs.length - 1;

}

loadSong(currentSong);

audio.play();

updatePlayIcons();

});

document
.getElementById("shuffle")
.addEventListener("click",()=>{

currentSong =
Math.floor(
Math.random()*songs.length
);

loadSong(currentSong);

audio.play();

updatePlayIcons();

});

document
.getElementById("repeat")
.addEventListener("click",()=>{

repeatMode = !repeatMode;

});

audio.addEventListener(
"timeupdate",
()=>{

if(audio.duration){

progress.value =
(audio.currentTime /
audio.duration) * 100;

currentTimeEl.textContent =
formatTime(
audio.currentTime
);

durationEl.textContent =
formatTime(
audio.duration
);

}

});

progress.addEventListener(
"input",
()=>{

if(audio.duration){

audio.currentTime =
(progress.value / 100)
* audio.duration;

}

});

volume.addEventListener(
"input",
()=>{

audio.volume =
volume.value / 100;

});

audio.addEventListener(
"ended",
()=>{

if(repeatMode){

audio.play();

}else{

document
.getElementById("next")
.click();

}

});

search.addEventListener(
"input",
()=>{

const value =
search.value.toLowerCase();

document
.querySelectorAll("#playlist li")
.forEach(li=>{

li.style.display =
li.textContent
.toLowerCase()
.includes(value)
?
"flex"
:
"none";

});

});

document
.getElementById("likeBtn")
.addEventListener("click",()=>{

const song =
songs[currentSong];

if(
!likedSongs.includes(song.title)
){

likedSongs.push(song.title);

localStorage.setItem(
"likedSongs",
JSON.stringify(
likedSongs
)
);

alert(
"آهنگ به علاقه‌مندی‌ها اضافه شد ❤️"
);

}

});

audio.addEventListener(
"play",
updatePlayIcons
);

audio.addEventListener(
"pause",
updatePlayIcons
);

audio.volume = 0.8;

loadSong(currentSong);

updatePlayIcons();