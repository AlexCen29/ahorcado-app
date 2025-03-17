<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card border-0 shadow-lg">
                    <div class="card-header bg-warning text-white text-center p-4">
                        <h2 class="mb-0">¡Únete al Juego del Ahorcado!</h2>
                    </div>
                    <div class="card-body p-4">
                        <form>
                            <div class="mb-3">
                                <label for="newUsername" class="form-label">Nombre de Usuario</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light">
                                        <i class="bi bi-person-circle"></i>
                                    </span>
                                    <input type="text" class="form-control" id="newUsername"
                                        placeholder="Elige un nombre de usuario" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Correo Electrónico</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light">
                                        <i class="bi bi-envelope-fill"></i>
                                    </span>
                                    <input type="email" class="form-control" id="email" placeholder="tu@correo.com"
                                        required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="newPassword" class="form-label">Contraseña</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light">
                                        <i class="bi bi-lock-fill"></i>
                                    </span>
                                    <input type="password" class="form-control" id="newPassword"
                                        placeholder="Crea una contraseña" required>
                                </div>
                            </div>
                            
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-danger btn-lg">
                                    <i class="bi bi-person-check-fill me-2"></i>
                                    Registrarse
                                </button>
                            </div>
                        </form>
                        <div class="text-center mt-4">
                            <p class="mb-0">¿Ya tienes una cuenta?
                                <router-link to="/login" class="text-decoration-none fw-bold" style="color: #E55934;">
                                    Inicia sesión aquí
                                </router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RegisterView'
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

.btn-danger {
    background-color: #E55934 !important;
    border-color: #E55934 !important;
    
    font-weight: bold;
    transition: all 0.3s ease;
}

.btn-danger:hover {
    background-color: #D54824 !important;
    transform: scale(1.02);
}

.form-control,
.input-group-text {
    border-radius: 10px;
    
}

.form-control:focus {
    border-color: #FA7921;
    box-shadow: 0 0 0 0.25rem rgba(250, 121, 33, 0.25);
}

input::placeholder {
    
    font-style: italic;
    opacity: 0.7;
}

label {
    
    font-weight: bold;
}
</style>