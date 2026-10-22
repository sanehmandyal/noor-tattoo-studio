/**
 * Helper to identify artworks uploaded by the admin / studio owner (Noor)
 */
export const isOwnerWork = item => {
  if (!item) return false;
  const cat = (item.category || '').toLowerCase();
  const tags = (item.tags || []).map(t => (t || '').toLowerCase());
  const aName = (item.artist?.name || '').toLowerCase();
  const aId = typeof item.artist === 'object' ? item.artist?._id : item.artist;

  return (
    cat.includes('owner') ||
    cat.includes('founder') ||
    tags.includes('ownerwork') ||
    tags.includes('adminupload') ||
    tags.includes('noororiginal') ||
    tags.includes('foundercollection') ||
    aId === '6ad9c1b90d8f98908ab0b30f' ||
    aName.includes('noor')
  );
};
