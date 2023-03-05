const config = {
    // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
    // like '/berry-material-react/react/default'
    basename: '/admin',
    defaultPath: '/',
    fontFamily: `'Inter', sans-serif`,
    borderRadius: 12,
    defaultAntiSniper: 10,
    baseUrl: import.meta.env.VITE_BASE_URL,
    staticUrl: import.meta.env.VITE_STATIC_URL,
    auth0Domain: import.meta.env.VITE_AUTH0_DOMAIN,
    auth0ClientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    auth0Audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    auth0Scope: import.meta.env.VITE_AUTH0_SCOPE,
    auth0RedirectUri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
};

export default config;
