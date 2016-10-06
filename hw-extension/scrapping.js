function scrap() {
  // scrap datas from the current url
  chrome.tabs.getSelected(null,function(tab) {
    var url = tab.url;

    $.get(url, function (data) {
      $page = $(data);
      var $img = $('img.carrousel_image_visu', $page).attr('src');

      console.log($img);

      $('#results').append('<img src="' + $img + '">');
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('button').addEventListener('click', scrap);
});
