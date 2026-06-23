const API_URL = 'http://localhost:5000/api';
let currentUser = null;

// --- Auth Operations ---
async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    alert(data.message || data.error);
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();

    if (data.success) {
        currentUser = data.username;
        document.getElementById('userDisplay').innerText = currentUser;
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('navBar').classList.remove('hidden');
        document.getElementById('blogSection').classList.remove('hidden');
        loadPosts();
    } else {
        alert(data.message);
    }
}

function logout() {
    currentUser = null;
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('navBar').classList.add('hidden');
    document.getElementById('blogSection').classList.add('hidden');
}

// --- Post Operations ---
async function loadPosts() {
    const response = await fetch(`${API_URL}/posts`);
    const posts = await response.json();
    const feed = document.getElementById('blogFeed');
    feed.innerHTML = '';

    for (let post of posts) {
        // Fetch comments for each post
        const comRes = await fetch(`${API_URL}/comments/${post._id}`);
        const comments = await comRes.json();
        
        let commentHtml = comments.map(c => `
            <div class="comment"><strong>${c.username}:</strong> ${c.text}</div>
        `).join('');

        let actionButtons = '';
        if (post.author === currentUser) {
            actionButtons = `
                <button onclick="editPost('${post._id}', '${post.title}', '${post.content}')" style="background-color: #f1c40f; color:#333;">Edit</button>
                <button class="delete-btn" onclick="deletePost('${post._id}')">Delete</button>
            `;
        }

        feed.innerHTML += `
            <div class="card post">
                <h3>${post.title}</h3>
                <p><small>By <strong>${post.author}</strong></small></p>
                <p>${post.content}</p>
                ${actionButtons}
                <hr>
                <h4>Comments</h4>
                <div class="comment-section">${commentHtml || 'No comments yet.'}</div>
                <div class="form-group" style="margin-top:10px; display:flex;">
                    <input type="text" id="comInput-${post._id}" placeholder="Write a comment..." style="margin-right:5px;">
                    <button onclick="addComment('${post._id}')">Comment</button>
                </div>
            </div>
        `;
    }
}

async function createPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;

    await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, author: currentUser })
    });

    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    loadPosts();
}

async function deletePost(id) {
    if (confirm("Delete this blog post?")) {
        await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' });
        loadPosts();
    }
}

async function editPost(id, oldTitle, oldContent) {
    const newTitle = prompt("Edit Title:", oldTitle);
    const newContent = prompt("Edit Content:", oldContent);
    if (newTitle && newContent) {
        await fetch(`${API_URL}/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, content: newContent })
        });
        loadPosts();
    }
}

// --- Comment Operations ---
async function addComment(postId) {
    const textInput = document.getElementById(`comInput-${postId}`);
    const text = textInput.value;

    if (!text) return;

    await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, username: currentUser, text })
    });

    textInput.value = '';
    loadPosts();
}