import app from './server';
import { ENV } from './config/env';

app.listen(ENV.PORT, () => {
  console.log(`🦠 zone-of-inhibition-tracker is running at http://localhost:${ENV.PORT}`);
});
