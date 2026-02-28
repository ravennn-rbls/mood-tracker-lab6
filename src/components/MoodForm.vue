<script setup>
import { ref, onMounted } from 'vue';

// Your live Render URL
const API_BASE_URL = "https://mood-tracker-backend-1.onrender.com";

const name = ref("");
const mood = ref("");
const aiMessage = ref("");
const moods = ref([]);
const loading = ref(false);

// 1. Get Mood History (GET)
const fetchMoods = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/mood`);
    if (res.ok) {
      moods.ref = await res.json();
    }
  } catch (err) {
    console.error("Failed to load history:", err);
  }
};

// 2. Submit New Mood (POST)
const submitMood = async () => {
  if (!name.value || !mood.value) {
    alert("Please fill in both fields!");
    return;
  }

  loading.value = true;
  aiMessage.value = "";

  try {
    const res = await fetch(`${API_BASE_URL}/mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: name.value,
        mood_text: mood.value
      })
    });

    const data = await res.json();
    
    if (res.ok) {
      aiMessage.value = data.ai_message;
      // Clear inputs
      mood.value = "";
      // Refresh the history list
      await fetchMoods();
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error("Submission failed:", err);
    alert("Could not connect to the server. It might be 'sleeping' on Render—wait 30 seconds and try again.");
  } finally {
    loading.value = false;
  }
};

// Load history when the page opens
onMounted(fetchMoods);
</script>