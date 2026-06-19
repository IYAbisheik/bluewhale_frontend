export const validPassword =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,16}$/;

export const validNames =
  /^(?=.{1,50}$)[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

export const validUsername =
  /^(?!_)[a-zA-Z0-9_]{3,20}(?<!_)$/;

export const validEmail =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;