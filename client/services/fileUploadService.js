contactAPP.service('fileUploadService', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, firstName, lastName, phoneNumber, email, uploadUrl){
        var myFormData = new FormData();

        myFormData.append('file', file);
        myFormData.append('firstName', firstName);
        myFormData.append('lastName', lastName);
        myFormData.append('phoneNumber', phoneNumber);
        myFormData.append('email', email);


        $http.post(uploadUrl, myFormData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(){

            })
            .error(function(){
            });
    }
}]);
