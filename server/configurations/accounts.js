process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

ServiceConfiguration.configurations.upsert({
    service: "google"
}, {
    $set: {
        clientId: Meteor.settings.google.clientId,
        secret: Meteor.settings.google.secret
    }
});

