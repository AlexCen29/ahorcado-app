<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <!-- Botón de regreso -->
        <button class="btn btn-back" @click="Return" :disabled="isLoading">
          <i class="bi bi-box-arrow-left me-2"></i>Regresar
        </button>

        <h1 class="navbar-brand admin-title text-white">Panel de Administrador</h1>

        <button class="btn btn-add" @click="showModal(false)" :disabled="isLoading">
          <i class="bi bi-plus-circle-fill me-2"></i>Nueva Palabra
        </button>
      </div>
    </nav>
  </header>

  <body>
    <div class="container-fluid py-4">
      <!-- Sección principal con buscador y tabla -->
      <div class="row">
        <div class="col-12 mb-4">
          <div class="admin-container card shadow-lg">
            <div class="card-body">
              <!-- Buscador -->
              <div class="row mb-4">
                <div class="col-md-6 col-lg-4">
                  <div class="input-group search-container">
                    <span class="input-group-text">
                      <i class="bi bi-search"></i>
                    </span>
                    <input type="text" v-model="quickFilterText" placeholder="Buscar..." class="form-control me-2"
                      @input="onQuickFilterChanged" />
                  </div>
                </div>
              </div>

              <!-- Tabla con ag-grid -->
              <div class="ag-theme-alpine" style="height: 600px; width: 100%;">
                <ag-grid-vue style="width: 100%; height: 380px;" :columnDefs="columnDefs" :rowData="rowData"
                  :quickFilterText="quickFilterText" :context="{ componentParent: this }" @grid-ready="onGridReady"
                  :localeText="localeText" @filterChanged="onFilterChanged" :loading="isLoading">
                </ag-grid-vue>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para agregar nueva palabra -->
      <div ref="modal" class="modal fade" id="newWordModal" tabindex="-1" aria-labelledby="newWordModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="newWordModalLabel"><span>{{ isEditing ? 'Editar palabra' : 'Crear palabra' }}</span></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="wordSubmit">
                <div class="mb-3">
                  <label for="word" class="form-label">Palabra</label>
                  <input type="text" class="form-control" id="word" v-model="form.word" required :disabled="isLoading">
                </div>
                <div class="mb-3">
                  <label for="difficulty" class="form-label">Dificultad</label>
                  <select class="form-select" id="difficulty" v-model="form.difficulty" required :disabled="isLoading">
                    <option value="FACIL">Fácil</option>
                    <option value="MEDIO">Media</option>
                    <option value="DIFICIL">Difícil</option>
                  </select>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn btn-add"><span>{{ isEditing ? 'Editar' : 'Guardar' }}</span></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  </body>
</template>

