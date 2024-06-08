<script setup lang="ts">
import { Note } from "../models/Note";
import { ref, onMounted, watch } from "vue";

const notes = ref<Note[]>([]);
const noteTitle = ref("");
const noteContent = ref("");
const selectedNote = ref<Note>(new Note("", ""));

onMounted(() => {
  const savedNotes = localStorage.getItem("notes");
  if (savedNotes) {
    notes.value = JSON.parse(savedNotes);
  }
});

watch(
  notes,
  (newNotes) => {
    localStorage.setItem("notes", JSON.stringify(newNotes));
  },
  { deep: true }
);

const emptyNote = new Note("", "");

const handleSave = () => {
  console.log("selectedNote:", selectedNote.value);
  if (!selectedNote.value || selectedNote.value === emptyNote) {
    addNote();
  } else {
    editNote();
  }
};

const addNote = () => {
  notes.value.push(new Note(noteTitle.value, noteContent.value));
  resetForm();
};

const editNote = () => {
  if (selectedNote.value !== emptyNote) {
    selectedNote.value.title = noteTitle.value;
    selectedNote.value.content = noteContent.value;
    resetForm();
  }
};

const resetForm = () => {
  noteTitle.value = "";
  noteContent.value = "";
  selectedNote.value = emptyNote;
};

const selectNote = (note: Note) => {
  if (note) {
    console.log("Selected note:", note);
    selectedNote.value = note;
    noteTitle.value = note.title;
    noteContent.value = note.content;
  }
};

const saveNote = () => {
  handleSave();
};

const toggleNote = (note: Note) => {
  if (selectedNote.value !== emptyNote) {
    note.done = !note.done;
  }
};

const removeNote = (note: Note) => {
  if (selectedNote.value !== emptyNote) {
    notes.value = notes.value.filter((n) => n !== note);
    if (selectedNote.value === note) {
      resetForm();
    }
  }
};

const resetSelectedNote = () => {
  resetForm();
};
</script>

<template>
  <div class="container">
    <h2>Anteckningar</h2>

    <div>
      <ul class="note-list">
        <li v-for="note in notes" :key="note.id" class="note-item">
          <div class="note-title" @click="selectNote(note)">
            <h3>{{ note.title }}</h3>
          </div>
        </li>
      </ul>
    </div>

    <div class="input-container">
      <input
        type="text"
        v-model="noteTitle"
        placeholder="Titel"
        class="note-title-input"
      />
      <textarea
        v-model="noteContent"
        placeholder="Innehåll"
        class="note-content-input"
      ></textarea>
      <button @click="handleSave" class="save-button">Spara</button>
    </div>

    <div v-if="selectedNote.title !== emptyNote.title || selectedNote.content !== emptyNote.content" class="note-content">
      <h3 :class="selectedNote.done ? 'done' : ''">
        {{ selectedNote.title }}
        <span v-if="selectedNote.done" class="done-indicator"> - Klar</span>
      </h3>
      <p :class="selectedNote.done ? 'done' : ''">{{ selectedNote.content }}</p>

      <div v-if="selectedNote !== emptyNote" class="button-container">
        <button @click="() => toggleNote(selectedNote)" class="change-button">
          Ändra status
        </button>
        <button @click="() => removeNote(selectedNote)" class="delete-button">
          Radera
        </button>
        <button @click="resetSelectedNote" class="back-button">Tillbaka</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  border-bottom: 10px double darkcyan;
  color: darkcyan;
  margin-bottom: 10px;
}

.container {
  padding: 10px;
  margin: 0 auto;
  width: 380px;
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.note-title-input,
.note-content-input {
  border: 2px solid darkcyan;
  border-radius: 5px;
  font-size: 16px;
  padding: 10px;
  margin-bottom: 10px;
  outline: none;
}

.note-title-input:focus,
.note-content-input:focus {
  outline: 2px solid turquoise;
}
.save-button {
  background-color: darkcyan;
  color: white;
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 15px;
  border: none;
  border-radius: 5px;
  transition: box-shadow 0.3s ease;
}

.save-button:hover {
  background-color: white;
  color: darkcyan;
  box-shadow: 0 0 20px darkcyan;
}

.note-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

li.note-item {
  padding: 0;
  margin-bottom: 2px;
  cursor: pointer;
}

.note-title {
  color: darkcyan;
  font-weight: bold;
  font-size: 14px;
  margin: 0;
}
.note-content {
  border: 1px dotted darkcyan;
  padding: 10px;
}

.note-content h3 {
  color: darkcyan;
  font-weight: bold;
  font-size: 20px;
  margin: 0;
}

.note-content p {
  margin: 5px 0 0 0;
  font-size: 16px;
}

.button-container {
  display: flex;
  gap: 15px;
  justify-content: space-around;
  margin-top: 15px;
  margin-bottom: 15px;
}

.change-button {
  background-color: darkblue;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
}

.change-button:hover {
  background-color: white;
  box-shadow: 0 0 20px darkblue;
  color: darkblue;
}

.delete-button {
  background-color: darkred;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
}

.delete-button:hover {
  background-color: white;
  box-shadow: 0 0 20px darkred;
  color: darkred;
}
.back-button {
  background-color: darkcyan;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
}

.back-button:hover {
  background-color: white;
  box-shadow: 0 0 20px darkcyan;
  color: darkcyan;
}

p.done {
  color: slategray;
  font-style: italic;
}

.done-indicator {
  font-weight: bold;
  color: red;
  text-decoration: solid;
  margin-left: 5px;
}
</style>
