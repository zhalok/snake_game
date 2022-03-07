import { draw_body, draw_head } from './snake.js';
const canvas = document.querySelector('#game-board');
const ctx = canvas.getContext('2d');
const scoreBoard = document.querySelector('#score span');
const highScore = document.querySelector('#high-score span');
const savedScore = JSON.parse(localStorage.getItem('scoreLocalStorage'));

const FRAMES_PER_SECOND = 10;
const GRID_SIZE = 20;

let snake_position = {
	x_position: 200,
	y_position: 200,
};
let is_game_over = true;
let score = 0;

let scoreLocalStorage = {
	lastRoundScore: 0,
	highScore: 0,
};

let apple = {
	x: 0,
	y: 0,
};

// class SnakeBodySegment {
// 	constructor(body_position_x, body_position_y, GRID_SIZE) {
// 		this.body_position_x = body_position_x;
// 		this.body_position_y = body_position_y;
// 		this.width = GRID_SIZE;
// 		this.height = GRID_SIZE;
// 	}
// }

let snakeBody = [];

let snake = {
	direction_x: 0,
	direction_y: 0,
	speed: 20,
	length: 5,
};

const draw_game_board = () => {
	for (let i = 0; i < canvas.height / GRID_SIZE; i++) {
		for (let j = 0; j < canvas.width / GRID_SIZE; j++) {
			if (i % 2 === 0) {
				if (j % 2 === 1) {
					ctx.fillStyle = 'rgb(96, 108, 56)';
					ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
				} else {
					ctx.fillStyle = 'rgb(60, 100, 56)';
					ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
				}
			} else if (i % 2 === 1) {
				if (j % 2 === 0) {
					ctx.fillStyle = 'rgb(96, 108, 56)';
					ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
				} else {
					ctx.fillStyle = 'rgb(60, 100, 56)';
					ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
				}
			}
		}
	}
};

const draw_game_over = () => {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = 'rgb(230, 230, 230)';
	ctx.lineWidth = 10;
	ctx.strokeRect(
		GRID_SIZE,
		GRID_SIZE,
		canvas.width - GRID_SIZE * 2,
		canvas.height - GRID_SIZE * 2
	);
	ctx.fillStyle = 'rgb(230, 230, 230)';
	ctx.font = '100px VT323';
	ctx.fillText('Game Over', 117, canvas.height * 0.3);
	ctx.font = '36px VT323';
	ctx.fillText('Press Spacebar to start a New Game', 55, canvas.height * 0.45);
	ctx.font = '24px VT323';
	ctx.fillText(
		'* Use Arrow keys to control Snake *',
		132,
		canvas.height * 0.63
	);
	ctx.fillText('* Collect Apples to score points *', 137, canvas.height * 0.7);
	ctx.fillStyle = 'red';
	ctx.font = '24px VT323';
	ctx.fillText(
		'<-- Avoid hitting the edges or your own tail! -->',
		65,
		canvas.height * 0.8
	);
};

// const buildBody = () => {
// 	const snakeSegment = new SnakeBodySegment(
// 		snake_position_x,
// 		snake_position_y,
// 		GRID_SIZE
// 	);
// 	return snakeBody.unshift(snakeSegment);
// };

// const draw_body = () => {
// 	buildBody();
// 	snakeBody.forEach((elem) => {
// 		ctx.fillStyle = 'rgb(221, 161, 94)';
// 		ctx.fillRect(
// 			elem.body_position_x,
// 			elem.body_position_y,
// 			elem.width,
// 			elem.height
// 		);
// 		ctx.strokeStyle = 'rgb(241, 201, 114)';
// 		ctx.lineWidth = 1;
// 		ctx.strokeRect(
// 			elem.body_position_x,
// 			elem.body_position_y,
// 			elem.width,
// 			elem.height
// 		);
// 	});
// 	if (snakeBody.length > snake.length) snakeBody.pop();
// };

// const draw_head = () => {
// 	if (
// 		snake_position_x % GRID_SIZE === 0 &&
// 		snake_position_y % GRID_SIZE === 0
// 	) {
// 		getDirection();
// 	}
// 	ctx.fillStyle = 'rgb(221, 161, 94)';
// 	ctx.fillRect(
// 		(snake_position_x += snake.speed * snake.direction_x),
// 		(snake_position_y += snake.speed * snake.direction_y),
// 		GRID_SIZE,
// 		GRID_SIZE
// 	);
// 	ctx.strokeStyle = 'rgb(241, 201, 114)';
// 	ctx.lineWidth = 1;
// 	ctx.strokeRect(snake_position_x, snake_position_y, GRID_SIZE, GRID_SIZE);
// };

