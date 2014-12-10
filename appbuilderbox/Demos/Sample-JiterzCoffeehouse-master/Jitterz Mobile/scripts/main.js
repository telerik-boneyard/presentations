document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    navigator.splashscreen.hide();
}

(function($, doc) {
	var _app,
    	_mapElem,
    	_mapObj,
    	_storeListElem,
    	_private,
    	_appData = new AppData(),
    	_isOnline = true;
    
	//Private methods
	_private = {
		getLocation: function(options) {
			var dfd = new $.Deferred();

			//Default value for options
			if (options === undefined) {
				options = {enableHighAccuracy: true};
			}

			navigator.geolocation.getCurrentPosition(
				function(position) { 
					dfd.resolve(position);
				}, 
				function(error) {
					dfd.reject(error);
				}, 
				options);

			return dfd.promise();
		},
		
		initMap: function(position) {
			//Delcare function variables
			var myOptions,
    			mapObj = _mapObj,
    			mapElem = _mapElem,
    			pin,
    			locations = [],
                latlng;

			_mapElem = mapElem; //Cache DOM element
                
			// Use Google API to get the location data for the current coordinates
			latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				
			myOptions = {
				zoom: 11,
				center: latlng,
				mapTypeControl: false,
				navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			    
			mapObj = new google.maps.Map(mapElem, myOptions);
			_mapObj = mapObj; //Cache at app level
			    
			pin = [
				{
					position: latlng,
					title: "Your Location"
				}
			];

			_private.addMarkers(pin, mapObj);
			
			// Get stores nearby
			_appData.getStarbucksLocations(position.coords.latitude, position.coords.longitude)
			.done(function(result) {
				var len = result.length,
				    pinImage = new google.maps.MarkerImage(
                                    "images/cofeeCup-sprite.png",
                                    new google.maps.Size(49, 49),
                                    new google.maps.Point(0, 202));

                
				for (var i = 0; i < len; i++) {
					locations.push({
						title: result[i].title + ", " + result[i].description,
						position: new google.maps.LatLng(result[i].latitude, result[i].longitude),
                        icon: pinImage,
						animation: google.maps.Animation.DROP
					});
				}
                
                 _private.addMarkers(locations, mapObj);
			})
			.fail(function(e, r, t) {
                alert("Error loading locations.");
			});
		},
        
		addMarkers: function(locations, mapObj) {
			var marker,
			    currentMarkerIndex = 0;
            
            
            function createMarker(index) {
                if (index < locations.length) {
					var tmpLocation = locations[index];

					marker = new google.maps.Marker({
						position:tmpLocation.position,
						map:mapObj,
						title:tmpLocation.title,
						icon: tmpLocation.icon,
						shadow: tmpLocation.shadow,
						animation: tmpLocation.animation
					});
					oneMarkerAtTime();
				}
			}
            
			function oneMarkerAtTime() {
				google.maps.event.addListener(marker, "animation_changed", function() {
                    if (marker.getAnimation() === null) {
                        createMarker(currentMarkerIndex+=1);
					}
				});
			}				
            
            createMarker(0);
		},
        
		initStoreList: function(position) {
			_appData.getStarbucksLocations(position.coords.latitude, position.coords.longitude)
        			.done(function(data) {
						storesListViewModel.load(data);
        			})
        			.fail(function(e, r, t) {
                        alert("Loading error");    
                    });
		},
        
		toggleStoreView: function(index) {
			var isMap = (index === 0);
            
			if (isMap) {
				$(_storeListElem).hide();
				$(_mapElem).show();
			} else {
				$(_storeListElem).show();
				$(_mapElem).hide();
			}
		}
	};
    
	_app = {
		init: function() {
			announcementViewModel.load(_appData.getAnnouncements());
            
            if (window.localStorage.getItem("cards") === null) {
				localStorage.setItem("cards", _appData.getInitialCards());
			}
            
            cardsViewModel.loadFromLocalStorage();
		},
        
		onAddCardViewShow: function () {
            addCardViewModel.resetView();
		},
        
		rewardCardShow: function(e) {
			var bonusPoints = e.view.params.bonusPoints,
			    cardNumber = e.view.params.cardNumber;
            
			rewardsViewModel.setValues(cardNumber, bonusPoints);
            
		},
        
		rewardCardInit: function(e) {
			var container = e.view.content,
    			$cardFront = container.find("#rewardCardFront"),
    			$cardBack = container.find("#rewardCardBack");
            
			singleCardViewModel.appendCardFadeEffect($cardFront, $cardBack);
		},
        
		singleCardShow: function (args) {
			var cardNumber = args.view.params.cardNumber,
    			bonusPoints = args.view.params.bonusPoints,
    			cardAmount = args.view.params.cardAmount;
            
			singleCardViewModel.setValues(cardNumber, bonusPoints, cardAmount);
		},
        
		singleCardInit: function(e) {
			var container = e.view.content,
    			$cardFront = container.find("#cardFront"),
    			$cardBack = container.find("#cardBack");
            
			singleCardViewModel.appendCardFadeEffect($cardFront, $cardBack);
		},
        
		storesInit: function() {
			_mapElem = document.getElementById("map");
			_storeListElem = document.getElementById("storeList");

			$("#btnStoreViewToggle").data("kendoMobileButtonGroup")
			.bind("select", function(e) {
				_private.toggleStoreView(e.sender.selectedIndex);
			});
		},
        
		storesShow: function() {
			//Don't attempt to reload map/sb data if offline
			//console.log("ONLINE", _isOnline);
			if (_isOnline === false) {				
				alert("Please reconnect to the Internet to load locations.");
    
				return;
			}
    
			_private.getLocation() 
			.done(function(position) { 
				_private.initStoreList(position);
				_private.initMap(position); 
			})
			.fail(function(error) { 
				alert(error.message); /*TODO: Better handling*/ 
			});
            
			if (_isOnline === true) {
				$("#storesContent").show();
				$("#offline").hide();
                google.maps.event.trigger(map, "resize");
			}
			else {
				$("#storesContent").hide();
				$("#offline").show();
			}
		}
	};
    
	_app.init();
        
	$.extend(window, {
		cardsViewModel: _app.cardsViewModel,
		rewardCardShow: _app.rewardCardShow,
		rewardCardInit: _app.rewardCardInit,
		singleCardShow: _app.singleCardShow,
		singleCardInit: _app.singleCardInit,
		onAddCardViewShow: _app.onAddCardViewShow,
		announcementData: _app.announcementData,
		onStoresShow: _app.storesShow,
		storesInit: _app.storesInit
	});
}(jQuery, document));