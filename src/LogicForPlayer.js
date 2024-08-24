// Функция для измененния направления
export function checkDirect(playerName, player, canvasSize, cursorePosition, speedAllPlayer , options) {
    let centerY = player.getPosition().centerY;
    let centerX = player.getPosition().centerX;
    let radius = player.getPosition().radius;
    

    if (centerY + radius >= canvasSize.current.height 
      || (Math.abs(centerY + radius - cursorePosition.current.y) < speedAllPlayer.current[playerName] + 10 
          && (cursorePosition.current.x <= centerX + radius && cursorePosition.current.x >= centerX - radius) )) {
      
      options.current[playerName].direct = 'up';
    }
    if ((centerY - radius <= 0
      || (Math.abs(centerY - radius - cursorePosition.current.y) < speedAllPlayer.current[playerName] + 10
          && (cursorePosition.current.x <= centerX + radius && cursorePosition.current.x >= centerX - radius) )) && !(centerY + radius >= canvasSize.current.height )) {

      options.current[playerName].direct = 'down';
    }
  }

// Функция для получения координат курсора
export function getCursorPosition(event, canvasRef, cursorePosition){
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
     cursorePosition.current = {x : x , y : y};
  }

// Функция для движения игроков в нужном напрвлении
export function getDirect(player, speed, options) {
    if (options.current[player].direct === 'down') {
      return 0 + speed;
    }
    if (options.current[player].direct === 'up') {
      return 0 - speed;
    }
  }