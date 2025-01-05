export interface position {
  x: number;
  y: number;
}

export interface obstacle {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface projectile {
  x: number;
  y: number;
  speed: number;
  direction?: string;
}
