'use strict';

var offers = [
  "Большая уютная квартира",
  "Маленькая неуютная квартира", 
  "Огромный прекрасный дворец", 
  "Маленький ужасный дворец", 
  "Красивый гостевой домик", 
  "Некрасивый негостеприимный домик", 
  "Уютное бунгало далеко от моря", 
  "Неуютное бунгало по колено в воде"
];
var types = ['flat', 'house', 'bungalo'];
var features = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner" ]
var ads = [];
var map = document.querySelector('.map');
var pin = document.querySelector('template').content.querySelector('.map__pin');
var card = document.querySelector('template').content.querySelector('.map__card');
var form = document.querySelector('.notice__form');

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var showMap = () => {
  map.classList.remove('map--faded');
}

var showForm = () => {
  form.classList.remove('notice__form--disabled');
}

var removePopup = () => {
  if (document.querySelectorAll('.popup').length > 0) {
    document.querySelector('.popup').remove();
  }
}

var deactivatePin = () => {
  document.querySelectorAll('.map__pin').forEach((element) => {element.classList.remove('map__pin--active')});
}

var getRandomNumber = (min, max) => {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

var getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

var getRandomArray = (array) => {
  var count = getRandomNumber(1, array.length);
  var randomArr = [];
  
  for ( var i = 0; i < count; i++ ) {
    var randomEl = getRandomElement(array);
    if (randomArr.indexOf(randomEl) === -1) {
      randomArr.push(randomEl);
    } else {
      i--;
    }
  }
  return randomArr;
}

var renderElements = (parentElement, elements) =>  {
  var fragment = document.createDocumentFragment();
  elements.forEach((element) => fragment.appendChild(element));
  parentElement.appendChild(fragment);
}


for (var i = 1 ; i <= 8; i ++) {
  ads.push({
    author: {
      avatar: 'img/avatars/user0' + i + '.png',
    },
    offer: {
      title: offers[i],
      address: location.x,
      price: getRandomNumber(1000, 1000000),
      type: getRandomElement(types),
      rooms: getRandomNumber(1, 5),
      guests:  getRandomNumber(1, 10),
      checkin: '13:00',
      checkout: '14:00',
      features: getRandomArray(features),
      description: '',
      photos: []
    },
    location: {
      x: getRandomNumber(300, 900),
      y: getRandomNumber(180, 500)
    }
  });
}

var createPins = () => {
  var pins = []
  for( var i = 0; i < ads.length; i++) {
    var pinClone = pin.cloneNode(true);
    pinClone.classList.remove('map__pin--main')
    pinClone.style.left = (ads[i].location.x - 30) + 'px';
    pinClone.style.top = (ads[i].location.y - 60) + 'px';

    pinClone.querySelector('img').setAttribute('src', ads[i].author.avatar);
    pins.push(pinClone)
  }
  
  return pins;
}

var createCard = (index) => {
  var cards = [];
  var cardClone = card.cloneNode(true);
  cardClone.querySelector('h3').textContent = ads[index].offer.title;
  cardClone.querySelector('.popup__price').innerHTML = ads[index].offer.price + ' &#x20bd;/ночь';

  switch(ads[index].offer.type) {
    case 'bungalo':
    cardClone.querySelector('h4').textContent = 'Бунгало';
    break;

    case 'flat':
    cardClone.querySelector('h4').textContent = 'Квартира';
    break;

    case 'house':
    cardClone.querySelector('h4').textContent = 'Дом';
    break;
  }
  cardClone.children[6].textContent = ads[index].offer.rooms + ' комнаты для ' + ads[index].offer.guests + ' гостей';
  cardClone.children[7].textContent = 'Заезд после ' + ads[index].offer.checkin + ', выезд до ' + ads[index].offer.checkout;

  cardClone.querySelector('.popup__features').innerHTML = '';
  for (var i = 0; i < ads[index].offer.features.length; i++) {
    cardClone.querySelector('.popup__features').insertAdjacentHTML('beforeend','<li class="feature feature--' + ads[index].offer.features[i] + '"></li>');
  }
  
  cardClone.children[9].textContent = ads[index].offer.description;

  cardClone.querySelector('.popup__avatar').setAttribute('src', ads[index].author.avatar);

  cards.push(cardClone);
  return cards;
}

var onMapClick = () => {
  showMap();
  showForm();
  renderElements(document.querySelector('.map__pins'), createPins());
  map.removeEventListener('mouseup', onMapClick);
}

map.addEventListener('mouseup', onMapClick);

map.addEventListener('click', (event) => {
  document.querySelectorAll('.map__pin').forEach((element, index) => {
    element.addEventListener('click', () => {
      removePopup();
      deactivatePin();
      element.classList.add('map__pin--active');
      renderElements(document.querySelector('.map'), createCard(index - 1));
      document.querySelector('.popup__close').addEventListener('click', () => {
        removePopup();
        deactivatePin(); 
      });
      document.body.addEventListener('keydown', (event) => {
        if (event.keyCode === 27) {
          removePopup();
          deactivatePin();       
        }
      });
    });
  });
});

