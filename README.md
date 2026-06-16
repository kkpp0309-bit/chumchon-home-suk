# ชุมชนโฮมสุข

Static website for LINE OA Rich Menu destinations.

## Files

- `index.html` - main page and Thai content
- `style.css` - responsive layout for mobile and desktop
- `script.js` - mobile menu and header behavior
- `netlify.toml` - Netlify publish and redirect config
- `vercel.json` - Vercel redirect config

## Rich Menu URLs

After deployment, replace `https://your-domain.example` with the live URL:

- `https://your-domain.example/#service`
- `https://your-domain.example/#appointment`
- `https://your-domain.example/#seller`
- `https://your-domain.example/#schedule`
- `https://your-domain.example/#contact`

Optional clean paths are also configured:

- `https://your-domain.example/service`
- `https://your-domain.example/appointment`
- `https://your-domain.example/seller`
- `https://your-domain.example/schedule`
- `https://your-domain.example/contact`

## Deploy

Netlify:

1. Create a new site from Git.
2. Choose this repository.
3. Leave build command empty.
4. Set publish directory to `.`.

Vercel:

1. Import this repository.
2. Use Framework Preset: Other.
3. Leave build command empty.
4. Keep output directory empty or `.`.

## Before going live

- Replace the LINE OA URL in `index.html` if `@chumchonhomesuk` is not the final official account.
- Replace the telephone link in `index.html` when the official phone number is confirmed.

## GitHub Pages

Publish source:

- Branch: `main`
- Folder: `/` root
- Entry page: `index.html`

Expected Rich Menu URLs after GitHub Pages is ready:

- `https://YOUR-GITHUB-USERNAME.github.io/chumchon-home-suk/#service`
- `https://YOUR-GITHUB-USERNAME.github.io/chumchon-home-suk/#appointment`
- `https://YOUR-GITHUB-USERNAME.github.io/chumchon-home-suk/#seller`
- `https://YOUR-GITHUB-USERNAME.github.io/chumchon-home-suk/#schedule`
- `https://YOUR-GITHUB-USERNAME.github.io/chumchon-home-suk/#contact`
