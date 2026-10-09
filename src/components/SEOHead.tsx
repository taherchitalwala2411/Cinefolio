import { useEffect } from 'react';
import { Article } from '../data/types.ts';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  article?: Article;
  breadcrumb?: Array<{ name: string; url: string }>;
}

export function SEOHead({
  title,
  description,
  canonicalUrl,
  type = 'website',
  article,
  breadcrumb
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:site_name', 'Cinefolio');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    const fullUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://cinefolio.org/');
    setMeta('property', 'og:url', fullUrl);

    // 3. Update canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', fullUrl);

    // 4. Update or inject JSON-LD
    const oldScripts = document.querySelectorAll('script[data-dynamic-seo="true"]');
    oldScripts.forEach(s => s.remove());

    const schemas: object[] = [];

    if (article) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': article.title,
        'alternativeHeadline': article.subtitle,
        'description': article.description,
        'datePublished': article.publishedDate,
        'dateModified': article.publishedDate,
        'wordCount': article.wordCount,
        'articleSection': article.category,
        'image': [
          typeof window !== 'undefined'
            ? `${window.location.origin}${article.featuredImage}`
            : article.featuredImage
        ],
        'author': {
          '@type': 'Organization',
          'name': 'Cinefolio Editorial Board',
          'url': 'https://cinefolio.org/about'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Cinefolio',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://cinefolio.org/images/hero-hollywood.webp'
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': fullUrl
        }
      });
    }

    if (breadcrumb && breadcrumb.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumb.map((item, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': item.name,
          'item': item.url
        }))
      });
    }

    if (schemas.length > 0) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-seo', 'true');
      script.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalUrl, type, article, breadcrumb]);

  return null;
}
