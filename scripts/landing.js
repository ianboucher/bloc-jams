var points = document.getElementsByClassName('point');

var animatePoints = function(points) {

    /* This script transitions the styles from those given in the .css 
    file to those specified here. */

    function revealPoint(i) 
    {
        points[i].style.opacity         = 1;
        points[i].style.transform       = "scaleX(1) translateY(0)";
        points[i].style.msTransform     = "scaleX(1) translateY(0)";
        points[i].style.WebkitTransform = "scaleX(1) translateY(0)";
    };
    
    for (var i = 0; i < points.length; i++)
    {
        revealPoint(i);
    };
};

window.onload = function()
{
    // Automatically animate on tall screens where .sellingPoints visible without scrolling
    
    if(window.innerHeight > 950)
    {
        animatePoints(points);
    }
    
    var sellingPoints  = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 150;
    
    /* window.innerHeight is the distance to the fold. scrollDistance provides a measurement for 
    triggering the animation when 150px of the .sellingPoints div is visible */
    
    window.addEventListener("scroll", function(event)
    {
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance)
        {
            animatePoints(points);
        }
    });
};