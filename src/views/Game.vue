<template>
    <!--nabbar-->
    <header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid d-flex justify-content-between align-items-center">
    
                <button class="btn btn-logout" @click="LogOut()">
                    <i class="bi bi-box-arrow-right me-2"></i>Salir
                </button>

                <h1 class="navbar-brand game-title text-white" href="#">Juego del Ahorcado</h1>
    
                <button class="btn btn-settings" @click="Config()">
                    <i class="bi bi-gear-fill me-2"></i>Ajustes
                </button>
    
            </div>
        </nav>

    </header>

    <section class="container-fluid py-4">
        <div class="row">
            <!--zona principal del juego -->
            <div class="col-lg-8 mb-4">
                <div class="game-container card shadow-lg">
                    <div class="card-body">
                        <!--imagen del ahorcado, falta haer un arrya de imagenes -->
                        <div class="hangman-image-container text-center mb-4">
                            <img src="@/assets/img/image.png" alt="Ahorcado" class="hangman-image img-fluid" />
                        </div>

                        <!--palabra a adivinar -->
                        <div class="word-container text-center mb-5">
                            <div class="letter-spaces d-flex justify-content-center">
                                <div class="letter-space mx-2" v-for="n in 7" :key="n">
                                    <span class="letter-placeholder"></span>
                                </div>
                            </div>
                        </div>

                        <!--teclado -->
                        <div class="keyboard-container text-center">

                            <div class="row justify-content-center g-1">
                                <div class="col-auto" v-for="letter in 'ABCDEFGHIJ'" :key="letter">
                                    <button class="key-button">{{ letter }}</button>
                                </div>
                            </div>

                            <div class="row justify-content-center g-1 mt-2">
                                <div class="col-auto" v-for="letter in 'KLMNÑOPQRS'" :key="letter">
                                    <button class="key-button">{{ letter }}</button>
                                </div>
                            </div>

                            <div class="row justify-content-center g-1 mt-2">
                                <div class="col-auto" v-for="letter in 'TUVWXYZ'" :key="letter">
                                    <button class="key-button">{{ letter }}</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- lateral de puntajes -->
            <div class="col-lg-4">
                <div class="leaderboard-container card shadow-lg">
                    <div class="card-header text-center">
                        <h3 class="mb-0">
                            <i class="bi bi-trophy-fill"></i>
                            Ranking
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <span class="badge rounded-pill me-2 rank-badge rank-1">1</span>
                                    <span>JugadorPro</span>
                                </div>
                                <span class="badge bg-primary rounded-pill">8500</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <span class="badge rounded-pill me-2 rank-badge rank-2">2</span>
                                    <span>AdivinaPalabras</span>
                                </div>
                                <span class="badge bg-primary rounded-pill">7200</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <span class="badge rounded-pill me-2 rank-badge rank-3">3</span>
                                    <span>LetraMaestra</span>
                                </div>
                                <span class="badge bg-primary rounded-pill">6800</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <span class="badge rounded-pill me-2 rank-badge out-rack">4</span>
                                    <span>PalabraSecreta</span>
                                </div>
                                <span class="badge bg-primary rounded-pill">5400</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <span class="badge rounded-pill me-2 rank-badge out-rack">5</span>
                                    <span>AhorcadoMaster</span>
                                </div>
                                <span class="badge bg-primary rounded-pill">4900</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <span class="badge rounded-pill me-2 rank-badge out-rack">6</span>
                                    <span>SuperGamer</span>
                                </div>
                                <span class="badge bg-primary rounded-pill">3750</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <span class="badge rounded-pill me-2 rank-badge out-rack">7</span>
                                    <span>GanadorLetras</span>
                                </div>
                                <span class="badge bg-primary rounded-pill">3200</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <span class="badge rounded-pill me-2 rank-badge out-rack">8</span>
                                    <span>AdivinaTodo</span>
                                </div>
                                <span class="badge bg-primary rounded-pill">2900</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <span class="badge rounded-pill me-2 rank-badge out-rack">9</span>
                                    <span>MasterWord</span>
                                </div>
                                <span class="badge bg-primary rounded-pill">2500</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <span class="badge rounded-pill me-2 rank-badge out-rack">10</span>
                                    <span>SalvadoDelAhorcado</span>
                                </div>
                                <span class="badge bg-primary rounded-pill">2100</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>



</template>

<script>
export default {
    name: 'GameView',
    data() {
        return {
            palabra: 'AHORCADO',
            
        }
    },
    methods: {
        Config() {
            this.$router.push("/admin");
        },

        LogOut() {
            this.$router.push("/login");
        }
        
    }
}
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

.leaderboard-container {
    border-radius: 15px;
    overflow: hidden;
    border: none;
}

.card-header {
    background-color: #9BC53D;
    color: #000000;

    padding: 15px;
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
    /*sombra sutil */
    transition: all 0.2s ease-in-out;
}

.key-button:hover {
    background-color: #B0B0B0;
    transform: translateY(-2px);
}




.rank-badge {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #D9D9D9;
    color: #000;
    font-weight: bold;
}

.rank-1 {
    background-color: #FDE74C;
    color: #000;
}

.rank-2 {
    background-color: #D9D9D9;
    color: #000;
}

.rank-3 {
    background-color: #FA7921;
    color: white;
}

.out-rack {
    background-color: #F0F0F0;
    color: #000;
}

.list-group-item {

    padding: 12px 15px;
}

.badge.bg-primary {
    background-color: #58C0EB !important;
    font-size: 14px;
    padding: 6px 10px;
}

@media (max-width: 768px) {
    .letter-space {
        width: 30px;
        height: 30px;
        font-size: 18px;
    }

    .key-button {
        padding: 8px 0;
        font-size: 14px;
    }
}
</style>