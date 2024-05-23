import { createTheme } from '@mui/material/styles';
import { purple, indigo } from '@mui/material/colors';

const theme = createTheme({
    typography: {
        fontFamily: 'system-ui',
        lineHeight: 1.57143,
        fontWeight: 400,
        color: "rgb(102, 112, 133)"
    },
    palette: {
        primary: {
            main: indigo[500],
        },
        secondary: {
            main: '#f44336',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600
                },
                contained: {
                    // Customize border radius for contained button
                },
                outlined: {
                    borderColor: indigo[500], // Change border color for outlined button
                },
                text: {
                    color: indigo[500], // Customize text color for text button
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Add box shadow to cards
                    borderRadius: '16px',
                    lineHeight: 1.333,
                    color:'#333333',
                    fontFamily: 'system-ui',
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', 
                    borderRadius: '16px',
                    // lineHeight: 1.333,
                },
            },
        }
        ,
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: '30px', // Set border radius for text field
                },
            },
        },
    }
});

export default theme;