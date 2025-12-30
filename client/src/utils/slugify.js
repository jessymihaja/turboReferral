export function slugify(text) {
  if (!text) return '';
  
  const textStr = typeof text === 'object' ? (text.fr || text.en || '') : text;
  
  return textStr
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateServiceUrl(serviceId, serviceName) {
  const slug = slugify(serviceName);
  return `/services/${serviceId}${slug ? `/${slug}` : ''}`;
}
