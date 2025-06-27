import StoryModel from "./model/storyModel.js";
import StoryView from "./view/storyView.js";
import StoryPresenter from "./presenter/storyPresenter.js";
import { saveData, getAllData, deleteData } from './idb.js';

document.addEventListener("DOMContentLoaded", () => {
  const model = new StoryModel();
  const view = new StoryView();
  const presenter = new StoryPresenter(model, view);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('Service worker registered!', reg);
      })
      .catch(err => {
        console.error('Service worker registration failed:', err);
      });
  });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  // 1. Request notification permission
  Notification.requestPermission().then(function(permission) {
    if (permission === 'granted') {
      // 2. Register service worker
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(reg) {
          // 3. Subscribe ke push (dengan VAPID key!)
          reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BCmx7MxJpBciwE-0B7tBW3vPDs2tvXkaAYMrEGU-ayArntwodXhZPU0TcEj_7u7k0B-5g5LBaRURVnAShOmrSEc')
          }).then(function(subscription) {
            // Kirim subscription ke server kalau perlu
            console.log('Subscribed!', subscription);
          });
        });
    } else {
      alert('Anda harus mengizinkan notifikasi!');
    }
  });
}
document.getElementById('btn-simpan-offline').addEventListener('click', function() {
  const story = {
    id: 'story-12345',
    title: 'Judul Cerita',
    body: 'Isi cerita',
    date: '27/6/2025'
  };

  saveData(story).then(() => {
    alert('Cerita disimpan ke offline!');
  });
});

function tampilkanCeritaOffline() {
  getAllData().then(stories => {
    const container = document.getElementById('stories-container');
    container.innerHTML = '';
    if (stories.length === 0) {
      container.innerHTML = '<p>Tidak ada cerita offline.</p>';
      return;
    }
    stories.forEach(story => {
      const div = document.createElement('div');
      div.className = 'story-offline';
      div.innerHTML = `
        <h3>${story.title}</h3>
        <p>${story.body}</p>
        <small>${story.date}</small>
        <button data-id="${story.id}" class="hapus-cerita">Hapus</button>
      `;
      container.appendChild(div);
    });

    // Pasang event listener untuk tombol hapus
    document.querySelectorAll('.hapus-cerita').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        deleteData(id).then(() => {
          alert('Cerita berhasil dihapus dari offline');
          tampilkanCeritaOffline();
        });
      });
    });
  });
}

// Panggil tampilkanCeritaOffline() saat halaman daftar cerita dimuat
document.addEventListener('DOMContentLoaded', () => {
  tampilkanCeritaOffline();
});

// Helper function
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
