function revealPoint(point) 
{
    point.style.opacity         = 1;
    point.style.transform       = "scaleX(1) translateY(0)";
    point.style.msTransform     = "scaleX(1) translateY(0)";
    point.style.WebkitTransform = "scaleX(1) translateY(0)";
};

var points = document.getElementsByClassName('point');

window.onload = function()
{
    // Automatically animate on tall screens where .sellingPoints visible without scrolling
    
    if(window.innerHeight > 950)
    {
        myForEach(points, revealPoint);
    }
    
    var sellingPoints  = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 150;
    
    /* window.innerHeight is the distance to the fold. scrollDistance provides a measurement for 
    triggering the animation when 150px of the .sellingPoints div is visible */
    
    window.addEventListener("scroll", function(event)
    {
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance)
        {
            myForEach(points, revealPoint);
        }
    });
};