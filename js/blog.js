// List of all blog posts
const blogPosts = [
    '/blog_posts/welcome.md',
    '/blog_posts/trash_picking_impact.md'
];

let currentPost = null;

async function loadBlogPosts() {
    try {
        const blogPostsContainer = document.getElementById('blogPosts');
        blogPostsContainer.innerHTML = ''; // Clear existing posts

        for (const postPath of blogPosts) {
            const response = await fetch(postPath);
            if (!response.ok) {
                console.error(`Failed to load post: ${postPath}`);
                continue;
            }
            const markdownContent = await response.text();
            
            // Parse the front matter and content
            const [, frontMatter, content] = markdownContent.split('---');
            const metadata = parseFrontMatter(frontMatter);
            
            // Create blog post preview element
            const postElement = createBlogPostPreview(metadata, content, postPath);
            blogPostsContainer.appendChild(postElement);
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

function parseFrontMatter(frontMatter) {
    const metadata = {};
    const lines = frontMatter.trim().split('\n');
    
    lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        metadata[key.trim()] = value;
    });
    
    return metadata;
}

function createBlogPostPreview(metadata, content, postPath) {
    const article = document.createElement('article');
    article.className = 'blog-post';
    
    // Get the first paragraph for preview
    const previewContent = content.split('\n\n')[0];
    
    article.innerHTML = `
        <h3>${metadata.title}</h3>
        <div class="post-meta">
            <span class="date">${metadata.date}</span>
        </div>
        <div class="post-description">${metadata.description}</div>
        <div class="post-preview">${marked.parse(previewContent)}</div>
        <button class="read-more-btn" onclick="showFullPost('${postPath}')">Read More</button>
    `;
    
    return article;
}

async function showFullPost(postPath) {
    try {
        const response = await fetch(postPath);
        if (!response.ok) {
            throw new Error(`Failed to load post: ${postPath}`);
        }
        const markdownContent = await response.text();
        
        // Parse the front matter and content
        const [, frontMatter, content] = markdownContent.split('---');
        const metadata = parseFrontMatter(frontMatter);

        // Create the full post view
        const fullPostContainer = document.createElement('div');
        fullPostContainer.className = 'full-post-container';
        
        fullPostContainer.innerHTML = `
            <div class="full-post">
                <button class="close-btn" onclick="closeFullPost()">×</button>
                <h2>${metadata.title}</h2>
                <div class="post-meta">
                    <span class="date">${metadata.date}</span>
                </div>
                <div class="post-content">${marked.parse(content)}</div>
            </div>
        `;

        // Add the full post to the page
        document.body.appendChild(fullPostContainer);
        document.body.style.overflow = 'hidden'; // Prevent scrolling of background
        
        // Add animation class after a small delay
        setTimeout(() => {
            fullPostContainer.classList.add('active');
        }, 10);
        
        currentPost = fullPostContainer;
    } catch (error) {
        console.error('Error loading full post:', error);
    }
}

function closeFullPost() {
    if (currentPost) {
        currentPost.classList.remove('active');
        setTimeout(() => {
            currentPost.remove();
            document.body.style.overflow = ''; // Restore scrolling
            currentPost = null;
        }, 300);
    }
}

// Load blog posts when the page loads
document.addEventListener('DOMContentLoaded', loadBlogPosts);
