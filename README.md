# Photoshop — Photo Sharing Frontend

A responsive, English-language frontend prototype for a photo-sharing website.

## Pages
- `index.html` — login and create-account screens.
- `dashboard.html` — homepage, photo gallery, search, category filters, featured albums.
- `create.html` — post composer with title, description, category, album, tags, visibility, comments, multiple image selection, cover selection, live preview, save draft, and publish UI.
- `styles.css` — responsive dark navy / electric-blue design.
- `app.js` — demo interactions.

## Run locally
Open `index.html` in a modern browser. For a local server, run `python -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Deploy to your domain
Upload the contents of this folder to your hosting's web root (often `public_html`). Point your domain's DNS to the hosting provider. If you have only purchased the domain and do not have hosting, you will need hosting or a static hosting provider.

## Important limitations
This is frontend/demo code only:
- Accounts and demo posts are stored in the browser's `localStorage`; this is not secure authentication and is not shared between devices/users.
- Uploaded image previews use browser object URLs and are not uploaded to a server.
- For a production website, add a backend/API, database, secure password hashing, session management, validation/rate limiting, and object storage for uploaded images.
- The brand name “Photoshop” is associated with Adobe Photoshop. Consider choosing a distinct brand name before making the site public.
- Demo gallery photos load from Unsplash and require an internet connection.

No build tools or dependencies are required.
