<script setup>
import { ref, onMounted } from 'vue';

// 1. POINT TO YOUR LIVE BACKEND
const API_URL = "https://mood-tracker-backend-1.onrender.com/mood";

// 2. REACTIVE STATE
const name = ref("");
const mood = ref("");
const aiMessage = ref("");
const moods = ref([]);
const loading = ref(false);

// 3. FETCH HISTORY FROM RAILWAY (via Render)
const fetchHistory = async () => {
  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      moods.value = await res.json();
    }
  } catch (err) {
    console.error("Could not load history:", err);
  }
};

// 4. SUBMIT MOOD AND GET AI RESPONSE
const submitMood = async () => {
  if (!name.value || !mood.value) return alert("Please enter your name and mood!");
  
  loading.value = true;
  aiMessage.value = ""; // Clear old message

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        full_name: name.value, 
        mood_text: mood.value 
      })
    });
    
    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    aiMessage.value = data.ai_message;
    
    // Refresh history and clear the mood input
    await fetchHistory();
    mood.value = ""; 
  } catch (err) {
    alert("The server is waking up! Please wait 30 seconds and try again.");
  } finally {
    loading.value = false;
  }
};

// Load history when the page opens
onMounted(fetchHistory);
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>✨ AI Mood Support</h1>
      <p class="subtitle">Share how you feel and get a supportive message.</p>

      <div class="input-group">
        <input v-model="name" placeholder="Enter your name" class="input-field" />
        <textarea v-model="mood" placeholder="How are you feeling today?" class="input-field"></textarea>
        <button @click="submitMood" :disabled="loading" class="submit-btn">
          {{ loading ? "Processing..." : "Get Support" }}
        </button>
      </div>

      <transition name="fade">
        <div v-if="aiMessage" class="ai-response">
          <strong>Advisor:</strong> {{ aiMessage }}
        </div>
      </transition>

      <hr />

      <h3>Recent Moods</h3>
      <div class="history-list">
        <div v-if="moods.length === 0" class="empty">No moods recorded yet.</div>
        <div v-for="m in moods" :key="m.id" class="history-item">
          <div class="history-header">
            <strong>{{ m.full_name }}</strong>
            <span class="date">{{ new Date(m.created_at).toLocaleDateString() }}</span>
          </div>
          <p class="history-text">"{{ m.mood_text }}"</p>
          <p class="history-ai"><em>AI: {{ m.ai_response }}</em></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { display: flex; justify-content: center; padding: 40px 20px; font-family: 'Segoe UI', sans-serif; background-color: #f0f2f5; min-height: 100vh; }
.card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 500px; }
h1 { color: #2c3e50; margin-bottom: 5px; text-align: center; }
.subtitle { text-align: center; color: #7f8c8d; margin-bottom: 25px; }
.input-group { display: flex; flex-direction: column; gap: 15px; }
.input-field { padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; width: 100%; box-sizing: border-box; }
textarea.input-field { height: 100px; resize: none; }
.submit-btn { padding: 12px; background: #42b983; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s; }
.submit-btn:hover { background: #3aa876; }
.submit-btn:disabled { background: #95a5a6; cursor: not-allowed; }
.ai-response { margin-top: 20px; padding: 15px; background: #e8f5e9; border-left: 5px solid #42b983; border-radius: 4px; color: #2e7d32; }
hr { margin: 30px 0; border: 0; border-top: 1px solid #eee; }
.history-item { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #eee; }
.history-header { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px; }
.date { color: #95a5a6; }
.history-text { margin: 5px 0; color: #34495e; }
.history-ai { font-size: 13px; color: #7f8c8d; margin-top: 5px; }
.empty { text-align: center; color: #bdc3c7; }
</style>