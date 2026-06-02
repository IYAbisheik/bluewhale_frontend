export const validPassword = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*)(?!.* ).{8,16}$');

export const validNames = new RegExp('[^a-zA-Z]');

export const validUsername = new RegExp('[^a-z0-9]')