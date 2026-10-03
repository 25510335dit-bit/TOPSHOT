// --- रील्स डेटा ---
const reelsData = [
  {
    id: 1,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-view-of-a-beautiful-waterfall-in-a-forest-42861-large.mp4',
    user: '@nature_vlogger',
    caption: 'Discovering hidden gems in the wild 🌿✨ #travel #vlog #topshot',
    song: 'Nature Sound - Original Audio',
    likes: '124K',
    comments: '1,420'
  },
  {
    id: 2,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-walking-through-the-streets-of-tokyo-at-night-42880-large.mp4',
    user: '@tokyovibes',
    caption: 'Neon nights and city lights 🏙️🏮 #citylife #neon #reels',
    song: 'Cyber Beats - Lofi Remix',
    likes: '89.5K',
    comments: '982'
  },
  {
    id: 3,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-recording-a-dance-video-41566-large.mp4',
    user: '@dance_crew_india',
    caption: 'New hook step challenge! Drop your duet now 🔥🕺 #topshotdance',
    song: 'TopShot Viral Anthem 2026',
    likes: '256K',
    comments: '4,110'
  }
];

// --- चॅट डेटा ---
const chatUsers = [
  { id: 1, name: 'Nature Vlogger', handle: '@nature_vlogger', lastMsg: 'Bhai to waterfall video kuthe shoot kela?', time: '2m ago' },
  { id: 2, name: 'Tokyo Vibes', handle: '@tokyovibes', lastMsg: 'Liked your reel! 🔥', time: '1h ago' },
  { id: 3, name: 'Dance Crew India', handle: '@dance_crew_india', lastMsg: 'Collab karaycha ka next reel madhe?', time: '3h ago' }
];

let activeChatUser = null;
let chatMessagesData = {
  1: [
    { sender: 'them', text: 'Hey, welcome to TOPSHOT!' },
    { sender: 'them', text: 'Bhai to waterfall video kuthe shoot kela?' }
  ]
};

// UI Elements
const reelsView = document.getElementById('reels-view');
const cameraView = document.getElementById('camera-view');
const chatView = document.getElementById('chat-view');
const convContainer = document.getElementById('chat-conversation-container');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

// १. रील्स लोड करणे
function loadReels() {
  reelsView.innerHTML = '';
  reelsData.forEach((reel) => {
    const reelCard = document.createElement('div');
    reelCard.className = 'reel-item w-full h-full relative bg-black flex items-center justify-center';
    reelCard.innerHTML = `
      <video class="reel-video w-full h-full object-cover" loop playsinline src="${reel.videoUrl}" onclick="togglePlay(this)"></video>
      <div class="absolute right-3 bottom-16 flex flex-col items-center gap-5 z-20">
        <button onclick="toggleLike(this)" class="flex flex-col items-center gap-1 text-white active:scale-125 transition">
          <i class="far fa-heart text-2xl"></i>
          <span class="text-xs font-semibold">${reel.likes}</span>
        </button>
        <button onclick="openChatFromReel('${reel.user}')" class="flex flex-col items-center gap-1 text-white active:scale-110 transition">
          <i class="far fa-comment text-2xl"></i>
          <span class="text-xs font-semibold">${reel.comments}</span>
        </button>
        <button class="flex flex-col items-center gap-1 text-white active:scale-110 transition">
          <i class="far fa-paper-plane text-2xl"></i>
          <span class="text-xs font-semibold">Share</span>
        </button>
        <div class="w-10 h-10 rounded-full border-2 border-white/60 p-1 flex items-center justify-center animate-spin-disc bg-gray-900 mt-2">
          <div class="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500"></div>
        </div>
      </div>
      <div class="absolute bottom-4 left-4 right-16 z-20 text-white">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[1.5px]">
            <div class="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">TS</div>
          </div>
          <span class="font-bold text-sm tracking-wide">${reel.user}</span>
          <button class="text-xs border border-white/60 px-2 py-0.5 rounded-md font-semibold">Follow</button>
        </div>
        <p class="text-xs text-gray-200 line-clamp-2 leading-relaxed mb-2">${reel.caption}</p>
        <div class="flex items-center gap-2 text-xs text-gray-300">
          <i class="fas fa-music text-[10px]"></i>
          <span class="truncate text-[11px]">${reel.song}</span>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none"></div>
    `;
    reelsView.appendChild(reelCard);
  });
  setupScrollObserver();
}

function togglePlay(video) {
  if (video.paused) video.play();
  else video.pause();
}

function toggleLike(btn) {
  const icon = btn.querySelector('i');
  icon.classList.toggle('far');
  icon.classList.toggle('fas');
  icon.classList.toggle('text-red-500');
}

function setupScrollObserver() {
  const videos = document.querySelectorAll('.reel-video');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const vid = entry.target;
      if (entry.isIntersecting) {
        vid.play().catch(() => {
          vid.muted = true;
          vid.play();
        });
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, { threshold: 0.65 });
  videos.forEach(v => observer.observe(v));
}

// २. चॅट लिस्ट रेंडर करणे
function loadChatList() {
  const listContainer = document.getElementById('conversations-list');
  listContainer.innerHTML = '';
  chatUsers.forEach(user => {
    const item = document.createElement('div');
    item.className = 'flex items-center gap-3 px-4 py-3 active:bg-white/5 cursor-pointer transition';
    item.onclick = () => openChat(user);
    item.innerHTML = `
      <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center font-bold text-black text-sm">
        ${user.name.slice(0, 2).toUpperCase()}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-center mb-0.5">
          <h4 class="font-bold text-sm text-white truncate">${user.name}</h4>
          <span class="text-[10px] text-gray-400">${user.time}</span>
        </div>
        <p class="text-xs text-gray-400 truncate">${user.lastMsg}</p>
      </div>
    `;
    listContainer.appendChild(item);
  });
}

