export function generateAvatar(user) {
  if (!user) {
    return "https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50";
  }
  const userId = user.id || user.id_user || '';
  const userName = user.name || user.username || 'user';
  const seed = `${userName}${userId}`;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
} 