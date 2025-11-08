import { Language } from "./types";

export const AVAILABLE_LANGUAGES: Language[] = [
    { code: 'kn', name: 'Kannada' }, // Prioritized
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
];

export const ASL_ALPHABET: { [key: string]: string } = {
    'A': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Sign_language_A.svg',
    'B': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sign_language_B.svg',
    'C': 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Sign_language_C.svg',
    'D': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Sign_language_D.svg',
    'E': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Sign_language_E.svg',
    'F': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Sign_language_F.svg',
    'G': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Sign_language_G.svg',
    'H': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Sign_language_H.svg',
    'I': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Sign_language_I.svg',
    'J': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Sign_language_J.svg',
    'K': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Sign_language_K.svg',
    'L': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Sign_language_L.svg',
    'M': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Sign_language_M.svg',
    'N': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Sign_language_N.svg',
    'O': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Sign_language_O.svg',
    'P': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Sign_language_P.svg',
    'Q': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Sign_language_Q.svg',
    'R': 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Sign_language_R.svg',
    'S': 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Sign_language_S.svg',
    'T': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Sign_language_T.svg',
    'U': 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Sign_language_U.svg',
    'V': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Sign_language_V.svg',
    'W': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sign_language_W.svg',
    'X': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Sign_language_X.svg',
    'Y': 'https://upload.wikimedia.org/wikipedia/commons/1/18/Sign_language_Y.svg',
    'Z': 'https://upload.wikimedia.org/wikipedia/commons/5/58/Sign_language_Z.svg',
};

export const MOCKED_SIGNS = ['Hello', 'Thank you', 'I love you', 'Yes', 'No', 'Help'];