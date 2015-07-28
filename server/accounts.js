process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

ServiceConfiguration.configurations.upsert({
    service: "google"
}, {
    $set: {
        clientId: "435566371285-mgvv08gmj89tpi0vofcljnldg58t2lcr.apps.googleusercontent.com",
        secret: "-k1REiWc1iTyzO7uI9eafbvR"
    }
});