<template>
    <div class="leaderboard-container card shadow-lg">
        <div class="card-header text-center">
            <h3 class="mb-0">
                <i class="bi bi-trophy-fill">Ranking</i>
            </h3>
        </div>
        <div class="card-body p-0">
            <ul class="list-group list-group-flush">
                <li v-for="(player, index) in players" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <span class="badge rounded-pill me-2 rank-badge" :class="getRankClass(index + 1)">{{ index + 1 }}</span>
                        <span>{{ player.name }}</span>
                    </div>
                    <span class="badge bg-primary rounded-pill">{{ player.score }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "Ranking",
    data() {
        return {
            players: [
                { name: "JugadorPro", score: 8500 },
                { name: "AdivinaPalabras", score: 7200 },
                { name: "LetraMaestra", score: 6800 },
                { name: "PalabraSecreta", score: 5400 },
                { name: "AhorcadoMaster", score: 4900 },
                { name: "SuperGamer", score: 3750 },
                { name: "GanadorLetras", score: 3200 },
                { name: "AdivinaTodo", score: 2900 },
                { name: "MasterWord", score: 2500 },
                { name: "SalvadoDelAhorcado", score: 2100 }
            ]
        };
    },
    methods: {
        getRankClass(rank) {
            return rank <= 3 ? `rank-${rank}` : "out-rank";
        }
    }
};
</script>

<style scoped>
.rank-1 {
    background-color: gold;
    color: black;
}
.rank-2 {
    background-color: silver;
    color: black;
}
.rank-3 {
    background-color: #cd7f32; /* Bronce */
    color: black;
}
.out-rank {
    background-color: gray;
    color: white;
}
</style>