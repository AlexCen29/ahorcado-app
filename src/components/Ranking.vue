<template>
    <div class="leaderboard-container card shadow-lg">
        <div class="card-header text-center">
            <h3 class="mb-0">
                <i class="bi bi-trophy-fill">Ranking</i>
            </h3>
        </div>
        <div class="card-body p-0">
            <div v-if="isGuest" class="text-center p-4">
                <p class="text-muted">Inicia sesión para ver el ranking, participar en el ranking y poder elegir dificultad.</p>
            </div>
            <ul v-else class="list-group list-group-flush">
                <li v-for="(player, index) in players" :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <span class="badge rounded-pill me-2 rank-badge" :class="getRankClass(index + 1)">{{ index + 1 }}</span>
                        <span>{{ player.nombre }}</span>
                        <span class="badge bg-primary rounded-pill ms-2">{{ player.totalPuntos }}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "Ranking",
    props: {
        isGuest: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            players: []
        };
    },
    methods: {
        getRankClass(rank) {
            return rank <= 3 ? `rank-${rank}` : "out-rank";
        },
        async fetchPlayers() {
            if (this.isGuest) return;
            try {
                const response = await axios.get(import.meta.env.VITE_API_WORD + 'rankingGeneral', {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Accede a la propiedad generalRanking
                if (Array.isArray(response.data.generalRanking)) {
                    this.players = response.data.generalRanking.sort((a, b) => b.totalPuntos - a.totalPuntos);
                } else {
                    console.error('La respuesta no contiene un array en generalRanking:', response.data);
                }
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        }
    },
    mounted() {
        this.fetchPlayers();
    }
};
</script>

<style scoped>
.card-header {
    background-color: #9BC53D !important;
}

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