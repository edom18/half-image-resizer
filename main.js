(function () {

    'use strict';

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    document.body.appendChild(canvas);

    var dropZone = document.getElementById('dropZone');
    dropZone.addEventListener('mouseenter', function (evt) {
        console.log('enter');
    }, false);
    dropZone.addEventListener('dragover', function (evt) {
        evt.preventDefault();
    }, false);

    dropZone.addEventListener('drop', function (evt) {
        evt.preventDefault();
        console.log('drop');

        if (evt.dataTransfer.files.length > 0) {
            loadFile(evt.dataTransfer.files[0]);
        }
    }, false);

    function loadFile(file) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var img = new Image();
            img.onload = function () {
                canvas.width  = this.width/2;
                canvas.height = this.height/2;

                context.drawImage(this, 0, 0, this.width/2, this.height/2);

                var cv = sharpness(canvas);
                document.body.appendChild(cv);

                cv.toBlob(function (blob) {
                    var a = document.createElement('a');
                    a.download = 'resized.png';
                    a.href = URL.createObjectURL(blob);

                    var evt = document.createEvent('MouseEvent');
                    evt.initEvent('click', true, false);
                    a.dispatchEvent(evt);
                });
            };
            img.src = this.result;
        };
        reader.readAsDataURL(file);
    }

}(window));
