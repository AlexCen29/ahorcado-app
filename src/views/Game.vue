<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid d-flex justify-content-between align-items-center">
                <button class="btn btn-logout" @click="LogOut()">
                    <i class="bi bi-box-arrow-right me-2"></i>Salir
                </button>

                <h1 class="navbar-brand game-title text-white">Juego del Ahorcado</h1>

                <button class="btn btn-settings" @click="Config()">
                    <i class="bi bi-gear-fill me-2"></i>Ajustes
                </button>
            </div>
        </nav>
    </header>

    <section class="container-fluid py-4">
        <div class="row">
            <div class="col-lg-8 mb-4">
                <div class="game-container card shadow-lg">
                    <div class="card-body">
                        <div class="hangman-image-container text-center mb-4">
                            <img src="@/assets/img/image.png" alt="Ahorcado" class="hangman-image img-fluid" />
                        </div>

                        <div class="word-container text-center mb-5">
                            <div class="letter-spaces d-flex justify-content-center">
                                <div class="letter-space mx-2" v-for="n in 7" :key="n">
                                    <span class="letter-placeholder"></span>
                                </div>
                            </div>
                        </div>

                        <div class="keyboard-container text-center">
                            <div class="row justify-content-center g-1">
                                <div class="col-auto" v-for="letter in 'QWERTYUIOP'" :key="letter">
                                    <button class="key-button">{{ letter }}</button>
                                </div>
                            </div>

                            <div class="row justify-content-center g-1 mt-2">
                                <div class="col-auto" v-for="letter in 'ASDFGHJKLÑ'" :key="letter">
                                    <button class="key-button">{{ letter }}</button>
                                </div>
                            </div>

                            <div class="row justify-content-center g-1 mt-2">
                                <div class="col-auto" v-for="letter in 'ZXCVBNM'" :key="letter">
                                    <button class="key-button">{{ letter }}</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <Ranking />
            </div>
        </div>
    </section>
</template>

<script>
import Ranking from "@/components/Ranking.vue";

export default {
    name: "GameView",
    components: {
        Ranking
    },
    methods: {
        Config() {
            this.$router.push("/admin");
        },
        LogOut() {
            this.$router.push("/login");
        }
    }
};
</script>

<style scoped>
.game-title {
    font-size: 32px;
    font-weight: bold;
    color: #000000;
}

.navbar {
    background-color: #FA7921 !important;
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