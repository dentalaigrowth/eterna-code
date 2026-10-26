/*
# Remove stray designers policy

A previous migration left an accidental `public_read_design_designers` policy
(command ALL, role public) on public.designers due to a typo'd DROP statement.
This drops it. The correct `public_read_designers` SELECT policy remains.
*/

DROP POLICY IF EXISTS "public_read_design_designers" ON public.designers;
