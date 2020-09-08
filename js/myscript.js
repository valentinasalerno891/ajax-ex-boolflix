$(document).ready(function(){

    $('.button').click(function(){
        start();
    });

    $('.ricerca input').keydown(function(){
        if (event.which == 13 || event.keyCode == 13) {
            start();
        }
    })

});




//******FUNZIONI*******

function start(){
    var ricerca = $('.ricerca input').val();
    reset();
    var url1 = 'https://api.themoviedb.org/3/search/movie';
    var url2 = 'https://api.themoviedb.org/3/search/tv';
    search(ricerca, url1, 'film');
    search(ricerca, url2, 'serie tv');
}

function reset(dati) {
    $('#ricerca-qui').val('');
    $('.film').empty();
    $('.serie-tv').empty();
}

function search(data, url, type) {

    $.ajax(
        {
            url: url,
            method: 'GET',
            data: {
                api_key: '0f860012106ea3b4f9e200aaaf3e1386',
                language: 'it-IT',
                query: data
            },
            success: function(risposta) {
                if (risposta.total_results > 0) {
                    getResults(risposta.results, type);
                } else {
                    noResults(type);
                }
            },
            error: function() {
                alert('errore');
            }
        }
    );
}

function getResults(data, type) {
    var source = $("#film-ricercati").html();
    var template = Handlebars.compile(source);

    for (var i = 0; i < data.length; i++) {
        if (type == 'film') {
            var titolo = data[i].title;
            var originale = data[i].original_title;
        } else if (type == 'serie tv') {
            var titolo = data[i].name;
            var originale = data[i].original_name;
        }
        var context = {
            tipo: type,
            title: titolo,
            original_title: originale,
            original_language: flag(data[i].original_language),
            vote_average: stelle(data[i].vote_average),
            poster: poster(data[i].poster_path,titolo),
            overview: data[i].overview.substring(0,200)+' [...]'
        };
        var html = template(context);
        if(type == 'film'){
          $('.section-film').append(html);
        } else {
          $('.section-serie-tv').append(html);
        }
    }
}

function poster(poster,title){
  var urlBase = 'https://image.tmdb.org/t/p/w185';
  var percorso = urlBase + poster; //https://image.tmdb.org/t/p/w185/7lyBcpYB0Qt8gYhXYaEZUNlNQAv.jpg
  poster_image = '<img src="'+percorso+'" class="poster" alt="'+title+'">';
  if (poster == null){
    poster_image = '<img src="img/img-not-av.png" class="poster" alt="'+title+'">';
  }
  return poster_image;
}


function flag(lingua) {
    var bandiera = '';
    if (lingua == 'it' || lingua == 'en') {
        bandiera = '<img src="img/' + lingua + '.svg"/>';
    } else {
        bandiera = lingua;
    }
    return bandiera;
}

function stelle(num) {
    var voto = Math.floor(num/2);
    var stelline = '';
    for (var i = 1; i <= 5; i++) {
        if (i <= voto) {
            var stellina = '<i class="fas fa-star"></i>';
        } else {
            var stellina = '<i class="far fa-star"></i>';
        }
        stelline += stellina
    }
    return stelline;
}

// Variante con mezze stelle:
// function stelle(num){
//   var resto = num % 2;
//   num = Math.floor(num/2);
//   var star = '';
//   for (var i = 0; i < 5; i++){
//     if (i < num){
//       star += '<i class="fas fa-star"></i>';
//     } else if (resto != 0) {
//        star += '<i class="fas fa-star-half-alt"></i>';
//        resto = 0;
//     } else {
//       star += '<i class="far fa-star"></i>';
//     }
//   }
//   return star;
// }

function noResults(type) {
    var source = $("#film-non-trovati").html();
    var template = Handlebars.compile(source);
    var context = {
      noResults: 'Nessun risultato trovato in ' + type
    };
    var html = template(context);
    if(type == 'film'){
      $('.section-film').append(html);
    } else if (type == 'serie tv'){
      $('.section-serie-tv').append(html);
    }
}
