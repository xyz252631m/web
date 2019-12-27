var t = {
    canvasToImage(backgroundColor) {
        //cache height and width
        var w = canvas.width;
        var h = canvas.height;

        var data;

        if (backgroundColor) {
            //get the current ImageData for the canvas.
            data = context.getImageData(0, 0, w, h);

            //store the current globalCompositeOperation
            var compositeOperation = context.globalCompositeOperation;

            //set to draw behind current content
            context.globalCompositeOperation = "destination-over";

            //set background color
            context.fillStyle = backgroundColor;

            //draw background / rect on entire canvas
            context.fillRect(0, 0, w, h);
        }

        //get the image data from the canvas
        var imageData = this.canvas.toDataURL("image/png");

        if (backgroundColor) {
            //clear the canvas
            context.clearRect(0, 0, w, h);

            //restore it with original / cached ImageData
            context.putImageData(data, 0, 0);

            //reset the globalCompositeOperation to what it was
            context.globalCompositeOperation = compositeOperation;
        }

        //return the Base64 encoded data url string
        return imageData;
    },
    down(doc, base64data, fileName) {
        let link = doc.createElement('a');
        link.href = base64data;
        link.download = fileName;
        // var event = document.createEvent('MouseEvents');
        // event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        // link.dispatchEvent(event);
        doc.body.appendChild(link);
        link.click();
        doc.body.removeChild(link);
    },

    download() {

        let fileName=new Date().getTime()+'';
        const canvas =document.getElementById("canvas");
        var context = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        let data = context.getImageData(0, 0, w, h);
        //store the current globalCompositeOperation
        var compositeOperation = context.globalCompositeOperation;
        //set to draw behind current content
        context.globalCompositeOperation = "destination-over";
        //set background color
        context.fillStyle = "#ffffff";
        //draw background / rect on entire canvas
        context.fillRect(0,0,w,h);
        let image = canvas.toDataURL();
        this.down(document, image, fileName);

    },
}