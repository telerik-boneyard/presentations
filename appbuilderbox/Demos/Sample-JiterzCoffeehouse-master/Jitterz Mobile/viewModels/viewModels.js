(function($, console, doc) {
	var announcementViewModel,
    	cardsViewModel,
        storesListViewModel,
    	AddCardViewModel,
    	CardsViewModelBase,
    	SingleCardViewModel,
    	RewardsViewModel;
        
	AddCardViewModel = kendo.data.ObservableObject.extend({
		cardNumber: null,
         
		init: function() {
			kendo.data.ObservableObject.fn.init.apply(this, [this]);
			var that = this;
			that.set("cardNumber", null);
		},
        
        resetView: function() {
            var that = this;
            
            that._reset(); 
            
            $("#cardNumberField").keyup(function(e) {
                if(that._checkIsValid(e.target.value)) {
                    $("#buttonAddNewCardView").removeClass("isCardValid");
                } else {
                    $("#buttonAddNewCardView").addClass("isCardValid");
                }
            });
        },

		addNewCard: function() {
			var that = this,
    			cardNumberValue = $('#cardNumberField').val(),
    			newCard = that._generateRandomCard(cardNumberValue),
                positionAdded = cardsViewModel.cards.push(newCard) - 1;
			
			cardsViewModel.cardNumbers()[cardNumberValue] = positionAdded;
                
			app.navigate("views/cardsView.html");	
		},

		cardIdChanged: function(e) {

			var that = this, 
    			cardForAddId = e.currentTarget.value,
    			isValidCardNumber = that._checkIsValid(cardForAddId);
                
			that.set("canAddCard", isValidCardNumber);
		},

		_generateRandomCard: function(cardNumberValue) {
			    var currentAmount = Math.floor((Math.random() * 100) + 10),
        			bonusPoints = Math.floor(Math.random() * 100),
        			currentDate = new Date(),    
                    expireDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 2)),
                    cardToAdd;

			cardToAdd = {
				cardNumber : cardNumberValue,
				amount: currentAmount,
				bonusPoints: bonusPoints,
				expireDate: kendo.toString(expireDate, "yyyy/MM/dd")
			};
                
			return cardToAdd;
		},

		_checkIsValid: function(typedCardId) {
			var that = this;
                
			return that._validateCardNumber(typedCardId) && !that._isDublicateNumber(typedCardId);
		},

		_validateCardNumber: function(cardNumberValue) {
			var validateNumberRegex = /^[0-9]{9}$/,
			    isValidCardNumber = validateNumberRegex.test(cardNumberValue);
                
			return isValidCardNumber;
		},

		_isDublicateNumber: function (cardNumberValue) {
			var isDublicate = cardsViewModel.cardNumbers().hasOwnProperty(cardNumberValue);
			
            return isDublicate;
		},
        
        _reset: function() {
            var $cardNumberFild = $('#cardNumberField'),
            $buttonAddNewCard = $('#buttonAddNewCardView');
            
            $cardNumberFild.focus();
            $cardNumberFild.val("");
            $($buttonAddNewCard).addClass("isCardValid");
        }
	});

	CardsViewModelBase = kendo.data.ObservableObject.extend({
		init: function() {
			var that = this;
			
            kendo.data.ObservableObject.fn.init.apply(that, [that]);
		},
        
		_generateBarcodeUrl: function(cardId) {
			var size = "130",
    			urlSizeParameter = "chs=" + size + "x" + size,
    			urlQrParameter = "cht=qr",
    			urlDataParameter = "chl=" + cardId,
    			urlBase = "https://chart.googleapis.com/chart?",
    			imageRequestString = urlBase + urlSizeParameter + "&" + urlQrParameter + "&" + urlDataParameter; 
                
			return imageRequestString;
		},
        
		appendCardFadeEffect: function ($cardFront, $cardBack) {
           var cardFrontButton = $cardFront.kendoMobileButton(),
           	cardBackButton = $cardBack.kendoMobileButton();
                
			cardBackButton.bind('click', 
                function(e) {
			    	$(e.currentTarget).fadeOut(500, "linear", function() {
			    		$cardFront.fadeIn(500, "linear");
			    	});
			    });
            
           cardFrontButton.bind('click',
               function(e) {
			    	$(e.currentTarget).fadeOut(500, "linear", function() {
			    		$cardBack.fadeIn(500, "linear");
			    	});
               });
        }
		
	});

	SingleCardViewModel = CardsViewModelBase.extend({
		barcodeUrl : "",
		cardId : "",
		cardAmount : "",
		currentDate : "",
		cardStatus: "",
        
		setValues: function(cardNumber, bonusPoints, cardAmount) {
			var that = this;
			
			if (bonusPoints < 50) {
				that.set("cardStatus", "silver");
			}
			else {
				that.set("cardStatus", "gold");
			}
            
			that.set("cardId", cardNumber);
			that.set("barcodeUrl", that._generateBarcodeUrl(cardNumber));
			that.set("cardId", "#" + cardNumber);
			that.set("cardAmount", kendo.toString(parseFloat(cardAmount), "c"));
			that.set("barcodeURL", bonusPoints);
			that.set("currentDate", kendo.toString(new Date(), "yyyy/MM/dd hh:mm tt"));
		},
        
		deleteCard: function() {
			var that = this, 
    			cardIdString = that.cardId,
    			cardIdLength = that.cardId.length,
    			realCardId = cardIdString.substring(1, cardIdLength);

			that._processDeleteCard(realCardId);
            
			app.navigate('views/cardsView.html');
		},
        
		_processDeleteCard: function(cardId) {
			var allCardsArray = cardsViewModel.cards;
    
			for (var i = -1, len = allCardsArray.length; ++i < len;) {
				if (allCardsArray[i].cardNumber === cardId) {
					allCardsArray.splice(i, 1);
					delete cardsViewModel.cardNumbers()[cardId];
					break;
				}
			} 
		}
	});

	RewardsViewModel = CardsViewModelBase.extend({
		_rewardsForCard : {
			gold : [
				{reward: "Free coffee every day"},
				{reward: "Free refill"},
				{reward: "Free cookies with every drink"}
			],
			silver : [
				{reward: "Free refill"},
				{reward: "Free cookies with every drink"}	
			]
		},
		cardStatus: "",
		rewards: [],
		bonusPoints: "",
		barcodeURL: "",
		currentDate: "",
		cardNumber: "",
    
		setValues: function(cardNumber, bonusPoints) {
			var that = this;			
		
			if (bonusPoints < 50) {
				that.set("cardStatus", "silver");
				that.set("rewards", that._rewardsForCard["silver"]);
			}
			else {
				that.set("cardStatus", "gold");
				that.set("rewards", that._rewardsForCard["gold"]);
			}
            
			var barcode = that._generateBarcodeUrl(cardNumber);
            
			that.set("cardNumber", "#" + cardNumber);
			that.set("bonusPoints", "Bonus:" + bonusPoints);
			that.set("barcodeURL", barcode);
			that.set("currentDate", kendo.toString(new Date(), "yyyy/MM/dd hh:mm tt"))
		}
	});
    
	announcementViewModel = kendo.observable({
		announcements: [],
        
		load: function(announcements) {
			var that = this;
			that.set("announcements", announcements);
		}
	});

	cardsViewModel = kendo.observable({
		cards : [],
		_cardNumbers: {},
        
		loadFromLocalStorage: function() {
			var that = this;
			var i;
			var cards = [];

			if (window.localStorage.getItem("cards") !== null) {
				cards = JSON.parse(window.localStorage.getItem("cards"));
			}

			for (i = 0; i < cards.length; i+=1) {
				this._cardNumbers[cards[i].cardNumber] = i;
			}
        
			that.set("cards", cards);
			that.cards.bind("change", that.writeIntoLocalStorage);
		},

		cardNumbers: function(value) {
			if (value) {
				this._cardNumbers = value;
			}
			else {
				return this._cardNumbers;
			}
		},
        
		writeIntoLocalStorage: function(e) {
			var dataToWrite = JSON.stringify(cardsViewModel.cards);
			window.localStorage.setItem("cards", dataToWrite);
		},
        
		addCards: function() {
            
		}
	});
	
    storesListViewModel = kendo.observable({ 
        stores : [], 
        load: function(data) { 
            var that = this;
            that.set("stores", data); 
        } 
    });
    
	$.extend(window, {
		singleCardViewModel: new SingleCardViewModel(),
		rewardsViewModel: new RewardsViewModel(),
		addCardViewModel: new AddCardViewModel(),
		announcementViewModel: announcementViewModel,
		cardsViewModel: cardsViewModel,
        storesListViewModel: storesListViewModel
	});
    
})(jQuery, console, document);