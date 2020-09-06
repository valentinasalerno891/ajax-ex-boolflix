// Milestone 3: In questa milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco.
// Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse.
// Dovremo prendere quindi l’URL base delle immagini di TMDB:
// https://image.tmdb.org/t/p/ per poi aggiungere la dimensione che vogliamo generare
// (troviamo tutte le dimensioni possibili a questo link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400) per poi aggiungere la parte finale dell’URL passata dall’API.

$(document).ready(function(){

    var url1 = 'https://api.themoviedb.org/3/search/movie';
    var url2 = 'https://api.themoviedb.org/3/search/tv';

    $('.button').click(function(){

        var ricerca = $('.ricerca input').val();

        reset();
        search(ricerca, url1, 'film');
        search(ricerca, url2, 'serie tv');
    });

    $('.ricerca input').keydown(function(){
        var ricerca = $('.ricerca input').val();
        if (event.which == 13 || event.keyCode == 13) {
            reset();
            search(ricerca, url1, 'film');
            search(ricerca, url2, 'serie tv');
        }
    })
});




//******FUNZIONI*******

function reset(dati) {
    $('#ricerca-qui').val('');
    $('.container-risultati').empty('');
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
                    $('.container-risultati').html('Nessun ricerca trovata con ' + data)
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
            poster: data[i].poster_path
        };
        var html = template(context);
        $('.container-risultati').append(html);
    }
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
