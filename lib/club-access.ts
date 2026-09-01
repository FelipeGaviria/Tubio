export const CLUB_ACCESS_MAX_AGE = 60 * 60 * 2;

export const clubCookieName = (club: "attendance" | "rotaract") => `tubio_${club}_session`;

export const isClubGate = (value: string): value is "attendance" | "rotaract" => value === "attendance" || value === "rotaract";
