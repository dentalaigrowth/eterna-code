/* ETERNA admin config. Set ADMIN_EMAIL_DOMAIN to the domain of the auth user
   you create in Supabase. The admin login form takes a username and converts
   it to <username>@<ADMIN_EMAIL_DOMAIN> before calling signInWithPassword.
   Example: username "eterna" + domain "eternadesign.com" -> eterna@eternadesign.com
   You must create this user in Supabase Auth yourself (email + password).
   No username or password is hardcoded anywhere. */
export const ADMIN_EMAIL_DOMAIN = "eternadesign.com";
