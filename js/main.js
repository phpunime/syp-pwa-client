/**
 * Created by J on 16/10/2016.
 * Author Joao Maciel <j.maciel.hd@gmail.com>
 */
var syp = {

    'apiDomain': 'https://syp-api.localhost/',
    'currentPosition': null,
    'form': null,

    'init': function () {

        if(!syp.isOnline()) {
            syp.showOfflinePage();
            return;
        }
        if(!syp.hasGeolocation()) {
            return;
        }

        //pega a posição atual
        syp.getPosition();

        jQuery('#btn-camera').click(function (e) {
            syp.getPicture();
        });

        jQuery('#take-picture').change(function (e) {
            syp.form = new FormData();
            syp.form.append('latitude', syp.currentPosition.latitude);
            syp.form.append('longitude', syp.currentPosition.longitude);
            syp.showConfirmPicture(e.target.files);

        });

        jQuery('#confirm-send').click(function (e) {
            var imgUrl = jQuery('#picture-preview').attr('src');
            syp.toDataUrl(imgUrl, syp.sendPicture);
        });
    },

    'isOnline': function () {
        return navigator.onLine;
    },

    'hasGeolocation': function () {
        return navigator.geolocation;
    },

    'showOfflinePage': function () {
        var html = '<div id="offline-page">'+
                   'Você está offline, não conseguimos te mostrar as fotos tiradas na região :( <br>'+
                   '<button class="btn btn-primary" onclick="location.reload();">Tente Novamente</button>'+
                   '</div>';
        jQuery('#page-container').html(html);
    },

    'toDataUrl': function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    },

    'showConfirmPicture': function (files) {
        if (files && files.length > 0) {
            file = files[0];

            // Get window.URL object
            var URL = window.URL || window.webkitURL;

            // Create ObjectURL
            var imgURL = URL.createObjectURL(file);

            // Set img src to ObjectURL
            jQuery('#picture-preview').attr('src', imgURL);

            // Launch Modal
            jQuery('#picture-modal').modal();

            // Revoke ObjectURL
            // URL.revokeObjectURL(imgURL);
        }
    },

    'sendPicture': function (base64) {

        console.log(base64);
        syp.form.append('picture', base64);

        jQuery.ajax({
            url: syp.apiDomain + 'api/v1/photos', // Url do lado server que vai receber o arquivo
            data: syp.form,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                if(data.success === true) {
                    jQuery('#picture-modal').modal('hide');
                    swal('Foto enviada com sucesso', 'Parabéns sua foto foi publicada', 'success');
                    syp.listaFotos();
                }
            }
        });
    },

    'getPicture': function () {
        jQuery('#take-picture').click();
    },

    'getPositionSuccess': function (position) {
        syp.currentPosition = {
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude
        };
        jQuery('#location-status span').attr('class', 'glyphicon glyphicon-pushpin');
        syp.listaFotos();
    },

    'getPositionError': function () {
        console.log('erro');
        jQuery('#location-status span').attr('class', 'glyphicon glyphicon-alert');
        syp.currentPosition = null;
    },

    'getPosition': function () {
        navigator.geolocation.getCurrentPosition(syp.getPositionSuccess, syp.getPositionError);
    }, 
    
    'listaFotos': function () {
        jQuery.ajax({
            url: syp.apiDomain + "api/v1/photos",
            data: {'latitude': syp.currentPosition.latitude, 'longitude': syp.currentPosition.longitude},
            dataType: "JSON",
            success: function (data) {
                jQuery('#list-fotos').html('');
                jQuery.each(data.fotos, function(index, value) {
                    jQuery('#list-fotos').append('<img src="' + syp.apiDomain + value.url + '" />');
                });
            }
        });
    }

}

window.onload = function() {
    // Register the service worker if available.
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then(function(reg) {
            console.log('Successfully registered service worker', reg);
        }).catch(function(err) {
            console.warn('Error whilst registering service worker', err);
        });
    }

    syp.init();

}