const form = document.getElementById("form");
const search = document.getElementById("search");
const results = document.getElementById("results");
const more = document.getElementById("more");

// API const
const apiULR = "https://api.lyrics.ovh";

// Search by song or artist
async function searchSongs(searchTerm) {
  const res = await fetch(`${apiULR}/suggest/${searchTerm}`);
  const data = await res.json();

  showData(data);
}

// Show song and artist in DOM
function showData(data) {
  results.innerHTML = `
    <ul class="songs">
        ${data.data
          .map(
            (song) => `
            <li>
                <span>
                    <strong>${song.artist.name}</strong> - ${song.title}
                </span>
                <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Get Lyrics</button>
            </li>
        `
          )
          .join("")}
    </ul>  
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
        ${
          data.prev
            ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
            : ""
        }
        ${
          data.next
            ? `<button class="btn" onclick="getMoreSongs('${data.next}')" >Next</button>`
            : ""
        }
      `;
  } else {
    more.innerHTML = "";
  }
}

// Get more songs on next / prev click
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

// Get Song Lyrics
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiULR}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  results.innerHTML = `
    <h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>
  `;

  more.innerHTML = "";
}

// Event Listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert("Please enter a search term");
  } else {
    searchSongs(searchTerm);
  }
});

results.addEventListener("click", (e) => {
  const clickedEl = e.target;

  if (clickedEl.tagName === "BUTTON") {
    const artist = clickedEl.getAttribute("data-artist");
    const songTitle = clickedEl.getAttribute("data-song-title");

    getLyrics(artist, songTitle);
  }
});
