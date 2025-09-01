import { createRequire } from 'module' // Allows use of require in ES modules
import Subscription from '../model/subscribe.model.js'; // Mongoose model for subscriptions
import dayjs from 'dayjs'; // Library for date manipulation
const require = createRequire(import.meta.url); // Create a require function for ES modules

const { serve } = require('@upstash/workflow/express') // Import 'serve' from Upstash Workflow Express

// Main workflow function to send reminders for subscriptions
export const sendReminders = serve(async (context) => {
    // Extract subscriptionId from the workflow context payload
    const { subscriptionId } = context.requestPayload;
    console.log("Received subscriptionId:", subscriptionId);

    // Fetch the subscription document from the database
    const subscription = await fetchSubscription(context, subscriptionId)
    console.log("Fetched subscription:", subscription);

    // If subscription not found or not active, throw error
    if (!subscription || subscription.status !== 'active') {
        throw new Error('Subscription not found');
    }

    // Get the end date of the subscription
    const endDate = dayjs(subscription.endDate);

    // If today is before 3 days before the end date, send a reminder
    if (dayjs().isBefore(endDate.subtract(3, 'day'))) {
        // Log the reminder action (replace with actual email sending in production)
        await sleepUntilReminder(context, `send reminder for ${subscriptionId}`, endDate);
    }

    await triggerReminder(context, `send final reminder for ${subscriptionId}`);
});

// Helper function to fetch a subscription and populate user info
const fetchSubscription = async (context, subscriptionId) => {
    // Use context.run for Upstash workflow step, fetch subscription by ID and populate user fields
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'email name');
    });
}

const sleepUntilReminder = async (context, label, endDate) => {
    console.log(`Sleeping until ${label} for ${endDate}`);
    await context.sleepUntil(dayjs(endDate).subtract(3, 'day').toDate());
};

const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Sending final reminder for ${label}`);
    });
};