// ३. इनर चॅट उघडणे
function openChat(user) {
  activeChatUser = user;
  document.getElementById('active-chat-name').innerText = user.name;
  document.getElementById('active-chat-avatar').innerText = user.name.slice(0, 2).toUpperCase();
  convContainer.classList.remove('hidden');
  renderMessages();
}

function closeChat() {
  convContainer.classList.add('hidden');
  activeChatUser = null;
}

function renderMessages() {
  chatMessages.innerHTML = '';
  const msgs = chatMessagesData[activeChatUser.id] || [
    { sender: 'them', text: `Hi there! I am ${activeChatUser.name}.` }
  ];
  msgs.forEach(m => {
    const bubble = document.createElement('div');
    if (m.sender === 'me') {
      bubble.className = 'self-end bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-2xl rounded-tr-none text-xs max-w-[75%]';
    } else {
      bubble.className = 'self-start bg-white/10 text-white px-4 py-2 rounded-2xl rounded-tl-none text-xs max-w-[75%]';
    }
    bubble.innerText = m.text;
    chatMessages.appendChild(bubble);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ४. मेसेज सेंड करणे
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || !activeChatUser) return;

  if (!chatMessagesData[activeChatUser.id]) {
    chatMessagesData[activeChatUser.id] = [];
  }

  // माझा मेसेज
  chatMessagesData[activeChatUser.id].push({ sender: 'me', text });
  chatInput.value = '';
  renderMessages();

  // स्वयंचलित रिप्लाय (Simulated Bot / Friend Reply)
  setTimeout(() => {
    const replies = [
      'Mast video ahe TOPSHOT var!',
      'Hao nakki karuya!',
      'Awesome shot bro! 🔥',
      'Followed you back!'
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    chatMessagesData[activeChatUser.id].push({ sender: 'them', text: randomReply });
    renderMessages();
  }, 1000);
}

// ५. स्क्रीन स्विचिंग (Reels <-> Camera <-> Chat)
function switchScreen(screen) {
  // नेव्ह आयकॉन्स रिसेट
  document.getElementById('nav-reels').className = 'flex flex-col items-center text-gray-500';
  document.getElementById('nav-chat').className = 'flex flex-col items-center text-gray-500';

  if (screen === 'camera') {
    reelsView.classList.add('hidden');
    chatView.classList.add('hidden');
    cameraView.classList.remove('hidden');
    pauseAllReels();
    startCamera();
  } else if (screen === 'reels') {
    cameraView.classList.add('hidden');
    chatView.classList.add('hidden');
    reelsView.classList.remove('hidden');
    document.getElementById('nav-reels').className = 'flex flex-col items-center text-white';
    stopCameraStream();
    playCurrentReel();
  } else if (screen === 'chat') {
    cameraView.classList.add('hidden');
    reelsView.classList.add('hidden');
    chatView.classList.remove('hidden');
    document.getElementById('nav-chat').className = 'flex flex-col items-center text-white';
    pauseAllReels();
    stopCameraStream();
    loadChatList();
  }
}

function pauseAllReels() {
  document.querySelectorAll('.reel-video').forEach(v => v.pause());
}

function playCurrentReel() {
  const firstVideo = document.querySelector('.reel-video');
  if (firstVideo) firstVideo.play().catch(() => {});
}

// Enter की दाबल्यावर मेसेज पाठवणे
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// --- कॅमेरा आणि फिल्टर्स लॉजिक ---
let currentStream = null;
let useFrontCamera = true;
let currentFilter = 'none';

const videoElem = document.getElementById('camera-feed');
const photoCanvas = document.getElementById('photo-canvas');
const shutterBtn = document.getElementById('shutter-btn');
const flipBtn = document.getElementById('flip-camera-btn');

async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: useFrontCamera ? 'user' : 'environment' },
      audio: true
    });
    videoElem.srcObject = currentStream;
  } catch (error) {
    console.error("Camera access error:", error);
  }
}

function stopCameraStream() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
}

function applyFilter(filterStyle) {
  currentFilter = filterStyle;
  videoElem.style.filter = filterStyle;
}

flipBtn.addEventListener('click', () => {
  useFrontCamera = !useFrontCamera;
  startCamera();
});

function takePhoto() {
  const context = photoCanvas.getContext('2d');
  photoCanvas.width = videoElem.videoWidth;
  photoCanvas.height = videoElem.videoHeight;
  context.filter = currentFilter;
  context.drawImage(videoElem, 0, 0, photoCanvas.width, photoCanvas.height);
  const a = document.createElement('a');
  a.href = photoCanvas.toDataURL('image/jpeg');
  a.download = `TOPSHOT_${Date.now()}.jpg`;
  a.click();
}

shutterBtn.addEventListener('click', () => {
  takePhoto();
});

// ॲप इनिशिएलायझेशन
window.addEventListener('DOMContentLoaded', () => {
  loadReels();
  loadChatList();
});
// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('TOPSHOT Service Worker Registered!'))
      .catch((err) => console.log('SW Registration Failed:', err));
  });
}
