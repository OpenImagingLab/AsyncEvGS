# Research Project Template - Usage & Deployment Guide

This guide details how to reuse this codebase for new research projects and deploy them to GitHub Pages, supporting both **Personal** and **Organization/Lab** accounts.

---

## 🚀 Part 1: Creating a New Project (Reusing the Template)

To create a website for a *new* paper using this existing code, follow these steps to "clone" the template without linking to the old project's history.

### 1. Copy the Project
1.  **Duplicate the folder**: Copy your existing project folder and paste it as a new folder (e.g., rename `MyResearch-Old` to `New-Paper-2025`).
2.  **Clean Git History**: Inside the **new** folder, delete the hidden `.git` folder.
    *   *Mac/Linux Terminal:* `rm -rf .git`
    *   *Windows:* Enable "Hidden items" in View settings, then delete the `.git` folder manually.
    *   *Why?* This ensures the new project is not linked to the old project's version control history.

### 2. Install Dependencies
Open your terminal in the new folder and run:
```bash
npm install
```

---

## ⚙️ Part 2: Configuration (Critical Step)

You must update the project identity to match your new repository.

### 1. Determine your Repository Name
Decide what you will name your repository on GitHub (e.g., `awesome-3d-gen`).

### 2. Update `vite.config.ts`
This is the **most important step** for GitHub Pages. The `base` path must match your repository name exactly.

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  // ⚠️ CHANGE THIS to match your new repository name
  // If your repo is https://github.com/user/awesome-3d-gen
  // Then this must be '/awesome-3d-gen/'
  base: '/awesome-3d-gen/', 
})
```

### 3. Update `package.json`
Update the project metadata and the homepage URL.

```json
{
  "name": "awesome-3d-gen",
  // ⚠️ CHANGE THIS to the full URL where the site will be hosted
  "homepage": "https://<YOUR-GITHUB-USERNAME>.github.io/awesome-3d-gen", 
  ...
}
```

### 4. Setup API Key
Create a `.env` file in the project root if it wasn't copied:
```env
VITE_API_KEY=your_google_gemini_api_key_here
```

---

## 📝 Part 3: Updating Content

1.  **Data Source**: Open `src/constants.ts`. This is where 90% of your changes will happen. Update the Title, Abstract, Authors, Video Links, and Metrics.
2.  **Images/Assets**: 
    *   Place your new paper's images in `src/assets/` or `public/`.
    *   Update the references in `constants.ts`.

---

## ☁️ Part 4: Deployment Scenarios

### Option A: Deploying to a Personal Account
*URL Format:* `https://username.github.io/repo-name/`

1.  **Create Repository**: Go to GitHub -> New Repository -> Name it `awesome-3d-gen` (must match `vite.config.ts` base).
2.  **Initialize & Push**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit for new paper"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/awesome-3d-gen.git
    git push -u origin main
    ```
3.  **Deploy**:
    ```bash
    npm run build
    npm run deploy
    ```

### Option B: Deploying to an Organization (Lab) Account
*URL Format:* `https://lab-name.github.io/repo-name/`

1.  **Permissions Check**: Ensure you have **Write** or **Admin** access to the Organization.
2.  **Create Repository**: Create the repository *inside* the Organization (e.g., `MyLab/awesome-3d-gen`).
3.  **Update Configs**:
    *   `vite.config.ts`: `base: '/awesome-3d-gen/'` (Same as personal).
    *   `package.json`: `"homepage": "https://MyLab.github.io/awesome-3d-gen"`.
4.  **Initialize & Push**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    # Note the Organization URL
    git remote add origin https://github.com/MyLab/awesome-3d-gen.git
    git push -u origin main
    ```
5.  **Deploy**:
    ```bash
    npm run build
    npm run deploy
    ```

#### ⚠️ Troubleshooting Organization Deployments
If `npm run deploy` fails with "Permission denied" or "403":
1.  **Token Issues**: Your local git might be logged in as a user who doesn't have write access to the Lab's repo.
2.  **Action Settings**: Ask the Organization Owner to go to **Settings -> Actions -> General** and ensure "Workflow permissions" is set to "Read and write permissions".
3.  **Pages Settings**: Go to **Settings -> Pages**. Ensure "Source" is set to `Deploy from a branch` and select `gh-pages` / `/root`.

---

## 🔄 Routine Updates

To update the text or images after the site is already live:

1.  Modify the code locally.
2.  Run:
    ```bash
    npm run build
    npm run deploy
    ```
3.  (Optional) Commit changes to save source code:
    ```bash
    git add .
    git commit -m "Update abstract"
    git push
    ```

