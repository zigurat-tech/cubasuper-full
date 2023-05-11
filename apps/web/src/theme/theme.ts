import { colors } from './colors';
import { Button } from './components';
import { extendTheme, theme } from '@chakra-ui/react';

const breakpoints = {
    smx: '26em',
    sm: '31em',
    md: '48em',
    mdx: '54em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em'
};

const myTheme = extendTheme({
    ...theme,
    breakpoints,
    colors,
    fonts: {
        heading: 'Open Sans, sans-serif',
        body: 'Open Sans, sans-serif',
        text: 'Open Sans, sans-serif'
    },
    components: {
        Button,
        Drawer: {
            parts: ['dialog', 'header', 'body'],
            variants: {
                primary: {
                    dialog: {
                        maxW: '25rem'
                    }
                }
            }
        }
    },
    styles: {
        global: {
            'html, body': {
                padding: '0px',
                margin: '0px',
                height: '100%',
                backgroundColor: 'white'
            },
            img: {
                maxWidth: 'unset !important'
            },
            '#__next': {
                // height: "100%",
            },
            'a:hover': {
                opacity: 0.8,
                textDecoration: 'none !important'
            },
            '*:focus': {
                boxShadow: 'none !important'
            },
            'input:focus': {
                borderColor: 'transparent !important'
            },
            'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
                {
                    WebkitTransition:
                        'color 9999s ease-out, background-color 9999s ease-out',
                    WebkitTransitionDelay: '9999s'
                },
            '.alice-carousel__dots': {
                marginTop: '1rem',
                position: 'absolute',
                bottom: 0,
                left: 'calc(50% - 48px);'
            }
        }
    },
    sizes: {
        ...theme.space,
        ...breakpoints,
        container: breakpoints
    }
});

export default myTheme;
