const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7;


const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './background.png'
})


const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
    x: 0,
    y: 0
}, 
velocity: {
    x: 0,
    y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})


const enemy = new Fighter({
    position: {
    x: 400,
    y: 100
}, 
velocity: {
    x: 0,
    y: 0
    },
color: 'blue',
offset: {
    x: -50,
    y: 0
},
imageSrc: './kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: './kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})



console.log(player);


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}


function rectangularCollision({ rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        && rectangle1.isAttacking

    )
}

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex';
    if(player.health == enemy.health){
        document.querySelector('#displayText').innerHTML = 'Tie';
        
    } else if(player.health>enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    } else if(player.health<enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    }
}

let timer = 60;
let timerID;
function decreaseTimer() {
    
    if(timer>0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer --;
        document.querySelector('#timer').innerHTML = timer;
    }

    if(timer == 0){
        
        determineWinner({player, enemy, timerId})

    }
}

decreaseTimer()


function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.1'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    
    if (keys.a.pressed && player.lastKey==='a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey==='d') {
        player.velocity.x = 5
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }


    // jumping


    if(player.velocity.y < 0){
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // if(player.position.y < 200){
    //     player.position.y = 200;
    // }

    // enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.switchSprite('run');
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed){
        enemy.switchSprite('run');
        enemy.velocity.x = 5
    } else {
        enemy.switchSprite('idle');
    }

     // enemy jumping


     if(enemy.velocity.y < 0){
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }


    // detect for collision

    if (
        rectangularCollision( {
            rectangle1: player,
            rectangle2: enemy
        }) && player.isAttacking && player.frameCurrent === 4
    ) {
        enemy.takeHit();
        player.isAttacking = false;
        
        // document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // if player misses

    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false;
    }


    // this is where our player gets hit

    if (
        rectangularCollision( {
            rectangle1: enemy,
            rectangle2: player
        }) && enemy.isAttacking && enemy.frameCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false;
        
        // document.querySelector('#playerHealth').style.width = player.health + '%';
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    // if enemy misses

    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false;
    }


    // end game based on health
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId});
    }




}

animate()


window.addEventListener('keydown', (event) => {
    
    if(!player.dead)
   { switch (event.key) {

        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;

        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;

        case 'w':
            player.velocity.y = -20;  
            break;

        case ' ': 
        player.attack()
        break;

    }}

    if(!enemy.dead){
        switch (event.key) {
            case 'ArrowDown':
                enemy.attack()
                break;
    
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
    
            case 'ArrowUp':
                enemy.velocity.y = -20;
                break;
        }
        
    }
})
    
    window.addEventListener('keyup', (event) => {
        switch (event.key) {
    
            case 'd':
                keys.d.pressed = false;
                break;
    
            case 'a':
                
                keys.a.pressed = false;
                break;
    
    
            case 'ArrowRight':
                keys.ArrowRight.pressed = false;
                break;
    
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false;
                break;
        }
    }
   
)