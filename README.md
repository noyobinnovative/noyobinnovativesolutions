# Noyob Innovative website

A fast, SEO-ready static website (plain HTML, CSS and JavaScript). Upload the whole folder to your hosting root.

## Before you publish
1. **Contact details**: open `assets/config.js` and add your email (and booking link if you have one). Phone, WhatsApp, Instagram and Facebook are already set. For the contact forms, create a free Formspree form and paste its URL into `formEndpoint`.
2. **Server rules** (pick the file for your host):
   - Apache / cPanel / Hostinger: `.htaccess` (HTTPS, non-www, /index.html to /, insights.html to blog.html, 404, security headers)
   - nginx: `nginx-example.conf`
   - Netlify / Cloudflare Pages: `_redirects` and `_headers`
3. **Search**: submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools, and run PageSpeed Insights on the home page, a service page and a case study.
4. **Still to fill in**: full street address and email in the footer and schema, and a named author for blog posts.
5. **Sample case studies**: the three projects are placeholders marked "noindex" and left out of the sitemap. Replace them with real, client-approved projects, then remove the noindex tag.
6. **Review the drafts**: service text, FAQs and the privacy policy. Have the privacy policy reviewed before launch.

Domain used everywhere: https://noyobinnovative.in (non-www).
