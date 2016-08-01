function createSongRow(songNumber, songName, songLength)
{
    var template = 
          '<tr class="album-view-song-item">'
        +    '<td class="song-item-number" data-song-number="' + songNumber +'">'   + songNumber + '</td>'
        +    '<td class="song-item-title">'    + songName + '</td>'
        +    '<td class="song-item-duration">' + songLength + '</td>'
        + '</tr>';
    
    var $row = $(template);
    
    var clickHandler = function()
    {
        let $clickedSongNumber = parseInt($(this).attr("data-song-number")); // this = song-item-number

        if (currentlyPlayingSongNumber !== null)
        {
            // Revert to song number for currently playing song because user started playing new song.
            var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            $currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        
        if (currentlyPlayingSongNumber !== $clickedSongNumber)
        {
            // Switch play button to pause because user has started playing this song
            $(this).html(pauseButtonTemplate);
            setSong($clickedSongNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
        }
        else if (currentlyPlayingSongNumber === $clickedSongNumber)
        {
            if (currentSoundFile.isPaused())
            {   // start playing the paused song and set buttons to pause
                currentSoundFile.play();
                $(this).html(pauseButtonTemplate);
                $(".main-controls .play-pause").html(playerBarPauseButton);
            }
            else 
            {   // pause the playing song and set the buttons to play
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $(".main-controls .play-pause").html(playerBarPlayButton);
            }
        }
    }
    
    var onHover = function(event)
    {
        let $songNumberCell = $(this).find(".song-item-number"); // this = $row
        let $songNumber     = parseInt($songNumberCell.attr("data-song-number"));
        
        if ($songNumber !== currentlyPlayingSongNumber)
        {
            $songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event)
    {   
        let $songNumberCell = $(this).find(".song-item-number");
        let $songNumber     = parseInt($songNumberCell.attr("data-song-number"));
        
        if ($songNumber !== currentlyPlayingSongNumber)
        {
            $songNumberCell.html(songNumber);
        } 
    }
    
    $row.find(".song-item-number").click(clickHandler); // handle play/pause for the clicked song No.
    $row.hover(onHover, offHover); // combines mouseover & mouseleave functionality
    
    return $row; // returned with event listeners attached
};


function setCurrentAlbum(album)
{   
    currentAlbum = album;
    
    $(".album-view-title").text(album.title);
    $(".album-view-artist").text(album.artist);
    $(".album-view-release-info").text(album.year + " " + album.label);
    $(".album-cover-art").attr("src", album.albumArtUrl);
    
    $(".album-view-song-list").empty();
    
    for (var i = 0; i < album.songs.length; i++)
    {
        $(".album-view-song-list").append(createSongRow(i + 1, album.songs[i].title, album.songs[i].duration )); 
    }  
}


function setSong(songNumber)
{   
    if (currentSoundFile)
    {
        currentSoundFile.stop();
    }
    
    if (songNumber)
    {
        currentlyPlayingSongNumber = parseInt(songNumber);
        currentSongFromAlbum       = currentAlbum.songs[songNumber - 1];
    }
    else // not sure this conditional is worth having given the changes to clickHandler() 
    {
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum       = null;
    }
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, 
    {
        formats: [ "mp3" ],
        preload: true
    });
    
    setVolume(currentVolume);
}

function setVolume(volume)
{
    if (currentSoundFile)
    {
        currentSoundFile.setVolume(volume);
    }
}


function getSongNumberCell(number)
{
    var songNumberCell = null;
    
    if (number)
    {
        songNumberCell = $('.song-item-number[data-song-number="' + number + '"]');
    }
    
    return songNumberCell;
}


function trackSongIndex(album, song)
{
    return album.songs.indexOf(song);
}


function nextSong()
{
    var songIndex              = trackSongIndex(currentAlbum, currentSongFromAlbum),
        nextSongIndex          = (songIndex + 1) % currentAlbum.songs.length,
        $songNumberCell        = $('.song-item-number[data-song-number="' + (songIndex     + 1) + '"]'),
        $nextSongNumberCell    = $('.song-item-number[data-song-number="' + (nextSongIndex + 1) + '"]');

    
    setSong(nextSongIndex + 1);
    currentSoundFile.play();
    
    $songNumberCell.html(songIndex + 1);
    $nextSongNumberCell.html(pauseButtonTemplate);
    updatePlayerBarSong();
}


function previousSong()
{
    var songIndex               = trackSongIndex(currentAlbum, currentSongFromAlbum),
        previousSongIndex       = (5 + (songIndex - 1) % currentAlbum.songs.length) % 5, // I might be getting carried away!
        $songNumberCell         = $('.song-item-number[data-song-number="' + (songIndex         + 1) + '"]'),
        $previousSongNumberCell = $('.song-item-number[data-song-number="' + (previousSongIndex + 1) + '"]');

    setSong(previousSongIndex + 1);
    currentSoundFile.play();
    
    $songNumberCell.html(songIndex + 1);
    $previousSongNumberCell.html(pauseButtonTemplate);
    updatePlayerBarSong();
}


function togglePlayFromPlayerBar()
{
    var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
  
    if (currentSoundFile.isPaused())
    {
        $currentlyPlayingCell.html(pauseButtonTemplate);
        $playerBarMainControl.html(playerBarPauseButton);
        currentSoundFile.play();
    }
    else if (currentSoundFile)
    {
        $currentlyPlayingCell.html(playButtonTemplate);
        $playerBarMainControl.html(playerBarPlayButton);
        currentSoundFile.pause();
    }
}


function updatePlayerBarSong()
{
    if (currentlyPlayingSongNumber)
    {
        $(".currently-playing .song-name").text(currentSongFromAlbum.title);
        $(".currently-playing .artist-name").text(currentAlbum.artist);
        $(".currently-playing .artist-song-mobile").text(currentAlbum.artist + " - " + currentSongFromAlbum.title);
        $(".main-controls .play-pause").html(playerBarPauseButton);
    }
}


var albumIndex                 = 0,
    albumList                  = [albumPicasso, albumMarconi, albumFake],
    currentAlbum               = null,
    currentlyPlayingSongNumber = null,
    currentSongFromAlbum       = null,
    currentSoundFile           = null,
    currentVolume              = 80,
    pauseButtonTemplate        = '<a class="album-song-button"><span class="ion-pause"></span></a>',
    playButtonTemplate         = '<a class="album-song-button"><span class="ion-play"></span></a>',
    playerBarPauseButton       = '<span class="ion-pause"></span>',
    playerBarPlayButton        = '<span class="ion-play"></span>',
    $playerBarMainControl      = $(".main-controls .play-pause"),
    $nextButton                = $(".main-controls .next"),
    $previousButton            = $(".main-controls .previous");


$(document).ready(function()
{
    setCurrentAlbum(albumPicasso);
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
    $playerBarMainControl.click(togglePlayFromPlayerBar)
    
    // Cycle through albums when user clicks on album cover
    $(".album-cover-art").click(function()
    {
        albumIndex = (albumIndex + 1) % albumList.length; // loop in the range 0 to album.length - 1
        setCurrentAlbum(albumList[albumIndex]);                                                         
    });
});
