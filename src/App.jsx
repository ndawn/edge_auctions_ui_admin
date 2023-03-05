import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ToastProvider } from 'use-toast-mui';

import Routes from 'routes';
import themes from 'themes';

import NavigationScroll from 'layout/NavigationScroll';
import Loading from 'ui-component/loading';
import useAuth from 'hooks/useAuth';
import LoginView from 'views/login';
import AuthContext from 'utils/authContext';

const App = () => {
    const customization = useSelector((state) => state.customization);
    const auth = useAuth();

    const [content, setContent] = useState(null);

    useEffect(() => {
        if (!auth.isLoading) {
            if (auth.isAuthenticated) {
                setContent(<Routes />);
            } else {
                setContent(<LoginView />);
            }
        }
    }, [auth.isLoading, auth.isAuthenticated]);

    return (
        <StyledEngineProvider injectFirst>
            <ToastProvider>
                <ThemeProvider theme={themes(customization)}>
                    <CssBaseline />
                    <Loading isLoading={auth.isLoading} />
                    <NavigationScroll>
                        <AuthContext.Provider value={auth}>{content}</AuthContext.Provider>
                    </NavigationScroll>
                </ThemeProvider>
            </ToastProvider>
        </StyledEngineProvider>
    );
};

export default App;
