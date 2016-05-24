(function () {

    'use strict';

    var dropZone = document.getElementById('dropZone');
    dropZone.addEventListener('dragover', function (evt) {
        evt.preventDefault();
    }, false);
    dropZone.addEventListener('drop', function (evt) {
        evt.preventDefault();
        console.log('drop');

        if (evt.dataTransfer.files.length > 0) {
            loadImage(evt.dataTransfer.files[0]).then(loadedImage);
        }
    }, false);

    /**
     * 画像読み込み後のハンドラ
     */
    function loadedImage(image) {
        var width  = image.width/2;
        var height = image.height/2;

        var buffer1  = document.createElement('canvas');
        var context = buffer1.getContext('2d');

        buffer1.width  = width;
        buffer1.height = height;

        context.drawImage(image, 0, 0, width, height);

        var buffer2 = sharpness(buffer1);

        buffer2.toBlob(function (blob) {
            download(blob);
        });

        view(buffer1, document.body);
        view(buffer2, document.body);
    }

    /**
     * Canvasの内容をimg要素として表示する
     */
    function view(canvas, target) {
        var url = canvas.toDataURL();
        var img = new Image();
        img.onload = function () {
            target.appendChild(this);
        };
        img.src = url;
    }

    /**
     * ダウンロードを実行
     */
    function download(blob) {
        var a = document.createElement('a');
        a.download = 'resized.png';
        a.href = URL.createObjectURL(blob);

        var evt = document.createEvent('MouseEvent');
        evt.initEvent('click', true, false);
        a.dispatchEvent(evt);
    }

    /**
     * ファイルをロード
     *
     * @param {File} file
     */
    function loadImage(file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (evt) {
                var img = new Image();
                img.onload = function () {
                    resolve(img);
                };
                img.src = this.result;
            };
            reader.readAsDataURL(file);
        });
    }

}(window));
