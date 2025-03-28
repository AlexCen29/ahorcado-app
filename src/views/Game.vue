<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid d-flex justify-content-between align-items-center">
                <button class="btn btn-logout" @click="LogOut">
                    <i class="bi bi-box-arrow-right me-2"></i>Salir
                </button>

                <h1 class="navbar-brand game-title text-white">Juego del Ahorcado</h1>

                <div class="d-flex align-items-center">
                    <span v-if="difficultySelected" class="difficulty-badge" :class="difficultyClass">
                        {{ difficultyText }}
                    </span>
                    <button v-if="isAdmin && !isGuest" class="btn btn-settings ms-2" @click="Config">
                        <i class="bi bi-gear-fill me-2"></i>Ajustes
                    </button>
                </div>
            </div>
        </nav>
    </header>

    <section class="container-fluid py-4">
        <div class="row">
            <div class="col-lg-8 mb-4">
                <div v-if="!isGuest && !difficultySelected" class="card shadow-lg difficulty-selector">
                    <div class="card-body text-center">
                        <h2 class="card-title mb-4">Selecciona la Dificultad</h2>
                        <p class="mb-4">Elige el nivel de dificultad para comenzar el juego</p>
                        <div class="row justify-content-center g-4">
                            <div class="col-md-4">
                                <button @click="selectDifficulty('FACIL')" class="btn-difficulty btn-easy">
                                    <i class="bi bi-emoji-expressionless me-2"></i> Fácil
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button @click="selectDifficulty('MEDIO')" class="btn-difficulty btn-medium">
                                    <i class="bi bi-emoji-astonished me-2"></i> Medio
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button @click="selectDifficulty('DIFICIL')" class="btn-difficulty btn-hard">
                                    <i class="bi bi-emoji-dizzy me-2"></i> Difícil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="game-container card shadow-lg">
                    <div class="card-body">
                        <div v-if="isLoadingWords" class="loading-container">
                            <LoadingComponent />
                        </div>
                        <div v-else>
                            <div class="hangman-image-container text-center mb-4">
                                <img :src="hangmanImage" alt="Ahorcado" class="hangman-image img-fluid" />
                            </div>
                            <div v-if="gameOver">
                                <dialog open>
                                    <p>{{ message }}</p>
                                    <button class="btn btn-primary mt-2" @click="resetGame">Reiniciar Juego</button>
                                    <button v-if="!isGuest" class="btn btn-secondary mt-2" @click="resetDifficulty">Cambiar Dificultad</button>
                                </dialog>
                            </div>
                            <div class="word-container text-center mb-5">
                                <div class="letter-spaces d-flex justify-content-center">
                                    <div class="letter-space mx-2" v-for="(letter, index) in wordArray" :key="index">
                                        <span class="letter-placeholder">{{ guessedLetters.includes(letter) ? letter :
                                            ''
                                            }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="keyboard-container text-center">
                                <div v-for="(row, rowIndex) in keyboard" :key="rowIndex"
                                    class="row justify-content-center g-1">
                                    <div class="col-auto" v-for="letter in row" :key="letter">
                                        <button class="key-button"
                                            :class="{ 'correct': guessedLetters.includes(letter), 'incorrect': incorrectLetters.includes(letter) }"
                                            :disabled="selectedLetters.includes(letter)" @click="selectLetter(letter)">
                                            {{ letter }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <!-- <div v-if="gameOver" class="text-center mt-4">
                            <h2>{{ message }}</h2>
                            <button class="btn btn-primary mt-2" @click="resetGame">Reiniciar Juego</button>
                        </div> -->
                        </div>

                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <Ranking ref="rankingComponent" :isGuest="isGuest" />
            </div>
        </div>
    </section>
</template>

<script setup>
import Ranking from '@/components/Ranking.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const isLoadingWords = ref(false);
const rankingComponent = ref(null);
const router = useRouter();
const incorrectLetters = ref([]);
const words = ref([]);
const selectedWord = ref("");
const wordArray = ref([]);
const guessedLetters = ref([]);
const selectedLetters = ref([]);
const mistakes = ref(0);
const maxMistakes = ref(6);
const gameOver = ref(false);
const message = ref("");
const difficultySelected = ref(false);
const difficulty = ref("");
const keyboard = ref(['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM']);
const isGuest = computed(() => router.currentRoute.value.meta.isGuest);
/*const score = ref(parseInt(sessionStorage.getItem('score')) || 0); // Inicializa la puntuación desde localStorage
const masAlto = ref(parseInt(sessionStorage.getItem('highscore')) || 0);*/
const user = JSON.parse(sessionStorage.getItem('authUser'));

const guestWords = [
    { word: 'GRATIS' },
    { word: 'MANGO' },
    { word: 'INICIAR' },
    { word: 'AHORCADO' },
    { word: 'SESION' }
];

const difficultyText = computed(() => {
    return difficulty.value === 'FACIL' ? 'Fácil' : difficulty.value === 'MEDIO' ? 'Medio' : 'Difícil';
});
const difficultyClass = computed(() => {
    return difficulty.value === 'FACIL' ? 'difficulty-easy' : difficulty.value === 'MEDIO' ? 'difficulty-medium' : 'difficulty-hard';
});
const hangmanImage = computed(() => new URL(`/src/assets/img/ahorcado${mistakes.value}.png`, import.meta.url).href);

const Config = () => router.push("/admin");
const LogOut = () => {
    const title = isGuest.value ? '¿Salir del modo invitado?' : '¿Cerrar sesión?';
    const text = isGuest.value 
        ? 'Estás a punto de salir del modo invitado.' 
        : 'Estás a punto de cerrar sesión.';
    
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: isGuest.value ? 'Sí, salir' : 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            if (!isGuest.value) {
                sessionStorage.removeItem('authToken');
            }
            router.push("/login");
        }
    });
};
/*const borrar = () => {
    sessionStorage.removeItem('score');
    score.value = 0;
};

const puntajeMasAlto = () => {
    const currentHighScore = parseInt(sessionStorage.getItem('highscore')) || 0;
    if (score.value > currentHighScore) {
        sessionStorage.setItem('highscore', score.value);
        masAlto.value = score.value; // Actualiza la referencia para reflejar el nuevo puntaje más alto
    }
};*/

