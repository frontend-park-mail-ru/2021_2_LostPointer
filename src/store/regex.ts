const PATH_SLASH = /\//g;
const VALID_EMAIL = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/g;
const SPECIAL_CHARS = /[@ !"#$%&'()*+,\-./:;<=>?[\\\]^_]/g;
const NUMBER = /[0-9]/g;
const LETTER = /[a-z]/g;
const UPPERCASE_LETTER = /[A-Z]/g;
const LETTERS_AND_NUMBERS = /[^a-zA-Z0-9]/g;

export {
    PATH_SLASH,
    VALID_EMAIL,
    SPECIAL_CHARS,
    NUMBER,
    LETTER,
    UPPERCASE_LETTER,
    LETTERS_AND_NUMBERS,
};
