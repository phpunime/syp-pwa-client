/**
 * Created by J on 16/10/2016.
 * Author Joao Maciel <j.maciel.hd@gmail.com>
 */
var syp = {

    'currentPosition': null,
    'form': null,

    'init': function () {
        syp.verifyCompatibility();
        syp.getPosition();
        syp.listaFotos();

        jQuery('#btn-camera').click(function (e) {
            syp.getPicture();
        });

        jQuery('#take-picture').change(function (e) {
            syp.form = new FormData();
            syp.form.append('fileUpload', event.target.files[0]);
            syp.showConfirmPicture(e.target.files);
        });

        jQuery('#confirm-send').click(function (e) {
            syp.sendPicture();
        });
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
            $('#picture-modal').modal();

            // Revoke ObjectURL
            // URL.revokeObjectURL(imgURL);
        }
    },

    'sendPicture': function () {

        $.ajax({
            url: '/mok-server/fotos.php', // Url do lado server que vai receber o arquivo
            data: syp.form,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                if(data.success === true) {
                    $('#picture-modal').modal('hide');
                    swal('Foto enviada com sucesso', 'Parabéns sua foto foi publicada', 'success');
                }
            }
        });
    },

    'getPicture': function () {
        jQuery('#take-picture').click();
    },
    
    'startLoading': function () {
        
    },

    'stopLoading': function () {

    },

    'verifyCompatibility': function () {
        if(!navigator.geolocation) {
            swal('Navegador incompativel', 'Seu navegador não permite localização', 'error');
        }
    },

    'getPositionSuccess': function (position) {
        syp.currentPosition = {
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude
        };
        console.log(position);
        jQuery('#location-status span').attr('class', 'glyphicon glyphicon-pushpin');
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
            url: "/mok-server/fotos.php",
            data: {'latitude': 1, 'longitude': 2},
            dataType: "JSON",
            success: function (data) {
                jQuery.each(data.fotos, function(index, value) {
                    jQuery('#list-fotos').append('<img src="' + value.url + '" />');
                });
            }
        });
    }

}

window.onload = function() {
    syp.init();
}