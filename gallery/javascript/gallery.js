/*
 * Slideshow+Gallery
 * @author Pratik Mulpury 
 */

$(function() {
    // all images
    var rackets;
    var courts;
    var balls;
    // image categories to be displayed
    var courtschecked =  false
    var ballschecked = false;
    var racketschecked = false;
     //selected image in gallery
    var enlargenedimage = null;
    // current image to be display in slideshow
    var displayedimg = 0;
    var slideshowimages = [3];    
    var galleryimages = [];

    function setup(){

        $.ajaxSetup({'async': false});
        $.ajax({
            type: 'GET',
            url: "../gallery/javascript/rackets.json",
            dataType: "json",
            success: function (data) {
                rackets = data;
                slideshowimages[0] = '<img src="' + rackets.rackets[0].url + '"height = 200px width = 200px>>' +'</img>'
            },
            error: function (req, status, err) {
                console.log('ERROR loading data: ', err);
            }
        });       
        $.ajax({
            type: 'GET',
            url:  "../gallery/javascript/courts.json",
            dataType: "json",
            success: function (data) {
                courts = data;
                slideshowimages[1] = '<img src="' + courts.courts[1].url + '"height = 200px width = 200px>>' +'</img>'
            },
            error: function (req, status, err) {
                console.log('ERROR loading data: ', err);
            }
        });   
        $.ajax({
            type: 'GET',
            url: "../gallery/javascript/balls.json",
            dataType: 'json',
            success: function (data) {
                balls = data;
                slideshowimages[2] = '<img src="' + balls.balls[1].url + '"height = 200px width = 200px>' + " </img>";
            },
            error: function (req, status, err) {
                console.log('ERROR loading data: ', err);
            }
        });   
        $('#container2').append("<input id = 'RacketCheckbox'type='checkbox' name='tags' value='Racket'>Rackets <br>");
        $('#container2').append("<input id = 'BallCheckbox' type='checkbox' name='tag' value='Balls'>Balls <br>");
        $('#container2').append("<input id = 'CourtCheckbox'type='checkbox' name='tag' value='Courts'>Courts");
        slideshowdisplay(displayedimg)
        setupgallerydisplay();
    }

    function slideshowdisplay(imagenumber){
        var domElement = $('#slide');
        // remove any existing links before adding the new ones
        domElement.empty();
        // add an image element
        console.log(slideshowimages[imagenumber]);
        $('#slide').append(slideshowimages[imagenumber]);
    }
    function setupgallerydisplay()
    {
        var curgallerydisplay = 0;

        $.ajax({
            type: 'GET',
            url: "../gallery/javascript/balls.json",
            dataType: 'json',
            success: function (data) {
                balls = data;
                for(var i = 0;i<balls.balls.length ; ++i)
                {
                    galleryimages[curgallerydisplay] = '<img src= "' + balls.balls[i].url +' alt="'+balls.balls[i].caption +'" data-category="'+balls.balls[i].type + '" height = 200px width = 200px>' + " </img>";
                    ++curgallerydisplay;
                }
            },
            error: function (req, status, err) {
                console.log('ERROR loading data: ', err);
            }
        }); 
        $.ajax({
            type: 'GET',
            url: "../gallery/javascript/rackets.json",
            dataType: 'json',
            success: function (data) {
                rackets = data;
                for(var i = 0;i<rackets.rackets.length ; ++i)
                {
                    galleryimages[curgallerydisplay] = '<img src= "' + courts.courts[i].url +' alt="'+rackets.rackets[i].caption +'" data-category="'+rackets.rackets[i].type + '" height = 200px width = 200px>' + " </img>";
                    ++curgallerydisplay;
                }
            },
            error: function (req, status, err) {
                console.log('ERROR loading data: ', err);
            }
        }); 
        $.ajax({
            type: 'GET',
            url: "../gallery/javascript/courts.json",
            dataType: 'json',
            success: function (data) {
                rackets = data;
                for(var i = 0;i<courts.courts.length ; ++i)
                {
                    galleryimages[curgallerydisplay] = '<img src= "' + courts.courts[i].url +' alt="'+courts.courts[i].caption +'" data-category="'+courts.courts[i].type + '" height = 200px width = 200px>' + " </img>";
                    ++curgallerydisplay;
                }
            },
            error: function (req, status, err) {
                console.log('ERROR loading data: ', err);
            }
        }); 

        
    }
    function gallerydisplay(){

        
    }
    function viewimage(enlargenedimage){

    }  
    /*
    $("#RacketCheckbox").click(function(){
        alert("The paragraph was clicked.");
    });
    */
    setup(); 
    $(".previous").click(function() {
        if(displayedimg == 0)
        {
            slideshowdisplay(displayedimg)
        }
        else
        {
            displayedimg = displayedimg - 1;
            slideshowdisplay(displayedimg);
        }
    });
    $(".next").click(function() {
        if(displayedimg == 2)
        {
            slideshowdisplay(displayedimg)
        }
        else
        {
            displayedimg = displayedimg+1;
            slideshowdisplay(displayedimg);
        }
    });
    $(".RacketCheckbox").click(function() {
        racketschecked = !racketschecked;
        gallerydisplay();
    });
    $(".CourtCheckbox").click(function() {
        courtschecked = !courtschecked;
        gallerydisplay();
    });
    $(".BallCheckbox").click(function() {
        ballschecked = !ballschecked;
        gallerydisplay();
    });
}); 