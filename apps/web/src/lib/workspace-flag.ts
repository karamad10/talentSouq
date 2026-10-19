/**
 * The web workspace (/seeker, /employer) still runs on demo data, so at launch
 * it is closed: those routes send people to /download, and the app is where
 * signed-in work happens. Set TALENTSOUQ_WEB_WORKSPACE=1 to open it again once
 * it reads live data. Tests that switch the auth guards off also see it.
 */
export function webWorkspaceOpen(): boolean {
  return process.env.TALENTSOUQ_WEB_WORKSPACE === "1" || process.env.TALENTSOUQ_DISABLE_AUTH_GUARDS === "1";
}
