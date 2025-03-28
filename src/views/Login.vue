<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card border-0 shadow-lg">
                    <div class="card-header bg-primary text-white text-center p-4">
                        <h2 class="mb-0">¡Bienvenido al Ahorcado!</h2>
                    </div>
                    <div class="card-body p-4">
                        <form @submit.prevent="handleSubmit">
                            <div class="mb-3">
                                <label for="username" class="form-label">Correo</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light">
                                        <i class="bi bi-person-circle"></i>
                                    </span>
                                    <input :disabled="isLoading" v-model="email" type="email" class="form-control" id="username"
                                        placeholder="Tu correo electronico" required>
                                </div>
                            </div>
                            <div class="mb-4">
                                <label for="password" class="form-label">Contraseña</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light">
                                        <i class="bi bi-lock-fill"></i>
                                    </span>
                                    <input :disabled="isLoading" v-model="password" type="password" class="form-control" id="password"
                                        placeholder="Tu contraseña" required>
                                </div>
                            </div>
                            <div class="d-grid gap-2">
                                <button :disabled="isLoading" type="submit" class="btn btn-success btn-lg">
                                    <i class="bi bi-box-arrow-in-right me-2"></i>
                                    Iniciar Sesión
                                </button>
                            </div>
                        </form>
                        <div class="text-center mt-4">
                            <p class="mb-0">¿No tienes una cuenta?
                                <router-link to="/register" class="text-decoration-none fw-bold"
                                    style="color: #E55934;">
                                    Regístrate aquí
                                </router-link>
                            </p>
                        </div>
                                                <div class="text-center">
                            <p class="mb-0">¿No quieres registrarte?
                                <button @click="enterAsGuest" class="btn btn-link text-decoration-none fw-bold" style="color: #E55934;">
                                    Entrar como invitado
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'LoginView',
    data() {
        return {
            //variable globales
            isLoading: false,
            //variables para el formulario de inicio de sesión
            email: '',
            password: ''
        }
    },
    methods:{

        async handleSubmit() {
            this.isLoading = true;
            try {
                console.log("Iniciando session de usuario...", import.meta.env.VITE_API_URL);
                //axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}login`,
                    {
                        email: this.email,
                        password: this.password,
                    },
                    //{ withCredentials: true, }
                );

                console.log(response);

                // Paso 3: Manejar la respuesta
                if (response.status === 200) {
                    sessionStorage.setItem('authToken', response.data.token);
                    sessionStorage.setItem('authUser', JSON.stringify(response.data.user));    
                    console.log(sessionStorage.getItem('authUser'));
                    this.$router.push("/game");
                } else {
                    throw new Error(response.data);
                }
            }  catch (error) {
                const errorMessage = error.response && error.response.data && error.response.data.error
                    ? error.response.data.error
                    : '¡Ha ocurrido un error al iniciar sesión! Por favor, intenta de nuevo.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error al iniciar sesión',
                    text: errorMessage,
                    confirmButtonColor: '#E55934',
                });
            }  finally {
                this.isLoading = false;
            }
            console.log("Datos de registro:", this.form);

        },

        enterAsGuest() {
        this.$router.push('/guest');
    }
    }
}
</script>

<style scoped>
.card {
    border-radius: 15px;
    overflow: hidden;
}

.card-header {
    background-color: #FA7921 !important;
    
}

.card-body {
    background-color: #FDE74C !important;
}

.btn-success {
    background-color: #E55934 !important;
    border-color: #E55934 !important;
    
    font-weight: bold;
    transition: all 0.3s ease;
}

.btn-success:hover {
    background-color: #E55934 !important;
    transform: scale(1.02);
}

.form-control,
.input-group-text {
    border-radius: 10px;
    
}

.form-control:focus {
    border-color: #9BC53D;
    box-shadow: 0 0 0 0.25rem rgba(155, 197, 61, 0.25);
}

input::placeholder {
    
    font-style: italic;
    opacity: 0.7;
}

label {
    
    font-weight: bold;
}
</style>