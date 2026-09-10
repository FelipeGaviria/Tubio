type RecordedSession = { date: string; kind?: string; held?: boolean; marks: Record<string, string> };

// Count real attendances, not weighted points, cancelled dates or unmarked meetings.
export function canEditFirstSession(id: string, sessions: RecordedSession[]) {
  return new Set(sessions.filter((session) => session.held !== false
    && (!session.kind || ["normal", "virtual"].includes(session.kind))
    && ["present", "virtual"].includes(session.marks[id])).map((session) => session.date)).size <= 1;
}
