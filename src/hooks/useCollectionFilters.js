import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getCollections, getPageSubCategories, syncCollectionsFromBackend, syncPageSubCategoriesFromBackend } from '../data';

export function useCollectionFromUrl() {
  const location = useLocation();
  const [collection, setCollection] = useState(null);

  const findCollection = useCallback((slug) => {
    if (!slug) return null;
    const all = getCollections();
    return all.find(c => (c.slug || '') === slug || c.id === slug) || null;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const slug = params.get('collection');
    setCollection(findCollection(slug));
  }, [location.search, findCollection]);

  useEffect(() => {
    syncCollectionsFromBackend().then(() => {
      const params = new URLSearchParams(location.search);
      const slug = params.get('collection');
      if (slug) setCollection(findCollection(slug));
    }).catch(() => {});
  }, [location.search, findCollection]);

  return collection;
}

export function usePageSubCategories(pageType) {
  const [subs, setSubs] = useState([]);

  const refresh = useCallback(() => {
    setSubs(getPageSubCategories(pageType));
  }, [pageType]);

  useEffect(() => {
    refresh();
    syncPageSubCategoriesFromBackend().then(refresh).catch(() => {});
  }, [pageType, refresh]);

  useEffect(() => {
    function handler(e) {
      if (!e.detail || !e.detail.pageType || e.detail.pageType === pageType) {
        refresh();
      }
    }
    window.addEventListener('page-subcategories-updated', handler);
    return () => window.removeEventListener('page-subcategories-updated', handler);
  }, [pageType, refresh]);

  return subs;
}
