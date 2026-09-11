export type AgendaItem = { id: string; title: string; details: string };
export type Minutes = { title: string; agenda: AgendaItem[]; responsibilities: string[]; notes?: string; points?: string[] };
export type MinutesDrafts = Record<string, Minutes>;

// Keep unsent minutes separate from the last shared snapshot, including after reload.
export function mergeMinutes<T extends { sessions: { date: string; minutes?: Minutes }[] }>(data: T, drafts: MinutesDrafts): T {
  const sessions = data.sessions.map((session) => drafts[session.date] ? { ...session, minutes: drafts[session.date] } : session);
  for (const [date, minutes] of Object.entries(drafts)) {
    if (!sessions.some((session) => session.date === date)) sessions.push({ date, held: true, marks: {}, minutes } as typeof sessions[number]);
  }
  return { ...data, sessions };
}

export function remainingMinutes(drafts: MinutesDrafts, saved: { sessions: { date: string; minutes?: Minutes }[] }): MinutesDrafts {
  return Object.fromEntries(Object.entries(drafts).filter(([date, minutes]) => {
    const persisted = saved.sessions.find((session) => session.date === date)?.minutes;
    return JSON.stringify(persisted) !== JSON.stringify(minutes);
  }));
}
