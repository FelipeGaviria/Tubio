export const CLUB_ACCESS_MAX_AGE = 60 * 60 * 2;

export type ClubGate = "attendance" | "attendance-edit" | "rotaract";

export const clubCookieName = (club: ClubGate) => `tubio_${club.replace("-", "_")}_session`;

export const isClubGate = (value: string): value is ClubGate => value === "attendance" || value === "attendance-edit" || value === "rotaract";
