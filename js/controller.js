var app = angular.module('grafica', []);

app.controller('productividad', function($scope, $http){
    var respuesta = $http.get('https://demo.medinet.cl/api/dashboard/productividad/?format=json');
    respuesta.then(function (response) {
        var anios = [],
            sucursales = [];

        $scope.data = response.data;
        $scope.anios = anios;

        var total = {};

        _.forEach($scope.data, function(productividad) {
            var prevision = _.get(productividad, 'prevision', '').toUpperCase(),
                anio      = _.get(productividad, 'anio', ''),
                sucursal  = _.get(productividad, 'sucursal', ''),
                cantidad  = parseInt(_.get(productividad, 'cantidad', 0));

            anios.push({
                name:  anio,
                value: anio
            });

            sucursales.push({
                name:  sucursal,
                value: sucursal
            });

            if (!_.has(total, prevision)) {
                total[prevision] = 0;
            }
            total[prevision] += cantidad;
        });
        
        $scope.detallePrevision = [];
        _.forEach(total, function(cantidad, prevision) {
            $scope.detallePrevision.push({
                name:  prevision,
                value: cantidad
            });
        });
        
        anios = _.uniqBy(anios, function (anio) {
            return anio.value;
          });

        anios = _.filter(anios, function(anio) {
            return anio !== '';
        });

        anios = _.sortBy(anios, [function(anio) { return anio.value; }]);

        $scope.anios = anios;
    });

    $scope.detalle = function(e){
        var sucursal = $scope.sucursal,
            anio = $scope.anio,
            cantidad = 0,
            prevision = '',
            total = {
                'FONASA': 0,
                'ISAPRE': 0,
            };

        var productividad = _.find($scope.data, function(productividad) { 
            return productividad.sucursal == sucursal && productividad.anio == anio; 
        });
        
        $scope.detallePrevision = [];
        
        if (productividad) {
            total[productividad.prevision.toUpperCase()] =  productividad.cantidad;
        }

        _.forEach(total, function(cantidad, prevision) {
            $scope.detallePrevision.push({
                name:  prevision,
                value: cantidad
            });
        });
        //$scope.detallePrevision = prevision.toUpperCase() + ' ' + cantidad;
    }
});