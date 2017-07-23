contactAPP.controller('home2Ctrl',['$scope', '$http', 'Validator','Upload','$window', function($scope, $http, Validator, Upload, $window){
	
	console.log("IN Home2 CTRL!!!");
	
	
	var contactlist;
	$scope.editImage = false;
	$scope.editdetails = false;
	$scope.contact = {};
	
	//function call to the validator service with the respective Parameters.
	  $scope.nameValidator = function(name) {
		   return Validator.nameValidator(name);
	  };
		
	  $scope.emailValidator = function(email) {
	       return Validator.emailValidator(email);
	  };
		
	  $scope.phoneValidator = function(phoneNo) {
		   return Validator.phoneValidator(phoneNo);
	  };
	
	//Submit the form data if ID is not passed in the Add contact case the the first condition becomes true and the API is called without an ID as the ID is created only after a contact is created .
	
	//Submit the form data with the ID when we need to update a contact details.
	$scope.submit = function(id) {
		console.log("submitId: ",id);
		if(typeof id === "undefined"){
			$scope.upload($scope.file);
		} else {
			$scope.upload($scope.file, id);
		}        
    };
	
		// function that combines the form data along with the image data and then makes an API call to upload the data into the server.
		
	 $scope.upload = function (file, id) {
		 var url = '/contactlist';
		 console.log("ID: ",id);
		 
		 //check the data type of the ID.
		 if(typeof id !== "undefined" && id != ""){ 
			 url = "contactlistUpdate/"+id; //concatenating the ID if present.
		 }
        Upload.upload({
            url: url,
            data: {file: file, 'userData': $scope.contact}
         }).success(function (resp) {
            console.log('Success ',resp);
			$scope.contactForm.reset();
			$scope.editImage = false;
			$scope.contact = {};
			refresh();
			console.log('contact_info',$scope.contact);
        });
    };
	
	//fuction to get the contacts immediately once a new contact is added or updated.
	var refresh = function(){
	$http.get('/contactlist').success(function(response){
		console.log("sssssss");
		$scope.contactList = response;
		$scope.contact = "";
	});	
	};
	
	refresh();
	
	
	$scope.addContact = function(){
		
		console.log($scope.contact);
		
		$http.post('/contactlist',$scope.contact).success(function(response){
			console.log(response);
			refresh();
		});
		};
	

	//Function which takes the contact ID and deletes the required contact Only.
	$scope.removeContact = function(id){
			console.log(id);
			$http.delete('/contactlist/' + id).success(function(response){
				console.log(response);
				refresh();
								
			});
	};
	
	//Function which takes the contact ID and deletes the required contact Only.
	$scope.updateContact = function(id){
			console.log($scope.contact._id);
			$http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response){
				refresh();
								
			})
	};
		
		
	$scope.addImage = function(){
		$scope.editImage = false;
	};
	
	//function to reload the application when required.
	$scope.reload = function(){
		$window.location.reload();;
	}
	
	//function to edit the contact details,for this first the ID is collected and an API call is made to retreive the Prticular contacts Information and then populate the information into the form do edit the information required.
	
	$scope.editContact = function(id){
			$scope.editdetails = true;
			console.log('id',id);
			$http.get('/contactlist/' + id).success(function(response){
				console.log('editAPI',response);
				$scope.contact = response;
				console.log('No Image',$scope.contact.filePath);
			if($scope.contact.filrPath !== "No Image"){
				$scope.editImage = true;
			}else{
				$scope.editImage = false;
			}
				
			});
	};
	
}]);