const isAdmin = computed(() => {
    return user && user.rol === 'ADMIN';
});

const selectLetter = (letter) => {
    if (gameOver.value || selectedLetters.value.includes(letter)) return;

    selectedLetters.value.push(letter.toUpperCase()); // Convertimos a mayúscula para uniformidad

    if (wordArray.value.map(l => l.toUpperCase()).includes(letter.toUpperCase())) {
        guessedLetters.value.push(letter.toUpperCase());
    } else {
        mistakes.value++;
        incorrectLetters.value.push(letter.toUpperCase());
    }

    checkGameStatus();
};

const checkGameStatus = () => {
    if (mistakes.value >= maxMistakes.value) {
        gameOver.value = true;
        message.value = `¡Perdiste! La palabra era "${selectedWord.value}"`;
    } else if (wordArray.value.every(letter => guessedLetters.value.includes(letter.toUpperCase()))) {
        gameOver.value = true;
        message.value = "Felicidades, ¡Ganaste!";

        if (!isGuest.value) {
            const selectedWordObject = words.value.find(word => word.word.trim().toUpperCase() === selectedWord.value);
            if (selectedWordObject && mistakes.value !== undefined) {
                saveScore(user.userId, selectedWordObject.id, mistakes.value, maxMistakes.value);
            } else {
                console.error('Error: selectedWordObject o mistakes.value no son válidos');
            }
        }
    }
};

