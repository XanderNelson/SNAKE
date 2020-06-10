// snake game made possible with help from freeCodeCamp.org, video at https://www.youtube.com/watch?v=bRlvGoWz6Ig

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let state = initialState();

const x = c => Math.round(c * canvas.width / state.cols);
const y = r => Math.round(r * canvas.height / state.rows);

const draw = () => {
  ctx.fillStyle = '#182E3A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#F58426';
  state.snake.map(p => ctx.fillRect(x(p.x), y(p.y), x(1), y(1)));

  ctx.fillStyle = '#B9E0F7';
  ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1));

  if(state.snake.length == 0){
    ctx.fillStyle = '#F58426';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    count = 0
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
