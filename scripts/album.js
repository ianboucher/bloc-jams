// Example Albums
var albumPicasso = 
{
    title:       "The Colors",
    artist:      "Pablo Picasso",
    label:       "Cubism",
    year:        "1881",
    albumArtUrl: "assets/images/album_covers/01.png",
    songs: 
    [
        { title: "Blue",    duration: "4:26" },
        { title: "Green",   duration: "3:14" },
        { title: "Red",     duration: "5:01" },
        { title: "Pink",    duration: "3:21" },
        { title: "Magenta", duration: "2:15" }
    ]
};

var albumMarconi = 
{
    title:       "The Telephone",
    artist:      "Guglielmo Marconi",
    label:       "EM",
    year:        "1909",
    albumArtUrl: "assets/images/album_covers/20.png",
    songs: 
    [
        { title: "Hello, Operator?",     duration: "1:01" },
        { title: "Ring, ring, ring",     duration: "5:01" },
        { title: "Fits in your pocket",  duration: "3:21" },
        { title: "Can you hear me now?", duration: "3:14" },
        { title: "Wrong phone number",   duration: "2:15" }
    ]
};

var albumFake = 
{
    title:       "The Fake Album",
    artist:      "Fake McFake",
    label:       "EMI",
    year:        "2016",
    albumArtUrl: "assets/images/album_covers/03.png",
    songs: 
    [
        { title: "Fake song",           duration: "1:01" },
        { title: "Fake, fake, fake",    duration: "5:99" },
        { title: "Fake in your pocket", duration: "9:71" },
        { title: "Another fake song",   duration: "5:11" },
        { title: "Fake phone number",   duration: "3:17" }
    ]
};

// Album button templates
var playButtonTemplate  = '<a class="album-song-button"><span class="ion-play"></span></a>',
    pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>',
    currentlyPlayingSong = null;


function createSongRow(songNumber, songName, songLength)
{
    var template = 
         '<tr class="album-view-song-item">'
        +   '<td class="song-item-number" data-song-number="' + songNumber +'">'   + songNumber + '</td>'
        +   '<td class="song-item-title">'    + songName + '</td>'
        +   '<td class="song-item-duration">' + songLength + '</td>'
        +'</tr>';
    
    var $row = $(template);
    
    var clickHandler = function()
    {
        let $clickedSongNumber = $(this).attr("data-song-number"); // this = song-item-number

        if (currentlyPlayingSong !== null)
        {
            // Revert to song number for currently playing song because user started playing new song.
            var $currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
            $currentlyPlayingCell.html(currentlyPlayingSong);
        }
        
        if (currentlyPlayingSong !== $clickedSongNumber)
        {
            // Switch play button to pause because user has started playing this song
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSong = $clickedSongNumber;
        }
        else if (currentlyPlayingSong !== $clickedSongNumber)
        {
            // Switch pause button to play because user has paused current song
            $(this).html(playButtonTemplate);
            currentlyPlayingSong = null;
        }      
    }
    
    var onHover = function(event)
    {
        let $songNumberCell = $(this).find(".song-item-number"); // this = $row
        let $songNumber     = $songNumberCell.attr("data-song-number");
        
        if ($songNumber !== currentlyPlayingSong)
        {
            $songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event)
    {   
        let $songNumberCell = $(this).find(".song-item-number");
        let $songNumber     = $songNumberCell.attr("data-song-number");
        
        if ($songNumber !== currentlyPlayingSong)
        {
            $songNumberCell.html(songNumber);
        } 
    }
    
    $row.find(".song-item-number").click(clickHandler); // handle play/pause for the clicked song No.
    $row.hover(onHover, offHover); // combines mouseover & mouseleave functionality
    
    return $row // returned with event listeners attached
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


var albumList         = [albumPicasso, albumMarconi, albumFake],
    albumIndex        = 0;

$(document).ready(function()
{
    setCurrentAlbum(albumPicasso);
    
    // Cycle through albums when user clicks on album cover
    $(".album-cover-art").click(function()
    {
        (albumIndex < albumList.length - 1) ? albumIndex++ : albumIndex = 0;
        setCurrentAlbum(albumList[albumIndex]);                                                         
    });
});