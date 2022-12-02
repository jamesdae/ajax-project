var xhr = new XMLHttpRequest();
var $main = document.querySelector('ul');
const maincontainer = document.querySelector('main.container');
var arrayOfSongs = [];
const homeview = document.querySelector('.home');
const songview = document.querySelector('.songs');
const favsview = document.querySelector('.favorites');
const homeclock = document.getElementById('homeclock');
const homecloud = document.getElementById('homecloud');
const $icon = document.querySelector('.icon.left');
const $icon2 = document.querySelector('.icon.right');
const $cloud = document.querySelector('.fa-cloud-moon-rain');
const $clock = document.querySelector('.fa-clock');
const $cloudp = $cloud.nextElementSibling;
const $clockp = $clock.nextElementSibling;
const $mainlogo = document.querySelector('.mainlogo');
const headnav = document.querySelector('.headnav');
const ulplaylist = document.getElementById('favs');

var rainy = document.createElement('div');
var rainyp = document.createElement('p');
rainy.setAttribute('class', 'weather');
rainyp.setAttribute('class', 'category');
var sunny = document.createElement('div');
var sunnyp = document.createElement('p');
sunny.setAttribute('class', 'weather');
sunnyp.setAttribute('class', 'category');
var snowy = document.createElement('div');
var snowyp = document.createElement('p');
snowy.setAttribute('class', 'weather');
snowyp.setAttribute('class', 'category');

xhr.open('GET', 'https://acnhapi.com/v1/backgroundmusic');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  arrayOfSongs = Object.values(xhr.response);
  renderSongs('time');
});
xhr.send();

function renderSongs(view) {
  rainyp.textContent = 'Rainy Weather';
  sunnyp.textContent = 'Sunny Weather';
  snowyp.textContent = 'Snowy Weather';
  rainy.appendChild(rainyp);
  sunny.appendChild(sunnyp);
  snowy.appendChild(snowyp);
  for (var i = 0; i < arrayOfSongs.length; i++) {
    const song = arrayOfSongs[i];
    var $listitem = document.createElement('li');
    $listitem.setAttribute('class', 'row column');

    var $songname = document.createElement('p');
    $songname.setAttribute('class', 'songtitle nodecor');
    var rawtitle = lastChars(8, song['file-name']);
    var newTitle = lastChars(5, rawtitle) + ' ' + firstChars(2, rawtitle);
    $songname.textContent = newTitle;
    $listitem.appendChild($songname);

    var leafSong = document.createElement('div');
    leafSong.setAttribute('class', 'spacearound row');

    var leaf = document.createElement('img');
    leaf.setAttribute('src', 'images/leaf.png');
    leaf.setAttribute('alt', 'leaf icon');
    leaf.setAttribute('class', 'leaf');
    leafSong.appendChild(leaf);

    var $song = document.createElement('audio');
    $song.setAttribute('controls', '');
    $song.setAttribute('name', 'media');
    $song.setAttribute('class', 'audioplayer');

    var $audio = document.createElement('source');
    $audio.setAttribute('src', song.music_uri);
    $audio.setAttribute('type', 'audio/mpeg');

    if (view === 'time') {
      var timeOfDay = document.createElement('p');
      timeOfDay.setAttribute('class', 'category');
      switch (i) {
        case 0:
          timeOfDay.textContent = 'Dawn / Dusk';
          $main.appendChild(timeOfDay);
          break;
        case 18:
          timeOfDay.textContent = 'Morning';
          $main.appendChild(timeOfDay);
          break;
        case 36:
          timeOfDay.textContent = 'Afternoon';
          $main.appendChild(timeOfDay);
          break;
        case 54:
          timeOfDay.textContent = 'Night';
          $main.appendChild(timeOfDay);
          break;
        default:
          break;
      }
      $main.appendChild($listitem);
    } else if (view === 'weather') {
      $main.appendChild(rainy);
      $main.appendChild(sunny);
      $main.appendChild(snowy);
      switch (song.weather) {
        case 'Rainy':
          rainy.appendChild($listitem);
          break;
        case 'Sunny':
          sunny.appendChild($listitem);
          break;
        case 'Snowy':
          snowy.appendChild($listitem);
          break;
        default:
          break;
      }
    }
    leafSong.appendChild($song);
    $listitem.appendChild(leafSong);
    $song.appendChild($audio);
    $song.addEventListener('play', pauseOthers);
    $song.addEventListener('ended', startNext);
    $song.addEventListener('playing', currentSongBorder);
    $song.addEventListener('pause', () => headnav.classList.remove('currentlyplaying'));
  }
}

function currentSongBorder(event) {
  var $songs = document.querySelectorAll('audio');
  for (var i = 0; i < $songs.length; i++) {
    if ($songs[i] !== event.target) {
      $songs[i].classList.remove('playing');
    } else if ($songs[i] === event.target) {
      $songs[i].classList.add('playing');
    }
  }
  if (event.target.closest('.container').classList.contains('favorites')) {
    headnav.classList.add('currentlyplaying');
  } else {
    headnav.classList.remove('currentlyplaying');
  }
}

