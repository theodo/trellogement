function scrap() {
  // scrap datas from the current url and return an dictionnary
    var infos = {
      img: $('img.carrousel_image_visu').attr('src'),
      price: $('span.resume__prix').text().trim(),
      title: $('h1.detail-title').text().replace(/\r?\n|\r/g,'').replace(/ +(?= )/g,'').trim(),
      description: $('p.description').html(),
      link: window.location.href,
    };

    return infos;
}

// Prepare Trello client
chrome.storage.local.get('trellogement_trello_key', function (key) {
  Trello.setKey(key.trellogement_trello_key);
});

chrome.storage.local.get('trellogement_trello_token', function (token) {
  var token = token.trellogement_trello_token;
  Trello.setToken(token);
});

chrome.storage.local.get('trellogement_trello_board_id', function (boardId) {
  var boardId = boardId.trellogement_trello_board_id;
  init(boardId);
  compare(boardId);
});

//Creating Trello buttons and button localisation

var buttonLocalisation = $(".resume__infos .resume__action");

var buttonAdded = $("<button>", {
  type: "button",
  id:"button_trello",
  text:"Déjà ajouté !",
  alt:"Déjà ajouté !",
});

var buttonToAdd = $("<button>", {
  type: "button",
  id:"button_trello",
  onclick:"scrap()",
  text:"Ajouter à Trellogement",
  alt:"Ajouter à Trellogement",
});

// Init function
function init(boardId) {
  Trello.get(`/boards/${boardId}/cards`, function(cards) {
    for (card of cards) {
      console.log(card.name, ' : ', card.desc);
    }
  });
}

//Compare function
function compare(boardId){
  var currentPage = scrap();
  console.log(currentPage);
  var checkIfCardPresent = false;
  var idCard = null;
  Trello.get(`/boards/${boardId}/cards`, function(cards) {
    for (card of cards) {

      //We look for a card with the same title and if we found it
      //We compare the descriptions
      if (card.name == currentPage['title']) {
        checkIfCardPresent = true;
        var idCard = card.id;
        Trello.get('/cards/'+idCard+'/actions', {filter : "commentCard"}, function(comments) {

          //We compare the descriptions and add the button matching the status
          if (comments[0].data.text == currentPage['description']) { //the ad has already been added
            buttonLocalisation.append(buttonAdded);
          } else { //if the ad hasn't been added
            buttonLocalisation.append(buttonToAdd);
          }

        });

        }
      }

      //If no title matches, we add the initial button anyway
      if (!checkIfCardPresent) {
        buttonLocalisation.append(buttonToAdd);
      }


    });
}
