# Noyob Innovative website (GitHub Pages)

Plain HTML, CSS and JavaScript. Every page is a single .html file in the root (about.html, careers.html ...). GitHub Pages serves them without the .html and without a trailing slash, so addresses look like /about.

## Upload to GitHub
1. In your repository, delete ALL old files (old about.html, work.html, index.html and so on).
2. Upload everything from this folder to the repository root, including the hidden files `CNAME` and `.nojekyll`.
3. Settings > Pages: source = your main branch (root). Custom domain = noyobinnovative.in. Tick "Enforce HTTPS".
4. DNS at your domain provider:
   - A records for @ : 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - CNAME for www : YOUR-GITHUB-USERNAME.github.io
   GitHub then redirects http to https and www to noyobinnovative.in automatically.
5. Do NOT keep page folders (about/, careers/ ...). A folder makes GitHub add a trailing slash (/careers/). Only insights.html is a redirect page (to /blog).

## Then
- `assets/config.js`: add your email (and a Formspree URL so the contact form can send).
- Submit https://noyobinnovative.in/sitemap.xml in Google Search Console and Bing Webmaster Tools.
- Still to fill in: full street address and a named blog author.
- The three case studies are samples marked noindex. Replace them with real projects, then remove the noindex tag.

Note: GitHub Pages cannot send custom security headers. If you need them, put Cloudflare (free) in front of the domain.
