/**
 * Created by Vonlion on 2016/12/16.
 */
var c = document.getElementById("myCanvas");
var cxt = c.getContext("2d");


function getImg() {
    if (this.files && this.files[0]) {
        var FR= new FileReader();
        FR.onload = function(e) {
            drawImg(e.target.result);
            // document.getElementById("img").src = e.target.result;
            //document.getElementById("b64").innerHTML = e.target.result;
        };
        FR.readAsDataURL( this.files[0] );
    }
}

function drawImg(result) {
    var img = new Image();
    img.src = result;
    img.onload = function(){
        cxt.drawImage(img,0,0);
    };
    cxt.drawImage(img,0,0);
}

document.getElementById("inp").addEventListener("change", getImg, false);