<script>
import { Modal } from 'bootstrap';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'AdminView',
  components: {
    'ag-grid-vue': AgGridVue,
  },
  data() {
    return {
      quickFilterText: '',
      isLoading: false,
      isEditing: false,
      form: {
        id: null,
        word: '',
        difficulty: 'FACIL'
      },
      localeText: {
        errorTabla: false,
        sinInformacion: '',
        rowData: [],
        originalRowData: [],
        noRowsToShow: 'No hay datos para mostrar'
      },
      columnDefs: [
        { headerName: "ID", field: "id", sortable: true, filter: false, width: 100 },
        { headerName: "Palabra", field: "word", sortable: true, filter: false, flex: 1 },
        {
          headerName: "Dificultad",
          field: "difficulty",
          sortable: true,
          filter: false,
          width: 150,
          cellRenderer: params => {
            let bgColor = '';
            let textColor = 'black';

            switch (params.value) {
              case 'FACIL':
                bgColor = '#9BC53D'; // Verde
                break;
              case 'MEDIO':
                bgColor = '#FDE74C'; // Amarillo
                break;
              case 'DIFICIL':
                bgColor = '#E55934'; // Rojo
                textColor = 'white';
                break;
              default:
                bgColor = '#D9D9D9'; // Gris por defecto
            }

            return `<div style="background-color: ${bgColor}; color: ${textColor}; padding: 5px 10px; border-radius: 16px; text-align: center; width: fit-content;">
                      ${params.value}
                    </div>`;
          }
        },
        {
          headerName: 'Acciones',
          field: 'acciones',
          width: 35,
          pinned: 'right',
          cellRenderer: function (params) {
            const button = document.createElement('button');
            button.className = 'btn btn-warning btn-sm';
            button.innerHTML = '✏️ Editar';

            // Acceder a la instancia del componente Vue
            const vueComponentInstance = params.context?.componentParent;

            if (!vueComponentInstance) {
              console.error('No se pudo acceder al componente Vue.');
              return button;
            }
            button.disabled = vueComponentInstance.isSubmitting;

            button.addEventListener('click', async function () {
              const clave = params.data.id;
              try {
                const result = await Swal.fire({
                  title: "Confirmación",
                  text: `¿Desea editar registro con ID: ${clave}?`,
                  icon: "warning",
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  showCancelButton: true,
                  confirmButtonText: 'Sí, continuar',
                });
                if (result.isConfirmed) {
                  await vueComponentInstance.editWord(clave);
                }
              } catch (error) {
                Swal.fire({
                  title: "Error",
                  text: error.message,
                  icon: "error",
                  confirmButtonColor: '#E55934',
                });
              }
              finally {
                vueComponentInstance.isLoading = false;
              }
            });

            return button;
          }
        }

      ],
      defaultColDef: {
        resizable: true
      },
      rowData: []
    };
  },
  methods: {
    showModal(editando) {
      if (!editando) {
        this.isEditing = false;
        this.form.id = null;
        this.form.word = '';
        this.form.difficulty = 'FACIL';
      }
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    onQuickFilterChanged() {
      this.gridApi.setQuickFilter(this.quickFilterText);
    },

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      params.api.sizeColumnsToFit();
    },

    Return() {
      this.$router.push("/game");
    },

    async wordSubmit() {
      this.isLoading = true;
      try {

        let response = this.isEditing ? await this.updateWord(this.form.id) : await this.createWord();

        await this.loadWorks();
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: response,
          confirmButtonColor: '#9BC53D',
        });
        // aquí podrías actualizar la tabla si es necesario

      } catch (error) {
        const errorMessage = error.response?.data?.error || '¡Error al crear la palabra!';
        Swal.fire({
          icon: 'error',
          title: 'Error11',
          text: errorMessage,
          confirmButtonColor: '#E55934',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async createWord() {
      const token = sessionStorage.getItem('authToken');
      const response = await axios.post(
        `${import.meta.env.VITE_API_WORD}/register`,
        {
          word: this.form.word,
          difficulty: this.form.difficulty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if (response.status !== 200) {
        const errorMessage = error.response?.data?.error || '¡Error al crear la palabra!';
        throw new Error(errorMessage);
      }

      return "¡Palabra creada correctamente!";
    },

    async updateWord(id) {
      const token = sessionStorage.getItem('authToken');
      const response = await axios.put(
        `${import.meta.env.VITE_API_WORD}/${id}`,
        {
          word: this.form.word,
          difficulty: this.form.difficulty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if (response.status !== 200) {
        const errorMessage = error.response?.data?.error || '¡Error al crear la palabra!';
        throw new Error(errorMessage);
      }

      return "¡Palabra creada correctamente!";
    },

    async editWord(clave) {
      this.isLoading = true;
      const token = sessionStorage.getItem('authToken');
      const response = await axios.get(`${import.meta.env.VITE_API_WORD}/${clave}`, {
        params: { clave: clave },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        this.form.id = response.data.id;
        this.form.word = response.data.word;
        this.form.difficulty = response.data.difficulty;
        this.isEditing = true;
        this.modal.show();
      } else {
        const errorMessage = error.response?.data?.error || '¡Error al recuperar la palabra!';
        throw new Error(errorMessage);
      }
    },

    async loadWorks() {
      try {
        const token = sessionStorage.getItem('authToken');

        const response = await axios.get(
          `${import.meta.env.VITE_API_WORD}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        if (response.status === 200) {
          this.rowData = response.data;
          this.originalRowData = [...response.data];
        } else {
          throw new Error(response.data);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || '¡Error al recuperar las palabras!';

      } finally {
        this.isLoading = false;
      }
    }
  },
  async mounted() {
    // const steps = 2;
    // const increment = 100 / steps;
    //await this.getListaMonedasTabla();
    // this.progress += increment;
    await this.loadWorks();
    // this.progress += increment;
    // this.loading = false;
    this.modal = new Modal(this.$refs.modal, {
      backdrop: 'static',
      keyboard: false
    });
  },
};
</script>

<style scoped>
.admin-title {
  font-size: 32px;
  font-weight: bold;
  color: #000000;
}

.admin-container {
  border-radius: 15px;
  background-color: white;
  border: none;
}

.search-container {
  margin-bottom: 20px;
}

.input-group-text {
  background-color: #58C0EB;
  color: white;
  border: none;
}

.form-control:focus,
.form-select:focus {
  border-color: #58C0EB;
  box-shadow: 0 0 0 0.25rem rgba(88, 192, 235, 0.25);
}

.btn-add {
  background-color: #9BC53D;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-add:hover {
  background-color: #8AB42D;
  transform: translateY(-2px);
}

.btn-cancel {
  background-color: #D9D9D9;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;

}

.btn-cancel:hover {
  background-color: #B9B9B9;
}

.btn-edit {
  background-color: #58C0EB;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-edit:hover {
  background-color: #4BA3CE;
  transform: translateY(-2px);
}

/* Personalización de ag-grid */
:deep(.ag-theme-alpine .ag-cell) {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Centrar texto en encabezados */
:deep(.ag-theme-alpine .ag-header-cell-label) {
  justify-content: center;
  text-align: center;
}

:deep(.ag-theme-alpine) {
  font-family: 'Roboto Serif', serif !important;
}


/* Modal styling */
.modal-content {
  border-radius: 15px;
  border: none;
}

.modal-header {
  background-color: #58C0EB;
  color: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding: 15px 20px;
}

.modal-title {

  font-weight: bold;
}

.modal-footer {
  border-top: none;
  padding: 15px 0px;
}

/* Form styling */
.form-label {

  font-weight: bold;
}

.form-control,
.form-select {
  border-radius: 8px;
  padding: 10px 15px;
  border: 1px solid #D9D9D9;
}

.navbar {
  background-color: #FA7921 !important;
}

.admin-title {
  font-size: 32px;
  font-weight: bold;
  color: #000000;
}

.btn-back {
  background-color: #dc3545;
  /* Rojo */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}
</style>