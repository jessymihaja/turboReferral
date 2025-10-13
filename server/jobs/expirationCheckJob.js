const cron = require('node-cron');
const expirationNotificationService = require('../services/expirationNotificationService');

function startExpirationCheckJob() {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running expiration check job...');

    try {
      const result = await expirationNotificationService.checkAndNotifyExpiringReferrals();
      console.log(`Expiration check completed. Notifications sent: ${result.count}`);
    } catch (error) {
      console.error('Error in expiration check job:', error);
    }
  });

  console.log('Expiration check job scheduled (daily at 9:00 AM)');
}

module.exports = { startExpirationCheckJob };
