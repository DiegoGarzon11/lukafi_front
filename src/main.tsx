import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/index.css';
import {I18nextProvider} from 'react-i18next';
import i18n from '@/assets/i18n/locales.js';
import '@fontsource-variable/roboto-slab';
import { Toaster } from './components/ui/toaster.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<I18nextProvider i18n={i18n}>
		<React.StrictMode>
			<App />
			<Toaster />
		</React.StrictMode>
	</I18nextProvider>
);
