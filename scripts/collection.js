var buildCollectionItemTemplate = function()
{
    var template =
    '<div class="collection-album-container column fourth">'
    +   '<img src="assets/images/album_covers/01.png"/>'
    +   '<div class="collection-album-info caption">'
    +       '<p>'
    +           '<a class="album-name" href="/album.html"> The Colors </a>'
    +           '<br/>'
    +           '<a href="/album.html"> Pablo Picasso </a>'
    +           '<br/>'
    +           'X songs'
    +           '<br/>'
    +       '</p>'
    +   '</div>'
    +'</div>'
    ;
    
    return $(template);
};

$(window).load(function()
{
    $(".album-covers").empty();
    
    for (var i = 0; i < 12; i++)
    {
        $(".album-covers").append(buildCollectionItemTemplate)
    }
});

/* Above, I've used the jQuery selectors directly rather than assigning them to variables, 
as was demonstrated in the tutorial. Are the disadvantages to this? */