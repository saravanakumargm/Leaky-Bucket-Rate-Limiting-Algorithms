import { configs } from './src/config.js';
import app from './src/app.js';

app.listen(configs.PORT, () => {
    console.log(`Server is running on port ${configs.PORT}`);
});