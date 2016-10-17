/**
 * Created by J on 16/10/2016.
 * Author Joao Maciel <j.maciel.hd@gmail.com>
 */
var syp = {

    'currentPosition': null,

    'init': function () {
        syp.verifyCompatibility();
        syp.getPosition();

        jQuery('#btn-camera').click(function (e) {
            syp.getPicture();
        });

        jQuery('#take-picture').change(function (e) {
            syp.showConfirmPicture(e.target.files);
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
        jQuery('#location-status span').attr('class', 'glyphicon glyphicon-pushpin');
    },

    'getPositionError': function () {
        console.log('erro');
        jQuery('#location-status span').attr('class', 'glyphicon glyphicon-alert');
        syp.currentPosition = null;
    },

    'getPosition': function () {
        navigator.geolocation.getCurrentPosition(syp.getPositionSuccess, syp.getPositionError);
    }

}

window.onload = function() {
    syp.init();
}