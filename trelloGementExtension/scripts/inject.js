var buttonLocalisation = $(".resume__infos .resume__action");
var button = $("<button>", {
  type: "button",
  id:"button_trello",
  onclick:"scrap()",
  text:"Ajouter à Trellogement",
  alt:"Ajouter à Trellogement",
});

buttonLocalisation.append(button);
