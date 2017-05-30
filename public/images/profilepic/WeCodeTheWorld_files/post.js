if (window.FileReader) {

    document.getElementById("postpic").onchange = function() {

        var counter = -1,
            file;

        while (file = this.files[++counter]) {

            var reader = new FileReader();

            reader.onloadend = (function(file) {

                return function() {


                    var source = /^image/.test(file.type) ? this.result : "http://i.stack.imgur.com/t9QlH.png";

                       $('#picGoesHere').append(`<img src="${source}" id="${counter}" class="postimg" style="margin:5px; height:100px;"  onclick ="de(event)">`);






                };

            })(file);


            reader.readAsDataURL(file);

        }

    }

}
