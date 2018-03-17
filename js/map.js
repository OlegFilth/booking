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
      y: getRandomNumber(100, 500)
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

var createCard = () => {
  var cards = [];
  var cardClone = card.cloneNode(true);
  cardClone.querySelector('h3').textContent = ads[0].offer.title;
  cardClone.querySelector('.popup__price').innerHTML = ads[0].offer.price + ' &#x20bd;/ночь';

  switch(ads[0].offer.type) {
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
  cardClone.children[6].textContent = ads[0].offer.rooms + ' комнаты для ' + ads[0].offer.guests + ' гостей';
  cardClone.children[7].textContent = 'Заезд после ' + ads[0].offer.checkin + ', выезд до ' + ads[0].offer.checkout;

  cardClone.querySelector('.popup__features').innerHTML = '';
  for (var i = 0; i < ads[0].offer.features.length; i++) {
    cardClone.querySelector('.popup__features').insertAdjacentHTML('beforeend','<li class="feature feature--' + ads[0].offer.features[i] + '"></li>');
  }
  
  cardClone.children[9].textContent = ads[0].offer.description;

  cardClone.querySelector('.popup__avatar').setAttribute('src', ads[0].author.avatar);

  cards.push(cardClone);
  return cards;
}

renderElements(document.querySelector('.map__pins'), createPins());
renderElements(document.querySelector('.map'), createCard());

