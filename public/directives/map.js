contactAPP.directive('helloMaps', function () {
      return function (scope, elem, attrs) {
        
		var map, infoWindow;
        var markers = [];
        
        // map config
        var mapOptions = {
            center: new google.maps.LatLng(10, 80),
            zoom: 15,
			center:new google.maps.LatLng(12.896825, 77.582139),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: true,
            draggable: true,
            panControl: true,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: false,
            overviewMapControl: true,
            rotateControl: true,
			};
        
        // init the map
        function initMap() {
            if (map === void 0) {
				var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
				google.maps.event.addDomListener(window, 'load', setMarker(map, new google.maps.LatLng(12.896825, 77.582139)));
			}
        }    
        
        // place a marker
        function setMarker(map, position) {
            var marker;
			console.log(position);
            var markerOptions = {
                position: position,
                map: map,
                icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
			
            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: 'Bangalore'
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }
        
        // show the map and place some markers
        initMap();
      };
    });