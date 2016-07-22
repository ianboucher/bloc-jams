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
    
    return template
};


function setCurrentAlbum(album)
{
    var albumTitle       = document.getElementsByClassName("album-view-title")[0],
        albumArtist      = document.getElementsByClassName("album-view-artist")[0],
        albumReleaseInfo = document.getElementsByClassName("album-view-release-info")[0],
        albumImage       = document.getElementsByClassName("album-cover-art")[0],
        albumSongList    = document.getElementsByClassName("album-view-song-list")[0];
    
    albumTitle.firstChild.nodeValue       = album.title;
    albumArtist.firstChild.nodeValue      = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + " " + album.label;
    albumImage.setAttribute("src", album.albumArtUrl);
    
    albumSongList.innerHTML = "";
    
    for (var i = 0; i < album.songs.length; i++)
    {
        albumSongList.innerHTML += createSongRow(i, album.songs[i].title, album.songs[i].duration);
    }  
};


var albumList         = [albumPicasso, albumMarconi, albumFake],
    albumIndex        = 0,
    songListContainer = document.getElementsByClassName("album-view-song-list")[0],
    songRows          = document.getElementsByClassName('album-view-song-item');

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

window.onload = function()
{
    setCurrentAlbum(albumPicasso);


    document.getElementsByClassName("album-cover-art")[0].addEventListener("click", function()
    {
        (albumIndex < albumList.length - 1) ? albumIndex++ : albumIndex = 0;
        setCurrentAlbum(albumList[albumIndex]);                                                         
    });
    
    songListContainer.addEventListener("mouseover", function(event)
    {
        if (event.target.parentElement.className === 'album-view-song-item')
        {
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
        }
        
        for (var i = 0; i < songRows.length; i++)
        {
            songRows[i].addEventListener("mouseleave", function(event)
            {
                this.children[0].innerHTML = this.children[0].getAttribute('data-song-number'); 
            });
        }
    });
};