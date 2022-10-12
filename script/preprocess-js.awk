# Simple AWK preprocessor for the JS files that allows
# the use of #ifdef node and #ifdef browser preprocessor directives.

BEGIN { write=1; }
/^\s*\/\/ ?#ifdef node$/ { write = (env == "node"); next; }
/^\s*\/\/ ?#ifdef browser$/ { write = (env == "browser"); next; }
/^\s*\/\/ ?#endif$/ { write=1; next; }
{
  if (write==1) print $0;
}
