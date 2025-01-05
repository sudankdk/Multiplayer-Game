import React, { useEffect, useState } from "react";
import { position, obstacle, projectile } from "../interface/GameInterface";

const Game: React.FC = () => {
  const canvasHeight: number = 600;
  const canvasWidth: number = 800;
  const playerSize: number = 20;

  const obstacle: obstacle[] = [
    { x: 50, y: 40, width: 50, height: 80 },
    { x: 250, y: 60, width: 70, height: 100 },
    { x: 450, y: 120, width: 60, height: 90 },
    { x: 650, y: 200, width: 40, height: 70 },
    { x: 150, y: 300, width: 80, height: 60 },
    { x: 400, y: 400, width: 50, height: 100 },
  ];

  const [position, setPosition] = useState<position>({ x: 100, y: 100 });
  const [projectiles, setProjectiles] = useState<projectile[]>([]);
  const [direction, setDirection] = useState<string>("Right");

  // AABB Collision detection algorithm in use
  const isColliding = (x: number, y: number): boolean => {
    return obstacle.some(
      (o) =>
        x < o.x + o.width && // player ko left edge ra obstacle ko right edgde ovelap hunu vaina
        x + playerSize > o.x && //palyer ko right edge ra obstacle ko left edge overlap hunu vaina
        y < o.y + o.height && //top edge of player ani bottom edge of obs
        y + playerSize > o.y // bottom edge of player ani top edge of obs
    );
  };

  // const isProjectileColiding =(x,y)=>{
  //   return projectiles.some(
  //     (obs)=>
  //       x
  //   )
  // }

  const handlekeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const newPosition = { ...position };
    if (e.key === "ArrowUp" && position.y > 0) {
      newPosition.y -= 10;
      setDirection("Up");
    }
    if (e.key === "ArrowDown" && position.y < canvasHeight - playerSize) {
      newPosition.y += 10;
      setDirection("Down");
    }
    if (e.key === "ArrowLeft" && position.x > 0) {
      newPosition.x -= 10;
      setDirection("Left");
    }
    if (e.key === "ArrowRight" && position.x < canvasWidth - playerSize) {
      newPosition.x += 10;
      setDirection("Right");
    }
    if (e.key === " ") {
      const newProjectile = {
        x: position.x + playerSize / 2,
        y: position.y + playerSize / 2,
        speed: 15,
        direction,
      };
      if (!isColliding(newProjectile.x, newProjectile.y)) {
        console.log(projectiles);
        console.log("not colliding");

        setProjectiles((prev) => [...prev, newProjectile]);
      } else {
        console.log("colliding");
        setProjectiles([]);
      }
    }
    if (!isColliding(newPosition.x, newPosition.y)) {
      console.log("player not coliding");
      setPosition(newPosition);
    } else {
      console.log("player colliding");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProjectiles((prev) =>
        prev
          .map((proj) => {
            switch (proj.direction) {
              case "Up":
                return { ...proj, y: proj.y - proj.speed };
              case "Down":
                return { ...proj, y: proj.y + proj.speed };
              case "Left":
                return { ...proj, x: proj.x - proj.speed };
              case "Right":
                return { ...proj, x: proj.x + proj.speed };
              default:
                return proj;
            }
          })
          .filter(
            (proj) =>
              proj.x > 0 &&
              proj.x < canvasWidth &&
              proj.y > 0 &&
              proj.y < canvasHeight
          )
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      tabIndex={0}
      onKeyDown={handlekeyDown}
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        border: "1px solid black",
        position: "relative",
        outline: "none",
      }}
    >
      <div
        style={{
          width: `${playerSize}px`,
          height: `${playerSize}px`,
          backgroundColor: "blue",
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      ></div>

      {obstacle.map((obs, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${obs.x}px`,
            top: `${obs.y}px`,
            width: `${obs.width}px`,
            height: `${obs.height}px`,
            backgroundColor: "red",
          }}
        ></div>
      ))}

      {projectiles.map((proj, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            width: "5px",
            height: "10px",
            backgroundColor: "yellow",
            left: `${proj.x}px`,
            top: `${proj.y}px`,
          }}
        />
      ))}
    </div>
  );
};

export default Game;
