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
                    <button class="btn btn-settings ms-2" @click="Config">
                        <i class="bi bi-gear-fill me-2"></i>Ajustes
                    </button>
                </div>
            </div>
        </nav>
    </header>

    <section class="container-fluid py-4">
        <div class="row">
            <div class="col-lg-8 mb-4">
                <div v-if="!difficultySelected" class="card shadow-lg difficulty-selector">
                    <div class="card-body text-center">
                        <h2 class="card-title mb-4">Selecciona la Dificultad</h2>
                        <p class="mb-4">Elige el nivel de dificultad para comenzar el juego</p>
                        <div class="row justify-content-center g-4">
                            <div class="col-md-4">
                                <button @click="selectDifficulty('easy')" class="btn-difficulty btn-easy">
                                    <i class="bi bi-emoji-expressionless me-2"></i> Fácil
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button @click="selectDifficulty('medium')" class="btn-difficulty btn-medium">
                                    <i class="bi bi-emoji-astonished me-2"></i> Medio
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button @click="selectDifficulty('hard')" class="btn-difficulty btn-hard">
                                    <i class="bi bi-emoji-angry me-2"></i> Difícil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="game-container card shadow-lg">
                    <div class="card-body">
                        <div class="hangman-image-container text-center mb-4">
                            <img :src="hangmanImage" alt="Ahorcado" class="hangman-image img-fluid" />
                        </div>
                        <div v-if="gameOver">
                            <dialog open>
                                <p>{{ message }}</p>
                                <button class="btn btn-primary mt-2" @click="resetGame">Reiniciar Juego</button>
                            </dialog>
                        </div>
                        <div class="word-container text-center mb-5">
                            <div class="letter-spaces d-flex justify-content-center">
                                <div class="letter-space mx-2" v-for="(letter, index) in wordArray" :key="index">
                                    <span class="letter-placeholder">{{ guessedLetters.includes(letter) ? letter : '' }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="keyboard-container text-center">
                            <div v-for="(row, rowIndex) in keyboard" :key="rowIndex" class="row justify-content-center g-1">
                                <div class="col-auto" v-for="letter in row" :key="letter">
                                    <button class="key-button" :class="{ 'correct': guessedLetters.includes(letter), 'incorrect': incorrectLetters.includes(letter) }"
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
            <div class="col-lg-4">
                <Ranking />
            </div>
        </div>
    </section>
</template>

<script setup>
import Ranking from '@/components/Ranking.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const incorrectLetters = ref([]);
const words = ref({
    easy: ["VUE", "CSS", "HTML", "PHP", "SASS"],
    medium: ["JAVASCRIPT", "LARAVEL", "PYTHON", "MYSQL"],
    hard: ["TYPESCRIPT", "TAILWINDCSS", "BOOTSTRAP"]
});
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

const difficultyText = computed(() => {
    return difficulty.value === 'easy' ? 'Fácil' : difficulty.value === 'medium' ? 'Medio' : 'Difícil';
});
const difficultyClass = computed(() => {
    return difficulty.value === 'easy' ? 'badge-easy' : difficulty.value === 'medium' ? 'badge-medium' : 'badge-hard';
});
const hangmanImage = computed(() => new URL(`/src/assets/img/ahorcado${mistakes.value}.png`, import.meta.url).href);

const Config = () => router.push("/admin");
const LogOut = () => {
    localStorage.removeItem('authToken');
    router.push("/login");
};

const selectLetter = (letter) => {
    if (gameOver.value || selectedLetters.value.includes(letter)) return;
    selectedLetters.value.push(letter);
    if (wordArray.value.includes(letter)) {
        guessedLetters.value.push(letter);
    } else {
        mistakes.value++;
        incorrectLetters.value.push(letter);
    }
    checkGameStatus();
};

const checkGameStatus = () => {
    if (mistakes.value >= maxMistakes.value) {
        gameOver.value = true;
        message.value = `¡Perdiste! La palabra era "${selectedWord.value}"`;
    } else if (wordArray.value.every(letter => guessedLetters.value.includes(letter))) {
        gameOver.value = true;
        message.value = "Felicidades, ¡Ganaste! 🎉";
    }
};

const selectDifficulty = (level) => {
    difficulty.value = level;
    difficultySelected.value = true;
    resetGame();
};

const resetGame = () => {
    selectedWord.value = words.value[difficulty.value][Math.floor(Math.random() * words.value[difficulty.value].length)];
    wordArray.value = selectedWord.value.split("");
    guessedLetters.value = [];
    selectedLetters.value = [];
    incorrectLetters.value = [];
    mistakes.value = 0;
    gameOver.value = false;
    message.value = "";
};

onMounted(() =>{});
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

.key-button.incorrect{
    background-color: #E74C3C !important;
    border: none;
}

.key-button.correct{
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