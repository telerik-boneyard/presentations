var observable = require("data/observable");
var imageSourceModule = require("image-source");
var fileSystemModule = require("file-system");
var observableArrayModule = require("data/observable-array");
var enums = require("ui/enums");

var Everlive = require('./everlive.all.min');
var everlive = new Everlive("YOUR API KEY");

var array = new observableArrayModule.ObservableArray();
var directory = "/res/";

function imageFromSource(imageName) {
    return imageSourceModule.fromFile(fileSystemModule.path.join(__dirname, directory + imageName));
};
var item1 = {
    itemImage: imageFromSource("01.jpg")
};
var item2 = {
    itemImage: imageFromSource("02.jpg")
};
var item3 = {
    itemImage: imageFromSource("03.jpg")
};
var item4 = {
    itemImage: imageFromSource("04.jpg")
};
var item5 = {
    itemImage: imageFromSource("05.jpg")
};
var item6 = {
    itemImage: imageFromSource("06.jpg")
};
array.push([item1, item2, item3, item4, item5, item6]);
var item7 = {
    itemImage: imageFromSource("07.jpg")
};
var item8 = {
    itemImage: imageFromSource("08.jpg")
};

var photoAlbumModel = new observable.Observable();

photoAlbumModel.set("message", "Add new images");

var backendArray = new observableArrayModule.ObservableArray();

Object.defineProperty(photoAlbumModel, "photoItems", {
    get: function () {
        everlive.Files.get().then(function (data) {
                data.result.forEach(function (fileMetadata) {
                    imageSourceModule.fromUrl(fileMetadata.Uri).then(function (result) {
                        var item = {
                            itemImage: result
                        };
                        backendArray.push(item);
                    });
                });
            },
            function (error) {});
		
		// if you want to see the images right away without referring the Telerik Backend Services, use array instead of backendArray
		//return array;	
        return backendArray;
    },
    enumerable: true,
    configurable: true
});

photoAlbumModel.tapAction = function () {
    array.push([item7, item8]);

    photoAlbumModel.set("message", "Images added. Total images: " + array.length);

    for (i = 0; i < array.length; i++) {
        var file = {
            "Filename": Math.random().toString(36).substring(2, 15) + ".jpg",
            "ContentType": "image/jpeg",
            "base64": array.getItem(i).itemImage.toBase64String(enums.ImageFormat.jpeg, 100)
        };

        everlive.Files.create(file,
            function (data) {},
            function (error) {});
    }
};

exports.photoAlbumModel = photoAlbumModel;
