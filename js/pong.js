
window.onload = function() {

  const game = new Phaser.Game(800, 600, Phaser.AUTO, 'pg', { preload: preload, create: create, update: update });
  
  let player;
  let c_player;
  let ball;
  let cursors;
  let p_score = 0;
  let p_scoreText;
  let c_score = 0;
  let c_scoreText;
  let paddle_hit_1;
  let paddle_hit_2;
  let wall_hit;

  function preload () {
    game.load.audio('p_hit_1', './sounds/paddle_hit.wav');
    game.load.audio('p_hit_2', './sounds/paddle_hit_2.wav');
    game.load.audio('wall_hit', './sounds/wall_hit.wav');
  }
  
  function create () {
    //player
    player = game.add.graphics (40, 270);
    player.beginFill(0xFFFFFF, 1);
    player.drawRect(0,0,10,60);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    // computer player
    c_player = game.add.graphics (760, 270);
    c_player.beginFill(0xFFFFFF, 1);
    c_player.drawRect(0,0,10,60);
    game.physics.arcade.enable(c_player);
    c_player.body.collideWorldBounds = true;

    // center line
    const line = game.add.graphics (400, 0);
    line.beginFill(0xFFFFFF, 1);
    line.drawRect(0, 0, 2, 600);

    // ball
    ball = game.add.graphics (395, 300);
    ball.beginFill(0xFFFFFF, 1);
    ball.drawRect(0, 0, 5, 5);
    game.physics.arcade.enable(ball);
    // ball.body.collideWorldBounds = true;
    ball.body.velocity.x = -300;
    ball.body.velocity.y = (Math.random() * 10 - 5) * 30;

    // scores
    p_scoreText = game.add.text(320, 16, '0', { font: 'Courier', fontSize: '40px', fill: '#fff' });
    c_scoreText = game.add.text(450, 16, '0', { font: 'Courier', fontSize: '40px', fill: '#fff' });
    // controls
    cursors = game.input.keyboard.createCursorKeys();

    // sounds
    paddle_hit_1 = game.add.audio('p_hit_1');
    paddle_hit_2 = game.add.audio('p_hit_2');
    wall_hit = game.add.audio('wall_hit');
  }

  function update () {
    //
    game.physics.arcade.overlap(ball, player, reflect, null, this);
    game.physics.arcade.overlap(ball, c_player, reflect, null, this);
    console.log(ball.body.velocity.y, 'y vel');
    // ball hits top or bottom
    if (ball.body.y <= 0 || ball.body.y >= 600) {
      ball.body.velocity.y *= -1;
      wall_hit.play();
    }
    // ball is out
    if (ball.body.x <= 0) {
      c_score++;
      c_scoreText.text = c_score;
      console.log('score cpu');
      restart();
    }
    if (ball.body.x >= 800) {
      p_score++
      p_scoreText.text = p_score;
      console.log('score player');
      restart();
    }
    // c_player tracking
    // up
    c_player.body.velocity.y = 0;
    if (ball.body.y < c_player.body.y +30) {
      c_player.body.velocity.y = -250;
    }
    else if (ball.body.y > c_player.body.y - 30) {
      c_player.body.velocity.y = 250;
    }
    //down

    // controls
    player.body.velocity.y = 0;
    if (cursors.up.isDown) {
      //  Move up
      player.body.velocity.y = -250;
    }
    else if (cursors.down.isDown) {
      //  Move down
      player.body.velocity.y = 250;
    }

  }
  function reflect(ball, actor) {
    console.log('ball actor', ball.y, actor.y);
    if (actor.y + 30 < ball.y + 3) {
      console.log('actor hi');
      ball.body.velocity.y += (actor.y - 30 - ball.y) * -2;
    }
    if (actor.y + 30 > ball.y + 3) {
      console.log('actor low')
      ball.body.velocity.y += (actor.y - 30 - ball.y) * 2;
    }
    ball.body.velocity.x *= -1;
    if(actor.body.center < 50) {
      paddle_hit_1.play();
    }
    else paddle_hit_2.play();
  }
  function restart() {
    ball.body.x = 395;
    ball.body.y = 300;
    // ball.body.velocity.x = -300;
    // ball.body.velocity.y = -20 * Math.random();
  }

};
