var app = angular.module("modulo", []);

app.controller("controlador", ["$scope", "$http", "$q", "$filter",  function ($scope, $http, $q, $filter) {
angular.element(document).ready(function () {
    obtenerClientes();
})  

    function obtenerClientes(){
       realizarPeticion("GET", "http://forteinnovation.mx:8591/api/clientes", "").then(function (respuesta){
            $scope.Clientes = respuesta.data;
       })
    }

    function realizarPeticion(metodo, url, data){
        var diferido = $q.defer();
        $http({
            method: metodo,
            url: url,
            data: data
        }).then(function mySuccess (respuesta){
            diferido.resolve(respuesta.data);
        }, function myError(respuesta){
            diferdo.reject(respuesta);
        });
        return diferido.promise;
    }

    $scope.editarCliente = function (cliente){
        var modal = document.getElementById("cliente");
        modal.style.display = "block";
        $scope.clienteEditado = cliente;
        $scope.guardar = actualizarCliente;
    }

    $scope.agregarCliente = function (){
        var modal = document.getElementById("cliente");
        modal.style.display = "block";
        $scope.clienteEditado = undefined;
        $scope.guardar = guardarCliente;
    }

    $scope.cerrarModal = function (id){
        var modal = document.getElementById(id);
        modal.style.display = "none";
        $scope.clienteEditado = undefined;
        $scope.clienteAEliminar = undefined;
    }

    $scope.eliminarCliente = function (cliente){
        var modal = document.getElementById("confirmacion");
        modal.style.display = "block";
        $scope.clienteAEliminar = cliente;
        $scope.confirmarEliminacion = borrarCliente;
    }

    function borrarCliente (idCliente){
        var data = "";
        realizarPeticion("DELETE", "http://forteinnovation.mx:8591/api/cliente/" +idCliente, data).then(function (respuesta){
                alert(respuesta.message);
                if(respuesta.code == 200){//error  
                    obtenerClientes();
                    $scope.cerrarModal("confirmacion");
                }
            })
    }

    function actualizarCliente(){
        if(validaciones()){
            $scope.clienteEditado.estatusClienteId = parseInt($scope.clienteEditado.estatusClienteId);
            //var clienteEnLista = $filter('filter')($scope.Clientes, {clienteId: $scope.clienteEditado.clienteId})
            var data = JSON.stringify($scope.clienteEditado);
            realizarPeticion("PUT", "http://forteinnovation.mx:8591/api/cliente/" +$scope.clienteEditado.clienteId, data).then(function (respuesta){
                alert(respuesta.message);
                if(respuesta.code == 200){//error  
                    obtenerClientes();
                    $scope.cerrarModal("cliente");
                }
            })
        }
        else{
            alert("No se han llenado todos los campos. " + $scope.mensajeValidacion);
        }
    }

    function validaciones(){
        $scope.mensajeValidacion = "";
        var validacion = true;
        if($scope.clienteEditado.rfc == undefined || $scope.clienteEditado.rfc.trim() == "" ){
            $scope.mensajeValidacion += "Falta el RFC. ";
            validacion = false;
        }
        if($scope.clienteEditado.fechaNacimiento == undefined){
            $scope.mensajeValidacion += "Falta la Fecha de Nacimiento. ";
            validacion = false;
        }
        if($scope.clienteEditado.telefonoMovil == undefined || $scope.clienteEditado.telefonoMovil.trim() == "" ){
            $scope.mensajeValidacion += "Falta el número de télefono. ";
            validacion = false;
        }
        if($scope.clienteEditado.domicilio == undefined || $scope.clienteEditado.domicilio.trim() == "" ){
            $scope.mensajeValidacion += "Falta el domicilio. ";
            validacion = false;
        }
        if($scope.clienteEditado.estatusClienteId == undefined){
            $scope.mensajeValidacion += "Falta seleccionar el estatus del cliente. ";
            validacion = false;
        }
        return validacion;
    }

    function guardarCliente (){
        var clienteDuplicado = $filter('filter')($scope.Clientes, {correoElectronico: $scope.clienteEditado.correoElectronico}, true);
        if(clienteDuplicado.length > 0){
            alert("Ya existe un cliente con ese correo electrónico");            
        }
        else{
        $scope.clienteEditado.estatusClienteId = parseInt($scope.clienteEditado.estatusClienteId);
        var data = JSON.stringify($scope.clienteEditado);
        realizarPeticion("POST", "http://forteinnovation.mx:8591/api/cliente", data).then(function (respuesta){
            alert(respuesta.message);
            if(respuesta.code == 200){//error  
                obtenerClientes();
                $scope.cerrarModal("cliente");
            }
        })
    }
    }
    
}]);