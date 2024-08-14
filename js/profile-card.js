window.addEventListener("DOMContentLoaded", async function () {
    const enableLogging = true;

    async function get(url) {
        try {
            const resp = await fetch(url);
            if (!resp.ok) {
                console.error(`Error fetching data from ${url}: ${resp.statusText}`);
                throw new Error(`HTTP error! status: ${resp.status}`);
            }
            return resp.json();
        } catch (error) {
            console.error(`Network error when fetching from ${url}:`, error);
            throw error; // Rethrow the error after logging it
        }
    }

    document.querySelectorAll(".github_card").forEach(async function (el) {
        try {
            const username = el.getAttribute("username");
            if (!username) {
                console.warn("GitHub username not found for github_card element", el);
                return;
            }

            if (enableLogging) console.log(`Fetching GitHub data for username: ${username}`);
            const response = await get(`https://api.github.com/users/${username}`);
            if (enableLogging) console.log(`Received GitHub data for username: ${username}`, response);

            const { name, avatar_url, public_repos, followers, html_url, following } = response;

            el.innerHTML = `
                <div class="profile-card">
                    <div class="profile-header">
                        <img class="profile-avatar" src="${avatar_url}" alt="Profile image">
                        <div class="profile-info">
                            <span class="profile-name">
                                <a class="profile-link" href="${html_url}" target="_blank">${name}</a>
                            </span>
                            <span class="profile-username">
                                <a href="${html_url}" target="_blank">@${html_url.replace('https://', '')}</a>
                            </span>
                        </div>
                    </div>
                    <div class="profile-stats">
                        <div class="profile-stat">
                            <span class="profile-stat-title">REPOSITORIES</span>
                            <span class="profile-stat-value">${public_repos}</span>
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-title">FOLLOWERS</span>
                            <span class="profile-stat-value">${followers}</span>
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-title">FOLLOWING</span>
                            <span class="profile-stat-value">${following}</span>
                        </div>
                    </div>
                </div>
            `;

            if (enableLogging) console.log(`GitHub card updated for username: ${username}`);
        } catch (error) {
            console.error(`Error processing github_card element for username: ${username || 'unknown'}`, error);
            el.innerHTML = `<p>Error loading GitHub data. Please try again later.</p>`;
        }
    });
});
