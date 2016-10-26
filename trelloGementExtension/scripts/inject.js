var buttonLocalisation = $(".resume__infos .resume__action");
var button = $("<button>", {
  type: "button",
  id:"button_trello",
  onclick:"createCard()",
  text:"Ajouter à Trellogement",
  alt:"Ajouter à Trellogement",
});

buttonLocalisation.append(button);

function createCard() {
    /*
     * A message containing the action is posted on the page itself on click
     * and captured by the extension to process datas.
    */
    window.postMessage("createCard", "*");
}
