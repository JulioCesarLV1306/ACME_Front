const API_BASE_URL = 'http://localhost:8080/api/materials'; // Cambia esto a tu endpoint

// Referencias a los elementos del DOM
const materialForm = document.getElementById('materialForm');
const materialsTable = document.getElementById('materialsTable');
const materialIdField = document.getElementById('materialId');

// Función para cargar los materiales desde la API
async function loadMaterials() {
  try {
    const response = await fetch(API_BASE_URL);
    const materials = await response.json();
    renderMaterials(materials);
  } catch (error) {
    console.error('Error al cargar los materiales:', error);
  }
}

// Función para agregar o actualizar un material
async function saveMaterial(material) {
  const method = material.id ? 'PUT' : 'POST';
  const url = material.id ? `${API_BASE_URL}/${material.id}` : API_BASE_URL;

  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(material),
    });
    loadMaterials();
  } catch (error) {
    console.error('Error al guardar el material:', error);
  }
}

// Función para eliminar un material
async function deleteMaterial(id) {
  try {
    await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    loadMaterials();
  } catch (error) {
    console.error('Error al eliminar el material:', error);
  }
}

// Función para renderizar los materiales en la tabla
function renderMaterials(materials) {
  materialsTable.innerHTML = ''; // Limpiar tabla
  materials.forEach((material) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border border-gray-300 px-4 py-2">${material.id}</td>
      <td class="border border-gray-300 px-4 py-2">${material.nombre}</td>
      <td class="border border-gray-300 px-4 py-2">${material.descripcion}</td>
      <td class="border border-gray-300 px-4 py-2">${material.codcorrelativo || ''}</td>
      <td class="border border-gray-300 px-4 py-2">${material.observacion || ''}</td>
      <td class="border border-gray-300 px-4 py-2">${material.fecha_creacion || ''}</td>
      <td class="border border-gray-300 px-4 py-2">${material.estado}</td>
      <td class="border border-gray-300 px-4 py-2">
        <button
          class="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
          onclick="editMaterial(${material.id}, '${material.nombre}', '${material.descripcion}', '${material.codcorrelativo}', '${material.observacion}', '${material.fecha_creacion}', '${material.estado}')"
        >
          Editar
        </button>
        <button
          class="px-2 py-1 bg-red-600 text-white rounded"
          onclick="deleteMaterial(${material.id})"
        >
          Eliminar
        </button>
      </td>
    `;
    materialsTable.appendChild(row);
  });
}

// Función para preparar el formulario para editar un material
function editMaterial(id, nombre, descripcion, codcorrelativo, observacion, fecha_creacion, estado) {
  materialIdField.value = id;
  document.getElementById('nombre').value = nombre;
  document.getElementById('descripcion').value = descripcion;
  document.getElementById('codcorrelativo').value = codcorrelativo;
  document.getElementById('observacion').value = observacion;
  document.getElementById('fecha_creacion').value = fecha_creacion;
  document.getElementById('estado').value = estado;
}

// Manejar el envío del formulario
materialForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = materialIdField.value || null;
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const codcorrelativo = document.getElementById('codcorrelativo').value;
  const observacion = document.getElementById('observacion').value;
  const fecha_creacion = document.getElementById('fecha_creacion').value;
  const estado = document.getElementById('estado').value;

  const material = { id, nombre, descripcion, codcorrelativo, observacion, fecha_creacion, estado };
  saveMaterial(material);

  // Limpiar el formulario
  materialForm.reset();
  materialIdField.value = '';
});

// Cargar materiales al inicio
loadMaterials();

// Modal handling
const modal = document.getElementById('modal');
const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');

openModalButton.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

closeModalButton.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Evitar cierre de modal al hacer clic dentro de la ventana
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
});
