$().ready(function(){
  $("#buttonArtista").css("background-color", "#555555");
  $("#buttonArtista").css("color", "#fff");  
});

const botao1 = document.getElementById('buttonSong');
const botao2 = document.getElementById('buttonArtista');

const loading = document.getElementById('loader');

const song = document.getElementById('song');
const artista = document.getElementById('artista');

var NOME_SONG;
var NOME_ARTISTA;

//nome Artista Song
botao1.addEventListener('click', function() {
  if($("#song").css("display") == 'none'){
    song.style.display = 'block'; 
    artista.style.display = 'none'; 
    $("#nome").val('');  
    $("#buttonSong").css("background-color", "#555555");
    $("#buttonSong").css("color", "#fff");
    $("#buttonArtista").css("background-color", "#fff");
    $("#buttonArtista").css("color", "#555555");
    $("#Song").css("display", "block");
    $("#Artista").css("display", "none");
    document.getElementById("teste").innerHTML = "";
    $("main").css("min-height", "90vh");  
  } 
});

botao2.addEventListener('click', function() {
  if($("#artista").css("display") == 'none'){
    song.style.display = 'none';
    artista.style.display = 'block';   
    $("#nomeArtista").val('');
    $("#nomeSong").val('');
    $("#buttonArtista").css("background-color", "#555555");
    $("#buttonArtista").css("color", "#fff");    
    $("#buttonSong").css("background-color", "#fff");
    $("#buttonSong").css("color", "#555555");
    $("#Song").css("display", "none");
    $("#Artista").css("display", "block");
    document.getElementById("teste").innerHTML = ""; 
    $("main").css("min-height", "90vh");  
  }  
});



//track.getsimilar&artist=cher&track=believe
function pegarSimilarArtista(valor){    
    $("main").css("min-height", "90vh");  
    document.getElementById("teste").innerHTML = "<div class='loader' id='loader'><br/></div><h2>BUSCANDO...</h2>"; 
    setTimeout(function() {
      $.getJSON("https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + valor + "&limit=20&api_key=53ca750ff08680650a1aa431bf02a97a&limit=10&format=json&callback=?", function(json) {
        let html = [];
        try{
          if (json['error'] === 6 || !json.similarartists.artist.length) {
            document.getElementById("teste").innerHTML = "<h1>ARTISTA NÃO EXISTENTE</h1>";
            loading.style.display = 'none';
          } else {    
            const nomes = [];
            const textos = [];
            const links = [];
            for (let i = 0; i < json.similarartists.artist.length; i++) {
              const nome = json.similarartists.artist[i].name;            
              const texto = "<h3>"+nome+"</h3></div></a>";
              const link = "<a href='"+ json.similarartists.artist[i].url +"' target='_blank'>";
              textos.push(texto);
              nomes.push(nome);
              links.push(link);
            
            }
        
            const promises = nomes.map(nome => {
              const apiUrl = "https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + nome + "&api_key=53ca750ff08680650a1aa431bf02a97a&limit=10&format=json&callback=?";
              return $.getJSON(apiUrl);
            });
            
            Promise.all(promises).then(albumsDataArray => {
              const html = [];
              const array = albumsDataArray.map(albumsData => {
                if(albumsData['error'] !== 6 ){
                  if(albumsData.topalbums.album.length !== 0){
                    const foto = albumsData.topalbums.album[0].image[2]["#text"];
                    const title = foto === "" ? "<div class='card'</div>":"<div class='card' style='background-image: url("+foto+");'>";
                    return title;
                  }
                  return "<div class='card'</div>"; 
                }
              });
              for(let i = 0; i < links.length; i++){
                if(array[i] !== undefined){
                  html.push(links[i] + array[i] + textos[i]);
                }
              }
              document.getElementById("teste").innerHTML = html.join('');
              $("main").css("min-height", "30vh");  
            });
            
          }
        }catch {
          document.getElementById("teste").innerHTML = "<h2>ARTISTA NÃO EXISTENTE</h2>";
        }

      });

    }, 1000);        
}

function pegarSimilarSong(nome, artista){  
    $("main").css("min-height", "90vh");  
    document.getElementById("teste").innerHTML = "<div class='loader' id='loader'><br/></div><h2>BUSCANDO...</h2>"; 
    setTimeout(function() {
      $.getJSON("https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist="+artista+"&track=" + nome + "&limit=20&api_key=53ca750ff08680650a1aa431bf02a97a&limit=10&format=json&callback=?", function(json) {
        if (json['error'] === 6 || !json.similartracks.track.length) {
            document.getElementById("teste").innerHTML = "<h2>ARTISTA/MÚSICA NÃO EXISTENTE</h2>";
            loading.style.display = 'none';
          } else {  
            const dados = [];
            const links = [];
            const textos = [];
            for (let i = 0; i < json.similartracks.track.length; i++) {
              const nomeSong = json.similartracks.track[i].name;
              const Artista = json.similartracks.track[i].artist.name;
              const link = "<a href='"+ json.similartracks.track[i].url +"' target='_blank'>";
              const texto = "<h3>"+nomeSong+"</br>"+Artista+"</h3></div></a>";
              links.push(link);
              textos.push(texto);
              dados.push(Artista +";"+nomeSong);
            
            }
            const promises = dados.map(dado => {
              const artista = dado.split(";")[0];
              const nome = dado.split(";")[1];
              const apiUrl = "https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist="+artista+"&track="+nome+"&api_key=53ca750ff08680650a1aa431bf02a97a&limit=10&format=json&callback=?";
              return $.getJSON(apiUrl);
            });
            
            Promise.all(promises).then(albumsDataArray => {
              const html = [];
              const array = albumsDataArray.map(albumsData => {
                if(albumsData['error'] !== 6){
                  const foto = albumsData.track.album !== undefined ? albumsData.track.album.image[2]["#text"]: "NO PHOTO";
                  return (foto === "" || foto === "NO PHOTO") ? "<div class='card'</div>" :"<div class='card' style='background-image: url("+foto+");'>";

                }
                return "<div class='card'</div>";
              });
              for(let i = 0; i < links.length; i++){
                if(array[i] !== undefined){
                  html.push(links[i] + array[i] + textos[i]);
                }
              }
              document.getElementById("teste").innerHTML = html.join('');
              $("main").css("min-height", "30vh");  
            });
            
          }
      });
    }, 1000);
};
function getSimilarSong(){
  const nomeInput = document.getElementById('nomeSong');
  const artistaInput = document.getElementById('nomeArtista');
  const nome = nomeInput.value;
  const artista = artistaInput.value;
  if(nome !== '' && artista !== ''){
    NOME_ARTISTA = artista;
    NOME_SONG = nome;
    pegarSimilarSong(nome, artista);
  }
  
}

function getSimilarArtista(){
  const nomeInput = document.getElementById('nome');
  const valor = nomeInput.value;  
  if(valor !== ''){
    NOME_ARTISTA = valor;
    pegarSimilarArtista(valor);
  }
}

function clickPress(event, option) {
  if (event.key == "Enter") {
    if(option === 1){
      if(document.getElementById('nome').value !== NOME_ARTISTA){        
        getSimilarArtista();
      }      
    }else if(option === 2){
      if(document.getElementById('nomeSong').value !== NOME_SONG || document.getElementById('nomeArtista').value !== NOME_ARTISTA){
        getSimilarSong();        
      }
    }
  }
}
