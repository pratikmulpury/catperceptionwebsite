// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.
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
    var courtschecked =  true;
    var ballschecked = true;
    var racketschecked = true;
     //selected image in gallery
    // current image to be display in slideshow
    var displayedimg = 0;
    var slideshowimages = [3];    
    var galleryimages = [];

    function setup(){
   
        $('body').append('<div id="myModal" class="modal"> <span class="close">&times; </span><img class="modal-content" id="img01"> <div id="caption"></div></div> ');  
  
        $.ajaxSetup({'async': false});
        $.ajax({
            type: 'GET',
            url: "../gallery/javascript/rackets.json",
            dataType: "json",
            success: function (data) {
                rackets = data;
                slideshowimages[0] = '<img src="' + rackets.rackets[0].url + '"height = 200px width = 200px>>' +'</img>';
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
                slideshowimages[1] = '<img src="' + courts.courts[1].url + '"height = 200px width = 200px>>' +'</img>';
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
        $('#container2').append("<input id = 'RacketCheckbox'type='checkbox' name='tags' value='Racket' checked >Rackets <br>");
        $('#container2').append("<input id = 'BallCheckbox' type='checkbox' name='tag' value='Balls' checked>Balls <br>");
        $('#container2').append("<input id = 'CourtCheckbox'type='checkbox' name='tag' value='Courts' checked>Courts");
        slideshowdisplay(displayedimg);
        setupgallerydisplay();
    }


    function slideshowdisplay(imagenumber){
        var domElement = $('#slide');
        // remove any existing links before adding the new ones
        domElement.empty();
        // add an image element
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
                    galleryimages[curgallerydisplay] = '<img src= "' + balls.balls[i].url +'" alt="'+balls.balls[i].caption +'" data-category="'+balls.balls[i].type + '" height = 200px width = 200px>' + " </img>";
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
                    galleryimages[curgallerydisplay] = '<img src= "' + rackets.rackets[i].url +'" alt="'+rackets.rackets[i].caption +'" data-category="'+rackets.rackets[i].type + '" height = 200px width = 200px>' + " </img>";
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
                    galleryimages[curgallerydisplay] = '<img src= "' + courts.courts[i].url +'" alt="'+courts.courts[i].caption +'" data-category="'+courts.courts[i].type + '" height = 200px width = 200px>' + " </img>";
                    ++curgallerydisplay;
                }
            },
            error: function (req, status, err) {
                console.log('ERROR loading data: ', err);
            }
        }); 
        for(var i = 0; i<galleryimages.length; ++i)
        {
            $('#container2').append(galleryimages[i]);
        }
        gallerydisplay();
    }
    function gallerydisplay()
    {
        if(courtschecked === true){
            $("img[data-category='courts']").show();
        }
        else{
            $("img[data-category='courts']").hide();
        }
        if (ballschecked === true){
            $("img[data-category='balls']").show();
        }
        else{
            $("img[data-category='balls']").hide();

        }
        if(racketschecked === true){
            $("img[data-category='rackets']").show();
        }
        else{
            $("img[data-category='rackets']").hide();
        }
    }

    
    /*
    $("#RacketCheckbox").click(function(){
        alert("The paragraph was clicked.");
    });
    */
    setup(); 
    $(".previous").click(function() {
        if(displayedimg === 0)
        {
            slideshowdisplay(displayedimg);
        }
        else
        {
            displayedimg = displayedimg - 1;
            slideshowdisplay(displayedimg);
        }
    });
    $(".next").click(function() {
        if(displayedimg === 2)
        {
            slideshowdisplay(displayedimg);
        }
        else
        {
            displayedimg = displayedimg+1;
            slideshowdisplay(displayedimg);
        }
    });
    $("#RacketCheckbox").click(function() {
        racketschecked = !racketschecked;
        console.log(racketschecked);
        gallerydisplay();
    });
    $("#CourtCheckbox").click(function() {
        courtschecked = !courtschecked;
        gallerydisplay();
    });
    $("#BallCheckbox").click(function() {
        ballschecked = !ballschecked;
        gallerydisplay();
    });
    $("img[data-category]").click(function()
    {
        // Get the <span> element that closes the modal
        var modalImg = $("#img01");
        var modal = $("#myModal");
        var captionText = $('#caption');
        var src = $(this).attr('src');

        modal.show();
        $("#myModal").css("display", "block");
        modalImg.attr("src", $(this).attr("src"));
        modalImg.attr("height", '400px');
        modalImg.attr("width", '400px');
        captionText.html($(this).attr("alt"));
    });
    $('span').click(function(){
        var modal = $("#myModal");
        modal.hide();
    });
}); 
