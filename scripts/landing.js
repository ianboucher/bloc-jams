
var animatePoints = function() {

    /* This script transitions the styles from those given in the .css 
    file to those specified here. */

    function revealPoint() 
    {
        $(this).css({opacity: 1, transform: "scaleX(1) translateY(0)"});
    };
    
    $.each($(".point"), revealPoint);
};

$(window).load(function()
{
    // Automatically animate on tall screens where .sellingPoints visible without scrolling
    
    if($(window).height() > 950)
    {
        animatePoints();
    }
    
    var scrollDistance = $(".sellingPoints").offset().top - $(window).height() + 200;
    
    /* $(window).height is the distance to the fold. scrollDistance provides a measurement for 
    triggering the animation when 200px of the .sellingPoints div is visible */
    
    $(window).scroll(function(event)
    {
        if ($(window).scrollTop() >= scrollDistance)
        {
            animatePoints(points);
        }
    });
});