// const getDirection = () => {
// 	window.addEventListener('keydown', (e) => {
// 		switch (e.code) {
// 			case 'ArrowUp':
// 				snake.direction_x = 0;
// 				if (snake.direction_y === 1) {
// 					return;
// 				} else snake.direction_y = -1;
// 				break;
// 			case 'ArrowDown':
// 				snake.direction_x = 0;
// 				if (snake.direction_y === -1) {
// 					return;
// 				} else snake.direction_y = 1;
// 				break;
// 			case 'ArrowLeft':
// 				snake.direction_y = 0;
// 				if (snake.direction_x === 1) {
// 					return;
// 				} else snake.direction_x = -1;
// 				break;
// 			case 'ArrowRight':
// 				snake.direction_y = 0;
// 				if (snake.direction_x === -1) {
// 					return;
// 				} else snake.direction_x = 1;
// 				break;
// 			default:
// 				console.log('Ignored');
// 				break;
// 		}
// 	});
// };

const draw_apple = () => {
	snakeBody.forEach(({ body_position_x, body_position_y }) => {
		if (apple.x === body_position_x && apple.y === body_position_y) {
			get_random_apple_position();
		} else {
			ctx.fillStyle = 'red';
			ctx.strokeStyle = 'red';
			ctx.beginPath();
			ctx.arc(
				apple.x + GRID_SIZE / 2,
				apple.y + GRID_SIZE / 2,
				GRID_SIZE / 2,
				0,
				2 * Math.PI,
				true
			);
			ctx.stroke();
			ctx.fill();
		}
	});
};

const get_random_apple_position = () => {
	apple.x = Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * GRID_SIZE;
	apple.y = Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * GRID_SIZE;
	if (
		apple.x < GRID_SIZE ||
		apple.x === canvas.width - GRID_SIZE ||
		apple.y < GRID_SIZE ||
		apple.y === canvas.height - GRID_SIZE
	) {
		get_random_apple_position();
	}
};

const boundary_check = () => {
	if (
		snake_position.x_position < 0 ||
		snake_position.x_position === canvas.width
	) {
		is_game_over = true;
	}
	if (
		snake_position.y_position < 0 ||
		snake_position.y_position === canvas.height
	) {
		is_game_over = true;
	}
};

const apple_check = () => {
	if (
		snake_position.x_position === apple.x &&
		snake_position.y_position === apple.y
	) {
		get_random_apple_position();
		snake.length += 1;
		score++;
		scoreBoard.textContent = `SCORE: ${score}`;
	}
};

const body_check = () => {
	snakeBody.forEach(({ body_position_x, body_position_y }) => {
		if (snake.direction_x === 0 && snake.direction_y === 0) {
			return;
		} else if (
			snake_position.x_position === body_position_y &&
			snake_position.y_position === body_position_x
		) {
			is_game_over = true;
		}
	});
};

const createLocalStorage = () => {
	if (savedScore === null) {
		localStorage.setItem(
			'scoreLocalStorage',
			JSON.stringify(scoreLocalStorage)
		);
		document.location.reload();
	}
};

const display_last_round_score = () => {
	scoreBoard.textContent = `SCORE: ${savedScore.lastRoundScore}`;
	highScore.textContent = `HIGH SCORE: ${savedScore.highScore}`;
};

const check_game_over = () => {
	if (is_game_over) {
		scoreLocalStorage.lastRoundScore = score;
		scoreLocalStorage.highScore = savedScore.highScore;
		if (scoreLocalStorage.lastRoundScore > scoreLocalStorage.highScore) {
			scoreLocalStorage.highScore = scoreLocalStorage.lastRoundScore;
			localStorage.setItem(
				'scoreLocalStorage',
				JSON.stringify(scoreLocalStorage)
			);
		}
		localStorage.setItem(
			'scoreLocalStorage',
			JSON.stringify(scoreLocalStorage)
		);
		document.location.reload();
	}
};

window.addEventListener('keydown', (e) => {
	if (is_game_over && e.code === 'Space') {
		is_game_over = false;
		playGame();
		score = 0;
	}
});

const playGame = () => {
	console.log(draw_head, draw_body);
	setInterval(function () {
		draw_game_board();
		draw_apple();
		draw_body(ctx, snake, snakeBody, snake_position);
		draw_head(ctx, snake, snakeBody, snake_position);
		boundary_check();
		apple_check();
		body_check();
		check_game_over();
	}, 1000 / FRAMES_PER_SECOND);
	get_random_apple_position();
};

window.onload = () => {
	createLocalStorage();
	draw_game_board();
	draw_game_over();
	display_last_round_score();
};
