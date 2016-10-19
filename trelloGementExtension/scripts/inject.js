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
