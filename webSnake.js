// snake game made possible with help from freeCodeCamp.org, video at https://www.youtube.com/watch?v=bRlvGoWz6Ig

$("#leaders").hide();

$("#leaderImg").mouseenter(
  function(){
    $("#leaderImg").attr("src", "leaderHover.png");
  }
)
$("#leaderImg").mouseleave(
  function(){
    $("#leaderImg").attr("src", "leader.png");
  }
)
$("#close").mouseenter(
  function(){
    $("#close").attr("src", "closeHover.png");
  }
)
$("#close").mouseleave(
  function(){
    $("#close").attr("src", "close.png");
  }
)
$("#close").click(
  function(){
    $("#leaders").hide();
})
$("#leaderImg").click(
  function(){
    $("#leaders").show();
    writeData();
})

var db = firebase.firestore();
var docRef = db.collection("users");

var listLength = 0;
db.collection("users").onSnapshot(function(querySnapshot){
  querySnapshot.forEach(function(doc){
    listLength++;
  })
})


var databaseScores = [];
var databaseNames = [];
var scores = $("#scoreList");

function sortRanks(){
  for(i = 0; i < databaseScores.length; i++){
    for(j = 0; j < databaseScores.length; j++){
      if(databaseScores[j] < databaseScores[j+1]){
        var temp = databaseScores[j];
        var temp2 = databaseNames[j];
        databaseScores[j] = databaseScores[j+1];
        databaseNames[j] = databaseNames[j+1];
        databaseScores[j+1] = temp;
        databaseNames[j+1] = temp2;
      }
    }
  }
  console.log(databaseScores);
  console.log(databaseNames);

}


function writeData(){
  db.collection("users").onSnapshot(function(querySnapshot){
    scores.text("");
    querySnapshot.forEach(function(doc){
      var name = doc.data().name;
      var score = doc.data().score;
      name = name.toString().toUpperCase();
      databaseScores.push(score);
      databaseNames.push(name);
      sortRanks();
    });
    for(i = 0; i < 10; i++){
      console.log("hit")
      scores.append("<p>NAME: " + databaseNames[i] + " -- SCORE: " + databaseScores[i] + "</p><br>");
    }
  });
}


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let state = initialState();

const x = c => Math.round(c * canvas.width / state.cols);
const y = r => Math.round(r * canvas.height / state.rows);

function addUserScore(newScore){
  // adding to firebase
  if(count > 0){
    var currentPlayer = window.prompt("Enter your name to record score of " + count + "!")
    if(currentPlayer != null){
      db.collection("users").add({
            name: currentPlayer,
            score: count
          })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
  }
}

const draw = () => {
  ctx.fillStyle = '#182E3A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#EF4423';
  state.snake.map(p => ctx.fillRect(x(p.x), y(p.y), x(1), y(1)));

  ctx.fillStyle = '#B9E0F7';
  ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1));

  if(state.snake.length == 0){
    addUserScore(count);
    ctx.fillStyle = '#EF4423';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    count = 0;
    document.getElementById('score').innerHTML = "SCORE: 0";
  }
}


// updating game
const step = timeStamp1 => timeStamp2 => {
  if(timeStamp2 - timeStamp1 > 85){
    state = next(state);
    draw();
    window.requestAnimationFrame(step(timeStamp2));
  }
  else{
    window.requestAnimationFrame(step(timeStamp1));
  }
}

// key events
window.addEventListener('keydown', e => {
  switch(e.key){
    case 'w': case 'h': case 'ArrowUp': state = enqueue(state, NORTH);break
    case 'a': case 'j': case 'ArrowLeft': state = enqueue(state, WEST);break
    case 's': case 'k': case 'ArrowDown': state = enqueue(state, SOUTH);break
    case 'd': case 'l': case 'ArrowRight': state = enqueue(state, EAST);break
  }
})

// main drawing
draw();
window.requestAnimationFrame(step(0));
