import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { Circle } from './CircleClass';
import { checkDirect } from './LogicForPlayer';
import { getCursorPosition } from './LogicForPlayer';
import { getDirect } from './LogicForPlayer';
import { Shell } from './ShellClass';


const Canvas = ({ centerX, centerY, color }) => {
  const canvasRef = useRef(null);
  const canvasSize = useRef({ height: 500, width: 1000 });
  
  // Переменные игроков
  const [player1, setPlayer1] = useState(new Circle('purple'));
  const [player2, setPlayer2] = useState(new Circle('purple',930, 50));

  const [speedPlayer1, setSpeedPlayer1] = useState(5);
  const [speedPlayer2, setSpeedPlayer2] = useState(5);
  const speedAllPlayer = useRef({player1 : speedPlayer1, player2 : speedPlayer2});

  // Переменные снарядов
  const [shellPlayer1, setShellPlayer1] = useState(new Shell(0, 0, 0));
  const [shellPlayer2, setShellPlayer2] = useState(new Shell(1000,0,0,'blue'));
  
  const [speedShellPlayer1, setSpeedShellPlayer1] = useState(5);
  const [speedShellPlayer2, setSpeedShellPlayer2] = useState(5);

  const [colorShellPlyer1, setColorShellPlyer1] = useState('#ff0000');
  const [colorShellPlyer2, setColorShellPlyer2] = useState('#ff0000');
  // Переменные параметров
  const cursorePosition = useRef({x: 0, y: 0});
  const [score, setScore] = useState({player1 : 0, player2 : 0});
  const [optionVisible, setOptionVisible] = useState('invisible');

  const options = useRef({
    player1: { step: 5, direct: 'down' },
    player2: { step: 5, direct: 'down' },
  });

  const animationFrameIds = useRef({
    player1: null,
    player2: null,
    shellPlayer1 : null,
    shellPlayer2 : null,
  });

  function checkClicedPlayer(event){
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let position = {
      player1 : {x : player1.getPosition().centerX, y : player1.getPosition().centerY, radius : player1.getPosition().radius},
      player2 : {x : player2.getPosition().centerX, y : player2.getPosition().centerY, radius : player2.getPosition().radius}
    }
    console.log(x,y);
    if(
      (x <= (position.player1.x + position.player1.radius + speedPlayer1) && x >= (position.player1.x - position.player1.radius - speedPlayer1))
      &&
      (y <= (position.player1.y + position.player1.radius + speedPlayer1) && y >= (position.player1.y - position.player1.radius - speedPlayer1))
    ){
      setOptionVisible('visible')
    }

    if(
      (x <= (position.player2.x + position.player2.radius + speedPlayer2) && x >= (position.player2.x - position.player2.radius - speedPlayer2))
      &&
      (y <= (position.player2.y + position.player2.radius + speedPlayer2) && y >= (position.player2.y - position.player2.radius - speedPlayer2))
    ){
      setOptionVisible('visible')
    }
  }

  function createShell(player, direct){
    let centerX;
    let centerY;
    let color;
    if(direct == 'right'){
      centerX = player1.getPosition().centerX + player1.getPosition().radius; 
      centerY = player1.getPosition().centerY;
      color = colorShellPlyer1;
    }
    else{
      centerX = player2.getPosition().centerX - player2.getPosition().radius; 
      centerY = player2.getPosition().centerY;
      color = colorShellPlyer2;
    }
    return new Shell(centerX, centerY, 5, color);
  }

  // Функция для снарядов
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    function shellPlayer1Move(){
      const shellX = shellPlayer1.getPosition('x');
      const shellY = shellPlayer1.getPosition('y');

      if(shellX == 0 || shellX > 1000){
        shellPlayer1.clear(context)
        setShellPlayer1(createShell(player1, 'right'));
      }
      if(shellX <= player2.getPosition().centerX - player2.getPosition().radius ||
        !(shellY >= player2.getPosition().centerY - player2.getPosition().radius 
          && shellY <= player2.getPosition().centerY + player2.getPosition().radius))
      {
        shellPlayer1.move(context, speedShellPlayer1, 'right');
      }
      else{
        setScore({player2 : score.player2, player1 : score.player1 + 1});
        shellPlayer1.clear(context)
        setShellPlayer1(createShell(player1,'right'));
      }

      animationFrameIds.current.shellPlayer1 = requestAnimationFrame(shellPlayer1Move);
    };

    function shellPlayer2Move(){
      const shellX = shellPlayer2.getPosition('x');
      const shellY = shellPlayer2.getPosition('y');

      if(shellX == 1000 || shellX < -10){
        shellPlayer2.clear(context)
        setShellPlayer2(createShell(player2, 'left'));
      }
      if(shellX >= player1.getPosition().centerX + player1.getPosition().radius - 5 ||
        !(shellY >= player1.getPosition().centerY - player1.getPosition().radius 
          && shellY <= player1.getPosition().centerY + player1.getPosition().radius))
      {
        shellPlayer2.move(context, speedShellPlayer2, 'left');
      }
      else{
        setScore({player1 : score.player1, player2 : score.player2 + 1});
        shellPlayer2.clear(context)
        setShellPlayer2(createShell(player2, 'left'));
      }

      animationFrameIds.current.shellPlayer2 = requestAnimationFrame(shellPlayer2Move);
    };

    if(animationFrameIds.current.shellPlayer1) {
      cancelAnimationFrame(animationFrameIds.current.shellPlayer1);
    };
    if(animationFrameIds.current.shellPlayer2) {
      cancelAnimationFrame(animationFrameIds.current.shellPlayer2);
    };

    shellPlayer1Move();
    shellPlayer2Move();

  }, [shellPlayer1, shellPlayer2]);

  // Функция для игрока
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    function player1Move() {
      checkDirect('player1', player1, canvasSize, cursorePosition, speedAllPlayer , options);
      player1.move(context, getDirect('player1', speedPlayer1, options));
      animationFrameIds.current.player1 = requestAnimationFrame(player1Move);
    }
    function player2Move() {
      checkDirect('player2', player2, canvasSize, cursorePosition, speedAllPlayer , options);
      player2.move(context, getDirect('player2', speedPlayer2, options));
      animationFrameIds.current.player2 = requestAnimationFrame(player2Move);
    }

    if (animationFrameIds.current.player1) {
      cancelAnimationFrame(animationFrameIds.current.player1);
    }
    if (animationFrameIds.current.player2) {
      cancelAnimationFrame(animationFrameIds.current.player2);
    }

    player1Move();
    player2Move();
}, [speedPlayer1, speedPlayer2, player1, player2]);

  return (
    <div className='game'>
      <div onClick={()=>setOptionVisible('invisible')} className={`closeFon ${optionVisible}`}></div>

      <div className={`optionSection ${optionVisible}`}>
        <div className="popup">
          <div className="playerOption">
            <div className="option">
              <p>Цвет снаряда</p>
              <input onChange={(event)=>setColorShellPlyer1(event.target.value)} type="color" value={colorShellPlyer1}/>
            </div>
            <div style={{backgroundColor : `${colorShellPlyer1}`}} className="preview shell"></div>
          </div>
          <div className="playerOption">
            <div className="option">
              <p>Цвет снаряда</p>
              <input onChange={(event)=>setColorShellPlyer2(event.target.value)} type="color" value={colorShellPlyer2}/>
            </div>
            <div style={{backgroundColor : `${colorShellPlyer2}`}} className="preview shell"></div>
          </div>
        </div>
      </div>
      <div className="scoreSection">
        <div className="countScore">Попаданий : {score.player1}</div>
        <div className="countScore">Попаданий : {score.player2}</div>
      </div>
        <canvas onClick={(event)=>checkClicedPlayer(event)} onMouseMove={(event)=>getCursorPosition(event,canvasRef, cursorePosition)} className='canvas' ref={canvasRef} width={canvasSize.current.width} height={canvasSize.current.height} />
          <div className="optionGame">
            <div className="playerOption">
              <p>Скорость героя</p>
              <input onChange={(event) => setSpeedPlayer1(Number(event.target.value))} type="range" min={5} max={15} value={speedPlayer1} />
              <p>Скорость снарядов</p>
              <input onChange={(event) => setSpeedShellPlayer1(Number(event.target.value))} type="range" min={5} max={15} value={speedShellPlayer1} />
            </div>
            <div className="playerOption">
              <p>Скорость героя</p>
              <input onChange={(event) => setSpeedPlayer2(Number(event.target.value))} type="range" min={5} max={15} value={speedPlayer2} />
              <p>Скорость снарядов</p>
              <input onChange={(event) => setSpeedShellPlayer2(Number(event.target.value))} type="range" min={5} max={15} value={speedShellPlayer2} />
            </div>
          </div>
    </div>
  );
};

export default Canvas;