function pauseOthers(event) {
  var $songs = document.querySelectorAll('audio');
  for (var i = 0; i < $songs.length; i++) {
    if ($songs[i] !== event.target) {
      $songs[i].pause();
    }
  }
}

function startNext(event) {
  var $songs = document.querySelectorAll('audio');
  for (var i = 0; i < $songs.length; i++) {
    if (!$songs[i + 1]) {
      $songs[i].classList.remove('playing');
      headnav.classList.remove('currentlyplaying');
      return;
    } else if ($songs[i] === event.target) {
      $songs[i + 1].currentTime = 0;
      $songs[i + 1].play();
    }
  }
}

function firstChars(length, string) {
  var newString = '';
  if (length > string.length) {
    return string;
  }
  for (var i = 0; i < string.length - (string.length - length); i++) {
    newString += string[i];
  }
  newString = militaryTo12(newString);
  return newString;
}

function lastChars(length, string) {
  var newString = '';
  if (length > string.length) {
    return string;
  }
  for (var i = string.length - length; i < string.length; i++) {
    newString += string[i];
  } return newString;
}

function militaryTo12(newString) {
  if (newString === '00') {
    newString = '12AM';
  } else if (Number(newString) < 10) {
    newString = newString[newString.length - 1] + 'AM';
  } else if (Number(newString) >= 10 && Number(newString) < 12) {
    newString += 'AM';
  } else if (newString === '12') {
    newString += 'PM';
  } else if (Number(newString) > 12) {
    newString = Number(newString) - 12;
    newString += 'PM';
  }
  return newString;
}

function changeSongs(view) {
  $icon.replaceChildren(event.target, event.target.nextElementSibling);
  if (event.target === $clock) {
    $icon2.replaceChildren($cloud, $cloudp);
  } else if (event.target === $cloud) {
    $icon2.replaceChildren($clock, $clockp);
  }
  snowy.replaceChildren();
  rainy.replaceChildren();
  sunny.replaceChildren();
  $main.replaceChildren();
  renderSongs(view);
}

function changeViews(current) {
  let hiddenview;
  let otherview2;
  let otherview;
  maincontainer.classList.remove('tempflex');
  if (current === 'favorites' && ulplaylist.firstElementChild.classList.contains('tempbanner')) {
    maincontainer.classList.add('tempflex');
    hiddenview = favsview;
    otherview = homeview;
    otherview2 = songview;
  } else if (current === 'favorites') {
    hiddenview = favsview;
    otherview = homeview;
    otherview2 = songview;
  } else if (homeview.classList.contains('hidden') || current === 'home') {
    hiddenview = homeview;
    otherview2 = favsview;
    otherview = songview;
    homeclock.replaceChildren($clock, $clock.nextElementSibling);
    homecloud.replaceChildren($cloud, $cloud.nextElementSibling);
  } else if (songview.classList.contains('hidden')) {
    hiddenview = songview;
    otherview = homeview;
    otherview2 = favsview;
  }
  hiddenview.classList.remove('hidden');
  otherview.classList.add('hidden');
  otherview2.classList.add('hidden');
}

$mainlogo.addEventListener('click', () => changeViews('home'));

window.addEventListener('click', () => {
  if (event.target.classList.contains('fa-clock') && $icon.firstElementChild !== event.target) {
    changeSongs('time');
    if (songview.classList.contains('hidden')) {
      changeViews();
    }
    window.scrollTo(0, 0);
  }
});

window.addEventListener('click', () => {
  if (event.target.classList.contains('fa-cloud-moon-rain') && $icon.firstElementChild !== event.target) {
    changeSongs('weather');
    if (songview.classList.contains('hidden')) {
      changeViews();
    }
    window.scrollTo(0, 0);
  }
});

window.addEventListener('click', () => {
  if (event.target.classList.contains('fa-music')) {
    changeViews('favorites');
  }
});

window.addEventListener('click', () => {
  const favoritesancestor = event.target.closest('.container');
  if (event.target.classList.contains('leaf') && !favoritesancestor.classList.contains('favorites')) {
    const favclone = event.target.parentElement.parentElement.cloneNode(true);
    const up = document.createElement('i');
    const down = document.createElement('i');
    const shifticons = document.createElement('div');
    shifticons.setAttribute('class', 'column justifiedcenter');
    up.setAttribute('class', 'fa-solid fa-chevron-up smallicon');
    down.setAttribute('class', 'fa-solid fa-chevron-down smallicon');
    shifticons.appendChild(up);
    shifticons.appendChild(down);
    favclone.lastElementChild.lastElementChild.addEventListener('play', pauseOthers);
    favclone.lastElementChild.lastElementChild.addEventListener('ended', startNext);
    favclone.lastElementChild.lastElementChild.addEventListener('playing', currentSongBorder);
    favclone.lastElementChild.lastElementChild.addEventListener('pause', () => headnav.classList.remove('currentlyplaying'));
    favclone.lastElementChild.appendChild(shifticons);
    if (ulplaylist.firstElementChild.classList.contains('tempbanner')) {
      ulplaylist.replaceChild(favclone, ulplaylist.firstElementChild);
    } else {
      ulplaylist.appendChild(favclone);
    }
  }
});
