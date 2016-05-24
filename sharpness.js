(function (ns) {

    'use strict';

    var kernel = [
         0, -1,  0,
        -1,  5, -1,
         0, -1,  0
    ];

    /**
     * バッファの作成
     *
     * 画像を操作できるように、引数の画像からバッファを生成して返す
     *
     * @param {HTMLImage|HTMLCanvas} img
     *
     * @return {HTMLCanvas}
     */
    function createBuffer(img) {
        var buffer = document.createElement('canvas');
        var bufferCtx = buffer.getContext('2d');

        buffer.width  = img.width;
        buffer.height = img.height;
        bufferCtx.drawImage(img, 0, 0);

        return buffer;
    }

    /**
     * フィルターを実行する
     *
     * @param {HTMLImage|HTMLCanvas} cv フィルタをかける対象
     * @param {Array} kernel 畳み込みのカーネル
     *
     * @return {HTMLCanvas} フィルタをかけた結果のバッファ
     */
    function performFilter(cv, kernel) {
        var buffer    = createBuffer(cv);
        var bufferCtx = buffer.getContext('2d');

        var src = bufferCtx.getImageData(0, 0, buffer.width, buffer.height);
        var dst = bufferCtx.createImageData(src);

        convolution(src, dst, kernel);
        bufferCtx.putImageData(dst, 0, 0);

        return buffer;
    }

    /**
     * シャープネスを実行
     *
     * @param {HTMLImage|HTMLCanvs} canvas シャープネスを実行する対象
     *
     * @return {HTMLCanvas} シャープネスをかけたバッファ
     */
    function sharpness(canvas) {
        return performFilter(canvas, kernel);
    }

    // Exports
    ns.sharpness = sharpness;

}(window));
