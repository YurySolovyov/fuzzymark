import { createApp } from 'vue';

import App from './components/App.vue';

import pinia from './stores';
import router from './router';

import '../styles/style.css';

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount('#app');

export default app;
