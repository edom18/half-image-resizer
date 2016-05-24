(function () {
    'use strict';

    var kernel = [
        0, -1,  0,
        -1,  5, -1,
        0, -1,  0
    ];

    function createBuffer(img) {
        var buffer = document.createElement('canvas');
        var bufferCtx = buffer.getContext('2d');

        buffer.width  = img.width;
        buffer.height = img.height;
        bufferCtx.drawImage(img, 0, 0);

        return buffer;
    }

    function performFilter(cv, kernel) {
        var buffer    = createBuffer(cv);
        var bufferCtx = buffer.getContext('2d');

        var src = bufferCtx.getImageData(0, 0, buffer.width, buffer.height);
        var dst = bufferCtx.createImageData(src);

        convolution(src, dst, kernel);
        bufferCtx.putImageData(dst, 0, 0);

        return buffer;
    }

    function sharpness(canvas) {
        return performFilter(canvas, kernel);
    }


    //////////////////////////////////////////////////


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
