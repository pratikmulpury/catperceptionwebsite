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
        slideshowdisplay(displayedimg)
        gallerydisplay()
    }

    function slideshowdisplay(imagenumber){
        console.log(displayedimg);
        var domElement = $('#slide');
        // remove any existing links before adding the new ones
        domElement.empty();
        // add an image element
        console.log(slideshowimages[imagenumber]);
        $('#slide').append(slideshowimages[imagenumber]);
        console.log($('#slide'));
    }
    function gallerydisplay(check1,check2,check3){

        
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

}); 