export const environment = {
    production: true,
    apiUri: process.env['ANGULAR_API_URI'] || "api",
    testApiUri: process.env['ANGULAR_TEST_API_URI'] || "http://localhost:8003/api",

    firebaseConfig: {
        apiKey: process.env['ANGULAR_FIREBASE_API_KEY'] || "",
        authDomain: process.env['ANGULAR_FIREBASE_AUTH_DOMAIN'] || "",
        projectId: process.env['ANGULAR_FIREBASE_PROJECT_ID'] || "",
        storageBucket: process.env['ANGULAR_FIREBASE_STORAGE_BUCKET'] || "",
        messagingSenderId: process.env['ANGULAR_FIREBASE_MESSAGING_SENDER_ID'] || "",
        appId: process.env['ANGULAR_FIREBASE_APP_ID'] || "",
        locationId: process.env['ANGULAR_FIREBASE_LOCATION_ID'] || "",
    },

    CLOUDINARY_CLOUD_NAME: process.env['ANGULAR_CLOUDINARY_CLOUD_NAME'] || "",
    CLOUDINARY_UPLOAD_PRESET: process.env['ANGULAR_CLOUDINARY_UPLOAD_PRESET'] || "",
    CLOUDINARY_BASE_URL: process.env['ANGULAR_CLOUDINARY_BASE_URL'] || "",
};
