$(document).ready(function(){

// film e serie trend della settimana
    trend('movie');
    trend('tv');

// ricerca
    $('#search').click(function(){
        start();
    });

    $('#ricerca-qui').keydown(function(){
        if (event.which == 13 || event.keyCode == 13) {
            start();
            reset();
        }
    })

// scorrimento trends e risultati ricerca

    $('i.left').click(function(){
        var nextElement = $(this).siblings('.lista');
        var currentElement = nextElement.scrollLeft();
        currentElement -= 200;
        nextElement.scrollLeft(currentElement);
    });
    $('i.right').click(function(){
        var nextElement = $(this).siblings('.lista');
        var currentElement = nextElement.scrollLeft();
        currentElement += 200;
        nextElement.scrollLeft(currentElement);
    });

});




//******FUNZIONI*******

function trend(tipo){
    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/trending/' + tipo + '/day',
            method:'GET',
            data:{
                api_key:'0f860012106ea3b4f9e200aaaf3e1386',
                language:'it-IT'
            },
            success: function(risposta){
                getResults(risposta,tipo);
            },
            error: function(){
                alert('Si è verificato un errore');
            }
        }
    )
}

function start(tipo){

    var ricerca = $('#ricerca-qui').val();

    var tipo1 = 'movie';
    var url = 'https://api.themoviedb.org/3/search/' + tipo1;
    search(ricerca, url, tipo1);

    var tipo2 = 'tv';
    var url = 'https://api.themoviedb.org/3/search/' + tipo2;
    search(ricerca, url, tipo2);

    reset();
}

function reset() {
    $('.lista').empty('');
    $('#ricerca-qui').val('');
}

function search(ricerca, url, tipo) {

    $.ajax(
        {
            url: url,
            method: 'GET',
            data: {
                api_key: '0f860012106ea3b4f9e200aaaf3e1386',
                language: 'it-IT',
                query: ricerca,
            },
            success: function(risposta) {
                if (risposta.total_results > 0) {
                    getResults(risposta, tipo);
                } else {
                    noResults(tipo);
                }
            },
            error: function() {
                alert('errore nella ricerca');
            }
        }
    );
}

function getResults(risposta, tipo) {
    var source = $("#film-ricercati").html();
    var template = Handlebars.compile(source);

    for (var i = 0; i < risposta.results.length; i++) {

        var id = risposta.results[i].id;
        var originalLanguage = risposta.results[i].original_language;
        var voto = risposta.results[i].vote_average;

        if (tipo == 'movie') {
            var titolo = risposta.results[i].title;
            var originalTitle = risposta.results[i].original_title;
        } else if (tipo == 'tv') {
            var titolo = risposta.results[i].name;
            var originalTitle = risposta.results[i].original_name;
        };

        var context = {
            id: id,
            tipo: tipo,
            title: titolo,
            original_title: originalTitle,
            original_language: flag(originalLanguage),
            vote_average: stelle(voto),
            poster: poster(risposta.results[i].poster_path),
            overview: risposta.results[i].overview.substring(0,180)+' [...]'
        }

        var html = template(context);
        if (tipo == 'movie'){
          $('.lista.movie').append(html);
        } else if (tipo == 'tv') {
          $('.lista.tv').append(html);
        }
    };
}

function poster(poster){
    if (poster == null){
        var percorso = 'img/not_found.jpg';
    } else {
        var urlBase = 'https://image.tmdb.org/t/p/w342/';
        var percorso = urlBase + poster;
    }
    return percorso;
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

function noResults(tipo) {
    var source = $("#film-non-trovati").html();
    var template = Handlebars.compile(source);
    var context = {
        noResults: 'Nessun risultato trovato in ' + tipo
    };
    var html = template(context);
    if (tipo == 'movie'){
        $('.lista.movie').append(html);
    } else if (tipo == 'tv') {
        $('.lista.tv').append(html);
    }
}
