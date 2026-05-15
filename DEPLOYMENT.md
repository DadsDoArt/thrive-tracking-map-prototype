# Deployment Notes

## Recommended First Share

Deploy through Cloudflare Pages from a GitHub repository, then send Silvia the generated Pages URL.

## GitHub To Cloudflare Pages

1. Create or choose a GitHub repository under `DadsDoArt`.
2. Push this folder to the repository.
3. In Cloudflare Pages, choose **Connect to Git**.
4. Select the repository.
5. Use:
   - Framework preset: `None`
   - Build command: empty
   - Build output directory: `/`
6. Deploy.

## Privacy

This is still a public URL if deployed to Cloudflare Pages. The prototype has `noindex` headers, but anyone with the link can view it.
