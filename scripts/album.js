// Example Album
var albumPicasso = 
{
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: 
    [
        { title: 'Blue',    duration: '4:26' },
        { title: 'Green',   duration: '3:14' },
        { title: 'Red',     duration: '5:01' },
        { title: 'Pink',    duration: '3:21' },
        { title: 'Magenta', duration: '2:15' }
    ]
};

// Another Example Album
var albumMarconi = 
{
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: 
    [
        { title: 'Hello, Operator?',     duration: '1:01' },
        { title: 'Ring, ring, ring',     duration: '5:01' },
        { title: 'Fits in your pocket',  duration: '3:21' },
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number',   duration: '2:15' }
    ]
};

var albumFake = 
{
    title: 'The Fake Album',
    artist: 'Fake McFake',
    label: 'EMI',
    year: '2016',
    albumArtUrl: 'assets/images/album_covers/03.png',
    songs: 
    [
        { title: 'Fake song',           duration: '1:01' },
        { title: 'Fake, fake, fake',    duration: '5:99' },
        { title: 'Fake in your pocket', duration: '9:71' },
        { title: 'Another fake song',   duration: '5:11' },
        { title: 'Fake phone number',   duration: '3:17' }
    ]
};


function createSongRow(songNumber, songName, songLength)
{
    var template = 
         '<tr class="album-view-song-item">'
        +   '<td class="song-item-number" data-song-number="' + songNumber +'">'   + songNumber + '</td>'
        +   '<td class="song-item-title">'    + songName + '</td>'
        +   '<td class="song-item-duration">' + songLength + '</td>'
        +'</tr>'
        ;
    
    return $(template);
};


function setCurrentAlbum(album)
{   
    $(".album-view-title").text(album.title);
    $(".album-view-artist").text(album.artist);
    $(".album-view-release-info").text(album.year + " " + album.label);
    $(".album-cover-art").attr("src", album.albumArtUrl);
    
    $(".album-view-song-list").empty();
    
    for (var i = 0; i < album.songs.length; i++)
    {
        $(".album-view-song-list").append(createSongRow(i + 1, album.songs[i].title, album.songs[i].duration )); 
    }  
};


function findParentByClassName(currentElement, parentClass)
{
    if (currentElement)
    {
        while(currentElement.className != parentClass && currentElement.parentElement !== null)
        {
            currentElement = currentElement.parentElement;
        }
    };
    
    return currentElement;
}

// Get the song item number, wherever the user clicks on a song-item

function getSongItem(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

// Event handler for controlling play/pause button state

function clickHandler(targetElement)
{    
    var songItem = getSongItem(targetElement);
    
    if (currentlyPlayingSong === null)
    {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
    else if (currentlyPlayingSong === songItem.getAttribute('data-song-number'))
    {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    }
    else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number'))
    {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
}


var albumList         = [albumPicasso, albumMarconi, albumFake],
    albumIndex        = 0,
    songListContainer = document.getElementsByClassName("album-view-song-list")[0],
    songRows          = document.getElementsByClassName('album-view-song-item'),
    currentlyPlayingSong = null;


// Album button templates
var playButtonTemplate  = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

window.onload = function()
{
    setCurrentAlbum(albumPicasso);
    
    // Cycle through albums when user clicks on album cover

    document.getElementsByClassName("album-cover-art")[0].addEventListener("click", function()
    {
        (albumIndex < albumList.length - 1) ? albumIndex++ : albumIndex = 0;
        setCurrentAlbum(albumList[albumIndex]);                                                         
    });
    
    // Add event listener to song list, target song items and insert play button over song number
    
    songListContainer.addEventListener("mouseover", function(event)
    { 
        var songItem = getSongItem(event.target);
        var songItemNumber = songItem.getAttribute('data-song-number');
        
        if ((event.target.parentElement.className === 'album-view-song-item') &&
            (songItemNumber !== currentlyPlayingSong))
        {
            songItem.innerHTML = playButtonTemplate;
        }
                
    });
    
    
    // Add event listeners to each table row (song-list-item)
    
    for (var i = 0; i < songRows.length; i++)
    {
        songRows[i].addEventListener("mouseleave", function(event)
        {
            var songItem       = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
           
            // Change content of target (song-item-number) on mouseleave, if target is not
            // currently playing song
            if (songItemNumber !== currentlyPlayingSong)
            {
                songItem.innerHTML = songItemNumber;
            }
        });

        songRows[i].addEventListener("click", function(event)
        {
            clickHandler(event.target);
        });
    }
};