const saveScore = async (id, palabraId, intentosUsados, maxIntentos) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_WORD}register`, {
            userId: id,
            wordId: palabraId,
            attemptsMade: intentosUsados+1, // Asegúrate de que esto tenga un valor válido
            maximumNumberAttempts: maxIntentos
        }, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Puntaje guardado exitosamente:', response.data);
        await rankingComponent.value.fetchPlayers();
    } catch (error) {
        if (error.response) {
            console.error('Error en la respuesta del servidor:', error.response.data);
            console.error('Código de estado:', error.response.status);
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
        } else {
            console.error('Error al configurar la solicitud:', error.message);
        }
    }
};

const selectDifficulty = async (level) => {
    if (isGuest.value) {
        resetGame(); // Llama directamente a resetGame para el modo invitado
        return;
    }

    difficulty.value = level;
    difficultySelected.value = true;
    await fetcheo(level); // Recupera palabras de la base de datos si no es invitado
    if (words.value && words.value.length > 0) {
        resetGame();
    } else {
        console.error('No se encontraron palabras para la dificultad seleccionada.');
    }
};

const fetcheo = async (dificultad) => {
    try {
        isLoadingWords.value = true;
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }

        console.log(`Fetching words for difficulty: ${dificultad}`);
        const response = await axios.get(import.meta.env.VITE_API_URL_GAME + dificultad, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response data:', response.data);
        words.value = response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {
            if (error.response.status === 400) {
                console.error('Solicitud incorrecta. Verifica los parámetros y la URL.');
            } else if (error.response.status === 401) {
                console.error('No autorizado. Verifica tu token de autenticación.');
            } else {
                console.error(`Error ${error.response.status}: ${error.response.statusText}`);
            }
        } else {
            console.error('Error en la solicitud:', error.message);
        }
    }
    finally {
        isLoadingWords.value = false;
    }
};

const resetGame = () => {
    const wordSource = isGuest.value ? guestWords : words.value; // Selecciona las palabras según el modo

    if (!wordSource || wordSource.length === 0) {
        console.error('No se encontraron palabras.');
        return;
    }

    const selectedWordObject = wordSource[Math.floor(Math.random() * wordSource.length)]; // Selecciona una palabra aleatoria
    selectedWord.value = selectedWordObject.word.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliza y elimina acentos
    wordArray.value = selectedWord.value.split(""); // Convierte la palabra en un array de letras

    guessedLetters.value = [];
    selectedLetters.value = [];
    incorrectLetters.value = [];
    mistakes.value = 0;
    gameOver.value = false;
    message.value = "";
};

const resetDifficulty = () => {
    difficultySelected.value = false;
    resetGame();
};

onMounted(() => {
    if (isGuest.value) {
        resetGame(); // Inicia el juego automáticamente en modo invitado
    }
});
</script>

<style scoped>
dialog {
    width: 50%;
    max-width: 500px;
    padding: 30px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
}

dialog p {
    font-size: 18px;
    margin-bottom: 20px;
}

dialog .btn {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    border: none;
    background-color: #4cae4c;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

dialog .btn:hover {
    background-color: #4cae4c;
}

.key-button.incorrect {
    background-color: #E74C3C !important;
    border: none;
}

.key-button.correct {
    background-color: #5cb85c !important;
    border: none;
}

.game-title {
    font-size: 32px;
    font-weight: bold;
    color: #000000;
}

.navbar {
    background-color: #FA7921 !important;
}

.difficulty-selector {
    background-color: #FDE74C;
    border-radius: 15px;
    border: none;
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.btn-difficulty {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    transition: all 0.3s ease;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-easy {
    background-color: #5cb85c;
}

.btn-medium {
    background-color: #FA7921;
}

.btn-hard {
    background-color: #E74C3C;
}

.btn-difficulty:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

.difficulty-badge {
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: bold;
    display: flex;
    align-items: center;
    font-size: 18px;
}

.difficulty-easy {
    background-color: #5cb85c;
    color: white;
}

.difficulty-medium {
    background-color: #FDE74C;
    color: black;
}

.difficulty-hard {
    background-color: #E74C3C;
    color: white;
}

.btn-settings {
    background-color: #58C0EB;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: bold;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
}

.btn-settings:hover {
    background-color: #4BA3CE;
    transform: translateY(-2px);
}

.btn-logout {
    background-color: #E74C3C;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: bold;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
}

.btn-logout:hover {
    background-color: #C0392B;
    transform: translateY(-2px);
}

.game-container {
    border-radius: 15px;
    background-color: #FDE74C;
    border: none;
}

.hangman-image {
    max-height: 250px;
    margin: 0 auto;
}

.letter-spaces {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.letter-space {
    width: 40px;
    height: 40px;
    border-bottom: 3px solid #000;
    margin: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
}

.key-button {
    background-color: #D9D9D9;
    color: #000000;
    border: 2px solid #B0B0B0;
    border-radius: 8px;
    padding: 10px 0;
    width: 55px;
    height: 55px;
    font-size: 20px !important;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease-in-out;
}

.key-button:hover {
    background-color: #B0B0B0;
    transform: translateY(-2px);
}
</style>