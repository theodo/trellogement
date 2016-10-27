function createCard() {
    $('#button_trello').prop("disabled",true);
    /*
     * A message containing the action is posted on the page itself on click
     * and captured by the extension to process datas.
    */
    window.postMessage('createCard', '*');
}
