import admin from "firebase-admin";
import serviceAccount from "../../secrets/firebase.admin.config.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;
