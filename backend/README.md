## Owner admin panel

The private owner console is available at `/owner-console-7f3a9c`. It requires the credentials configured in `.env` and provides CRUD controls for projects, review moderation, contact messages, and public profile settings.

For a new deployment, set a unique `JWT_SECRET`, `ADMIN_USERNAME`, and bcrypt `ADMIN_PASSWORD_HASH`. The current development password is `Owner@Portfolio2026!`; change it before deployment.
# Portfolio API

## Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. Start MongoDB locally or use a MongoDB Atlas connection string.
3. Create a Cloudinary account at https://cloudinary.com and open your Dashboard.
4. Copy these values into `backend/.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Keep `CLIENT_URL` as your frontend URL, usually `http://localhost:3000` in development.
6. Run `npm install` if needed, then `npm start`.
7. Optional: seed projects with `npm run seed`.

## Full Cloudinary image workflow

1. Sign in to the owner admin panel at `/owner-console-7f3a9c`.
2. Open the settings or project editor.
3. Click the image upload button for the profile photo or project preview.
4. The frontend sends the selected file to `POST /api/uploads/image`.
5. The backend receives the file in `backend/routes/uploads.js`, validates the image type, and uploads it to Cloudinary with `folder: 'portfolio-site'`.
6. Cloudinary returns a secure URL and public ID.
7. The app stores that remote URL in the admin settings or project document.
8. The website reads the saved URL directly from MongoDB and renders it in the UI. This keeps the page fast and avoids local file storage.

### Example .env values

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcd1234efgh5678ijkl9012mn
```

## Endpoints

- `GET /api/health`
- `GET /api/projects?category=Frontend`
- `GET /api/reviews`
- `POST /api/reviews`
- `POST /api/contact`
- `POST /api/admin/login`
- Protected admin CRUD: `/api/admin/overview`, `/api/admin/projects`, `/api/admin/reviews`, `/api/admin/messages`, `/api/admin/settings`
