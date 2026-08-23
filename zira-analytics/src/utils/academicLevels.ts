export function getAcademicLevels(): string[] {
  try {
    const saved = localStorage.getItem('school_stages');
    if (saved) {
      const stages = JSON.parse(saved);
      const levels: string[] = [];
      stages.forEach((s: any) => {
        if (s.levels && Array.isArray(s.levels)) {
          levels.push(...s.levels);
        }
      });
      return levels.length > 0 ? levels : ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
    }
  } catch (e) {
    console.error(e);
  }
  return ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
}
