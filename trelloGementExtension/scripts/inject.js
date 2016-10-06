var buttonLocalisation = $(".resume__infos .resume__action");
var button = $("<button>", {
  type: "button",
  id:"button_trello",
  onclick:"scrap()",
  text:"Ajouter à Trellogement",
  alt:"Ajouter à Trellogement",
})

buttonLocalisation.append(button);

var s = document.createElement('script');
s.src = chrome.extension.getURL('scripts/scrapping.js');
(document.head).appendChild(s);
