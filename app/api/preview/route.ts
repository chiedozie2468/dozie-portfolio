import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let normalizedInput = rawUrl.trim();
  if (/^(https?:\/\/)?echfasta\.com/i.test(normalizedInput)) {
    normalizedInput = "https://techfasta.com/";
  } else if (!/^https?:\/\//i.test(normalizedInput)) {
    normalizedInput = `https://${normalizedInput}`;
  }

  let parsedTarget: URL;
  try {
    parsedTarget = new URL(normalizedInput);
  } catch {
    return new NextResponse("Invalid url parameter", { status: 400 });
  }

  try {
    const upstream = await fetch(parsedTarget.toString(), {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });

    const finalUrl = new URL(upstream.url || parsedTarget.toString());
    const origin = finalUrl.origin;

    // Check if the upstream website allows native iframe embedding
    const xfo = upstream.headers.get("x-frame-options");
    const csp = upstream.headers.get("content-security-policy") || "";
    const blocksFraming =
      Boolean(xfo) || /frame-ancestors\s+(?!\*)/i.test(csp);

    // If the site does not block framing (e.g. techfasta.com), redirect directly to the live site
    if (!blocksFraming) {
      return NextResponse.redirect(finalUrl.toString(), 302);
    }

    let html = await upstream.text();

    // Remove executable scripts (but preserve application/ld+json) so cross-origin Next.js hydration chunks never crash
    html = html.replace(
      /<script\b(?![^>]*type=["']application\/ld\+json["'])[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    // Strip crossorigin and integrity attributes on links/images
    html = html.replace(/\s+(?:crossorigin|integrity)(?:=["'][^"']*["'])?/gi, "");

    // Strip preload script tags and meta CSP tags
    html = html.replace(
      /<link[^>]+rel=["']?(?:modulepreload|preload)["']?[^>]+as=["']?script["']?[^>]*>/gi,
      ""
    );
    html = html.replace(
      /<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi,
      ""
    );

    // Rewrite root-relative href, src, poster, action attributes to absolute URLs on the final origin
    html = html.replace(
      /\b(href|src|poster|action)=["']\/(?!\/)([^"']*)["']/gi,
      (_match, attr, rest) => `${attr}="${origin}/${rest}"`
    );

    // Rewrite root-relative URLs inside srcSet and imageSrcSet attributes (e.g. /_next/image?url=... 1x, /_next/image?url=... 2x)
    html = html.replace(
      /\b(srcset|imagesrcset)=["']([^"']+)["']/gi,
      (_match, attr, val: string) => {
        const rewritten = val
          .split(",")
          .map((part) => {
            const trimmed = part.trim();
            if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
              return `${origin}${trimmed}`;
            }
            return trimmed;
          })
          .join(", ");
        return `${attr}="${rewritten}"`;
      }
    );

    // Rewrite root-relative CSS url(/...) references (including HTML entity quotes like &#x27;)
    html = html.replace(
      /url\(\s*(['"]?|&#x27;|&#39;|&quot;)\/(?!\/)([^)'"&]+)\1\s*\)/gi,
      (_match, quote, rest) => `url(${quote}${origin}/${rest}${quote})`
    );

    // Inject base tag, scroll/visibility helper styles (so initial SSR scroll-reveal / opacity:0 elements are visible),
    // video autoplay helper, and link click handler so internal navigation stays inside the preview
    const injectedHead = `
<base href="${origin}/">
<meta name="referrer" content="no-referrer">
<style id="antigravity-preview-fixes">
  html, body {
    overflow-x: hidden !important;
    overflow-y: auto !important;
    height: auto !important;
    min-height: 100% !important;
    scroll-behavior: smooth !important;
  }
  .scroll-reveal,
  [data-animate],
  [data-reveal],
  [style*="opacity:0"]:not([aria-hidden="true"]),
  [style*="opacity: 0"]:not([aria-hidden="true"]) {
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
  }
</style>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    var videos = document.querySelectorAll("video");
    for (var i = 0; i < videos.length; i++) {
      try {
        videos[i].muted = true;
        videos[i].play().catch(function(){});
      } catch (e) {}
    }
  });
  document.addEventListener("click", function(e) {
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    var rawHref = a.getAttribute("href");
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("javascript:")) return;
    if (rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) return;
    try {
      var resolved = new URL(a.href, ${JSON.stringify(origin)});
      if (resolved.origin === ${JSON.stringify(origin)}) {
        e.preventDefault();
        window.location.href = "/api/preview?url=" + encodeURIComponent(resolved.toString());
      } else {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    } catch (err) {}
  }, true);
</script>`;

    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (match) => `${match}${injectedHead}`);
    } else {
      html = `${injectedHead}${html}`;
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load site";
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;color:#333;"><h3>Preview Unavailable</h3><p>${message}</p></body></html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}
