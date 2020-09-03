// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film.
// Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

$(document).ready(function(){

    $('.button').click(function(){
        var film = $('.ricerca input').val();
        reset(film);
        getFilms(film);
    });

    $('.ricerca input').keydown(function(){
        var film = $('.ricerca input').val();
        if (event.which == 13 || event.keyCode == 13) {
            reset(film);
            getFilms(film);
        }
    });
});

//******FUNZIONI*******

function reset(dati) {
    $('#ricerca-qui').val('');
    $('.container-risultati').empty('');
}

function getFilms(data) {

    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/search/movie',
            method: 'GET',
            data: {
                api_key: '0f860012106ea3b4f9e200aaaf3e1386',
                language: 'it-IT',
                query: data
            },
            success: function(risposta) {

                if (risposta.results == 0) {
                    $('.container-risultati').html('Nessun risultato trovato con ' + data)
                }
                for (var i = 0; i < risposta.results.length; i++) {
                    var source = $("#film-ricercati").html();
                    var template = Handlebars.compile(source);
                    var context = {
                        title: risposta.results[i].title,
                        original_title: risposta.results[i].original_title,
                        original_language: flag(risposta.results[i].original_language),
                        vote_average: stelle(risposta.results[i].vote_average),
                    };
                    var html = template(context);
                    $('.container-risultati').append(html);
                }
            },
            error: function() {
                alert('errore');
            }
        }
    );
}

function flag(dato) {
    var italiano = it;
    var inglese = en;
    if (true) {

    }

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
