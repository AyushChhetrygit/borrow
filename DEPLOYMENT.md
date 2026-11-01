# Vercel deployment

This is a static React + Vite app. It does not need a server, database, secrets, or environment variables.

## Required files

- `package.json` defines the dependencies and `npm run build` command.
- `package-lock.json` makes installs reproducible with `npm ci`.
- `vercel.json` tells Vercel to build the Vite app into `dist` and serves `index.html` for every application route.

Keep these files in the repository root when deploying.

## Dashboard deployment

1. Push this folder to GitHub.
2. In Vercel, select **Add New → Project** and import that repository.
3. Set **Root Directory** to `./`.
4. Click **Deploy**. The repository configuration supplies the framework, install command, build command and output directory.

## Command-line deployment

```bash
npm install -g vercel
cd /Users/ayushchhetry/Downloads/borrow
vercel --prod
```

## Verify after deployment

Open the deployment URL, then open or refresh `/catalogue` and `/admin/orders`. Both must load normally; this confirms the single-page-app rewrite is active.
