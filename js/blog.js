// List of all blog posts with proper paths
const blogPosts = [
  '/blog_posts/welcome.md',
  '/blog_posts/trash_picking_impact.md'
];

let currentPost = null;

// Make sure DOM is loaded before running any code
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBlog);
} else {
  initializeBlog();
}

function initializeBlog() {
  loadBlogPosts().catch(error => {
    console.error("Failed to initialize blog:", error);
    const blogPostsContainer = document.getElementById("blogPosts");
    if (blogPostsContainer) {
      blogPostsContainer.innerHTML = `
        <div class="error-message">
          <h3>Failed to load blog posts</h3>
          <p>Error details: ${error.message}</p>
          <p>Path attempted: ${blogPosts[0]}</p>
          <p>Current URL: ${window.location.href}</p>
        </div>
      `;
    }
  });
}

async function loadBlogPosts() {
  try {
    const blogPostsContainer = document.getElementById("blogPosts");
    if (!blogPostsContainer) {
      console.error("Blog posts container not found");
      return;
    }
    
    blogPostsContainer.innerHTML = ""; // Clear existing posts

    for (const postPath of blogPosts) {
      try {
        const response = await fetch(postPath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdownContent = await response.text();

        // Validate markdown content
        if (!markdownContent || !markdownContent.includes("---")) {
          throw new Error(`Invalid markdown content in ${postPath}`);
        }

        // Parse the front matter and content
        const parts = markdownContent.split("---").filter(part => part.trim());
        if (parts.length < 2) {
          throw new Error(`Invalid front matter format in ${postPath}`);
        }

        const frontMatter = parts[0];
        const content = parts.slice(1).join("---");
        const metadata = parseFrontMatter(frontMatter);

        // Create blog post preview element
        const postElement = createBlogPostPreview(metadata, content, postPath);
        blogPostsContainer.appendChild(postElement);
      } catch (postError) {
        console.error(`Error processing post ${postPath}:`, postError);
        const errorElement = document.createElement("div");
        errorElement.className = "blog-post error";
        errorElement.innerHTML = `
          <h3>Error Loading Post</h3>
          <p>Failed to load: ${postPath}</p>
          <p>Error: ${postError.message}</p>
        `;
        blogPostsContainer.appendChild(errorElement);
      }
    }
  } catch (error) {
    console.error("Error loading blog posts:", error);
    throw error;
  }
}

function parseFrontMatter(frontMatter) {
  const metadata = {};
  const lines = frontMatter.trim().split("\n");

  lines.forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    const value = valueParts.join(":").trim();
    metadata[key.trim()] = value;
  });

  return metadata;
}

function createBlogPostPreview(metadata, content, postPath) {
  const article = document.createElement("article");
  article.className = "blog-post";

  // Get the first paragraph for preview
  const previewContent = content.split("\n\n")[0];

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
    const parts = markdownContent.split("---").filter(part => part.trim());
    if (parts.length < 2) {
      console.error(`Invalid front matter format in ${postPath}`);
      return;
    }

    const frontMatter = parts[0];
    const content = parts.slice(1).join("---");
    const metadata = parseFrontMatter(frontMatter);

    // Create the full post view
    const fullPostContainer = document.createElement("div");
    fullPostContainer.className = "full-post-container";

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
    document.body.style.overflow = "hidden"; // Prevent scrolling of background

    // Add animation class after a small delay
    setTimeout(() => {
      fullPostContainer.classList.add("active");
    }, 10);

    currentPost = fullPostContainer;
  } catch (error) {
    console.error("Error loading full post:", error);
  }
}

function closeFullPost() {
  if (currentPost) {
    currentPost.classList.remove("active");
    setTimeout(() => {
      currentPost.remove();
      document.body.style.overflow = ""; // Restore scrolling
      currentPost = null;
    }, 300);
  }
}
