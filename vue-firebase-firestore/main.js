$(document).ready(function () {
    $('.modal').modal();
});

var firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBXt2gg6xgQIk0Qq50GFp-K1IxcNjY3q_I",
    authDomain: "tutorial-vue-80f43.firebaseapp.com",
    databaseURL: "https://tutorial-vue-80f43.firebaseio.com",
    projectId: "tutorial-vue-80f43",
    storageBucket: "tutorial-vue-80f43.appspot.com",
    messagingSenderId: "884165146384"
})

var db = firebaseApp.firestore();
db.settings({
    timestampsInSnapshots: true
});


new Vue({
    el: '#app',
    data: {
        title: 'Archivio Film Firestore',
        db: null,
        filmcloud: [],
        nuovoFilm: {
            film_id: 0,
            titolo: '',
            locandina: '',
            regista: '',
            anno: '',
            tag: 'già visto'
        },
        editFilm: {
            film_id: '',
            titolo: '',
            locandina: '',
            regista: '',
            anno: '',
            tag: 'già visto'
        }
    },
    created() {
        this.pubblicaLista();
    },
    methods: {
        cambiaTag() {
            if (this.nuovoFilm.tag == "già visto") {
                this.nuovoFilm.tag = "da vedere";
            } else {
                this.nuovoFilm.tag = "già visto";
            }
        },
        editTag() {
            if (this.editFilm.tag == "già visto") {
                this.editFilm.tag = "da vedere";
            } else {
                this.editFilm.tag = "già visto";
            }
        },
        pubblicaLista() {
            db.collection("filmcloud").orderBy('titolo').get().then(querySnapshot => {
                var filmcloud = []
                querySnapshot.forEach(doc => {
                    filmcloud.push(doc.data())
                });
                this.filmcloud = filmcloud
            });
        },
        aggiungiFilm() {
            this.nuovoFilm.film_id++ ,
                db.collection("filmcloud").add(this.nuovoFilm).then(this.pubblicaLista)
            this.nuovoFilm.titolo = '',
                this.nuovoFilm.locandina = '',
                this.nuovoFilm.regista = '',
                this.nuovoFilm.anno = ''
            toastr.success("Film aggiunto");
        },
        cancellaFilm(film_id) {
            db.collection("filmcloud").where('film_id', '==', film_id).get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    doc.ref.delete().then(this.pubblicaLista)
                });
                toastr.success("Film cancellato");
            });
        },
        aggiornaFilm(unfilm) {
            this.editFilm.id = unfilm.film_id
            this.editFilm.titolo = unfilm.titolo
            this.editFilm.locandina = unfilm.locandina
            this.editFilm.regista = unfilm.regista
            this.editFilm.anno = unfilm.anno

        },
        modificaFilm() {
            db.collection("filmcloud").where('film_id', '==', this.editFilm.id).get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    doc.ref.set({
                        film_id: this.editFilm.id,
                        titolo: this.editFilm.titolo,
                        locandina: this.editFilm.locandina,
                        regista: this.editFilm.regista,
                        anno: this.editFilm.anno,
                        tag: this.editFilm.tag
                    }).then(this.pubblicaLista)
                });
                toastr.success("Film aggiornato");
            });
        },
    }
})