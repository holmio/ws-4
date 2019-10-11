import { Channel, Message } from './chat.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp();
const db = admin.firestore()


exports.sendNotification = functions.firestore.document('/channels/{channelUid}/messages/{uidMessage}')
    .onCreate(async (snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
        const original: Message = snapshot.data() as Message;
        const channelUid = context.params.channelUid;
        console.log('Data: ', original);
        console.log('params: ', context.params);
        const channelPromise = await db.collection('channels').doc(channelUid).get();
        const channelInfo: Channel = channelPromise.data() as Channel;
        console.log(channelInfo);
        const payload: admin.messaging.MessagingPayload = {
            notification: {
                tag:'marsa',
                title: channelInfo.product.name,
                body: original.message,
            },
            data: {
                title: channelInfo.product.name,
                body: original.message,
                channelId: channelInfo.uid,
            }
        };
        const options: admin.messaging.MessagingOptions = {
            collapseKey: channelInfo.uid,
        }
        let token: string;
        if (original.uid === channelInfo.visitor.uid) {
            const userPromise = await db.collection('userShortInfo').doc(channelInfo.owner.uid).get();
            const userInfo: any = userPromise.data();
            token = userInfo.tokenDevice;
        } else {
            const userPromise = await db.collection('userShortInfo').doc(channelInfo.visitor.uid).get();
            const userInfo: any = userPromise.data();
            token = userInfo.tokenDevice;
        }
        if (token) {
            await admin.messaging().sendToDevice(token, payload, options);
        }
    })

