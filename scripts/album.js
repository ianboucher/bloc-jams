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
            setVolume(currentVolume);
            updatePlayerBarSong();
            updateSeekBarWhileSongPlays();
            updateSeekPercentage($(".volume .seek-bar"), currentVolume / 100)
        }
        else if (currentlyPlayingSongNumber === $clickedSongNumber)
        {
            if (currentSoundFile.isPaused())
            {   // start playing the paused song and set buttons to pause
                currentSoundFile.play();
                setVolume(currentVolume);
                $(this).html(pauseButtonTemplate);
                $(".main-controls .play-pause").html(playerBarPauseButton);
                updateSeekBarWhileSongPlays();
                updateSeekPercentage($(".volume .seek-bar"), currentVolume / 100)
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
    
    var $albumTitle = $('.album-view-title'),
        $albumArtist = $('.album-view-artist'),
        $albumReleaseInfo = $('.album-view-release-info'),
        $albumImage = $('.album-cover-art'),
        $albumSongList = $('.album-view-song-list');
 
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + " " + album.label);
    $albumImage.attr("src", album.albumArtUrl);  
    $albumSongList.empty();
    
    for (var i = 0; i < album.songs.length; i += 1)
    {
        $albumSongList.append(createSongRow(i + 1, album.songs[i].title, album.songs[i].duration )); 
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
    else // not sure this conditional is worth having, given the changes to clickHandler() 
    {
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum       = null;
    }
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, 
    {
        formats: [ "mp3" ],
        preload: true
    });
    
//    setVolume(currentVolume);
}


function seek(time)
{
    if (currentSoundFile)
    {
        currentSoundFile.setTime(time);
    }
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
    updateSeekBarWhileSongPlays();
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
    updateSeekBarWhileSongPlays();
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

function updateSeekPercentage($seekBar, seekBarFillRatio)
{
    var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0,   offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + "%";
    $seekBar.find(".fill").width(percentageString);
    $seekBar.find(".thumb").css({left: percentageString});
}


function setupSeekBars()
{
    var $seekBars = $(".player-bar .seek-bar");
    
    $seekBars.click(function(event)
    {                                                       // pageX = jquery for x-pos at which event occured
        var offsetX  = event.pageX - $(this).offset().left; // pageX - left edge of bar = amount of bar to fill
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        
        updateSeekPercentage($(this), seekBarFillRatio);
        
        if ($(this).parent().attr("class") === "seek-control")
        {
            seek(currentSoundFile.getDuration() * seekBarFillRatio);
        }
        else
        {
            setVolume(seekBarFillRatio * 100);
        }
    });
    
    $seekBars.find(".thumb").mousedown(function(event)
    {
        var $seekBar = $(this).parent(); // select seekbar depending on event occuring on volume/player thumb
        
        // After mousing-down on the target, attach mousemove to document to allow dragging to continue if
        // mouse leaves seekbar. jQuery bind() used as it allows namespacing of event listeners (in this case 
        // under .thumb), which ensures that this handler only fires for events inluding the .thumbOnSeekBar string
        $(document).bind("mousemove.thumbOnSeekBar", function(event) 
        {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
                        
            if ($seekBar.parent().attr("class") === "seek-control")
            {
                seek(currentSoundFile.getDuration() * seekBarFillRatio);
            }
            else
            {   
                setVolume(seekBarFillRatio);
            }
        });
        
        $(document).bind("mouseup.thumbOnSeekBar", function()
        {   // remove listeners on mouseup to prevent seekbar continuing to follow mouse after mouseup
            $(document).unbind("mousemove.thumbOnSeekBar");
            $(document).unbind("mouseup.thumbOnSeekBar");
        });        
    });
}

function updateSeekBarWhileSongPlays()
{
    if (currentSoundFile)
    {
        currentSoundFile.bind("timeupdate", function(event) // timeupdate = custom Buzz event
        {
            var seekBarFillRatio = this.getTime() / this.getDuration(); // getTime/getDuration = Buzz methods
            var $seekBar = $(".seek-control .seek-bar");
            
            updateSeekPercentage($seekBar, seekBarFillRatio);    
        });
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
    $nextButton                = $(".main-controls .next"),
    $previousButton            = $(".main-controls .previous");


$(document).ready(function()
{
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
    
    // Cycle through albums when user clicks on album cover
    $(".album-cover-art").click(function()
    {
        albumIndex = (albumIndex + 1) % albumList.length; // loop in the range 0 to album.length - 1
        setCurrentAlbum(albumList[albumIndex]);                                                         
    });
});
