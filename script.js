const input = document.querySelector('input');
const btn = document.querySelector('button');
const card = document.querySelector('.card');
const repos_container = document.querySelector('.repos');

// Fetch user data from GitHub
async function user(username) {
    const resp = await fetch(`https://api.github.com/users/${username}`);
    const respData = await resp.json();
    return respData;
}

// Fetch repos of the user
async function repos(username) {
    const resp = await fetch(`https://api.github.com/users/${username}/repos`);
    const respData = await resp.json();
    return respData;
}

// Add repo cards to the container
async function add_repo(username) {
    const reposData = await repos(username);
    console.log(reposData);

    // If no repos, return early
    if (reposData.length === 0) {
        repos_container.innerHTML = '<p>No Repos Found</p>';
        return;
    }

    repos_container.innerHTML = reposData.map(repo => {
        return `
            <div class="card">
                <h2>${repo.name}</h2>
                <a href="${repo.clone_url}" target="_blank">Take a look at this repo ></a>
            </div>
        `;
    }).join('');
}

// Event listener for search button
const searchHandler = async () => {
    const input_val = input.value;

    if (!input_val) {
        alert('Please enter a username!');
        return;
    }

    const search_result = await user(input_val);

    // Check if the user exists
    if (!search_result.login) {
        alert('No user found!');
    } else {
        // Update the user profile card
        card.innerHTML = `
            <div class="avatar">
                <img src="${search_result.avatar_url}" alt="Avatar">
            </div>
            <div class="info">
                <h2>${search_result.name || 'No Name Available'}</h2>
                <p>${search_result.login}</p>
                <div class="follow-info">
                    <div class="single">
                        <span>${search_result.followers}</span>
                        <span>Followers</span>
                    </div>
                    <div class="single">
                        <span>${search_result.following}</span>
                        <span>Following</span>
                    </div>
                </div>
                <div class="single">
                    <span>${search_result.public_repos}</span>
                    <span>Repos</span>
                </div>
            </div>
            <a href="${search_result.html_url}" target="_blank">Visit Github Profile ></a>
        `;

        // Now, fetch and display the repos
        add_repo(input_val);
    }
};

// Event listener for the search button
btn.addEventListener('click', searchHandler);

// Event listener for the Enter key
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchHandler();
    }
});
