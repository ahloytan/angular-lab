import { isDevMode } from "@angular/core";

export const ENV = {
  production: false,
  supabaseUrl: 'https://yrfwmpkvbyzuwxqbgglz.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZndtcGt2Ynl6dXd4cWJnZ2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MzE0MTksImV4cCI6MjA1NjMwNzQxOX0.zTGQ93lrLyZuoThJmSGUwDFfctrURtnM05EMrP5ADfs',
};

export const BE_ENDPOINT = isDevMode() ? "http://localhost:3000" : "https://sse-node-js-six.vercel.app";