export function getParticipantSessionCookieName(shareToken: string) {
  return `joinjoy_participant_${shareToken}`;
}

export function getParticipantSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  };
}
