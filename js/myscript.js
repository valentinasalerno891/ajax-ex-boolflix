// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film.
// Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

$(document).ready(function(){

    $('.button').click(function(){

        var film = $('.ricerca input').val();

        reset(film);

        $.ajax(
            {
                url: 'https://api.themoviedb.org/3/search/movie',
                method: 'GET',
                data: {
                    api_key: '0f860012106ea3b4f9e200aaaf3e1386',
                    language: 'it-IT',
                    query: film
                },
                success: function(risposta) {

                    if (risposta.total_results == 0) {
                        $('.container-risultati').html('Nessun risultato trovato con ' + film);
                        return;
                    }

                    for (var i = 0; i < risposta.results.length; i++) {

                        var source = $("#film-ricercati").html();
                        var template = Handlebars.compile(source);

                        var titolo = risposta.results[i].title;
                        var titolo_originale = risposta.results[i].original_title;
                        var ligua = risposta.results[i].original_language;
                        var voto = risposta.results[i].vote_average;

                        var context = {
                            title: titolo,
                            original_title: titolo_originale,
                            original_language: ligua,
                            vote_average: voto,
                        }

                        var html = template(context);
                        $('.container-risultati').append(html);
                    }
                },
                error: function() {
                    alert('errore');
                }
            }
        )
    })
});

//******FUNZIONI*******

function reset(dati) {

    $('#ricerca-qui').val('');
    $('.container-risultati').empty('');
}
