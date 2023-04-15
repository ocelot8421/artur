function cropImg() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    var image = new Image();
    // image.src = "assets/img/man-bodybuilder.jpg";
    image.src = "assets/img/duck.jpg";

    image.onload = function () {
        // body builder img:
        // ctx.drawImage(image, 0, -10, 300, 320);
        // mudi dog img:
        ctx.drawImage(image, 0, -10, 300, 320);
    }
}

cropImg();