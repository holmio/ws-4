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
                tag: channelInfo.uid,
                title: channelInfo.product.name,
                body: original.message,
            }
        };
        const options: admin.messaging.MessagingOptions = {
            priority: 'high',
            collapseKey: '',
        }
        let token: string;
        if (original.uid === channelInfo.visitor.uid) {
            const userPromise = await db.collection('userShortInfo').doc(channelInfo.owner.uid).get();
            const userInfo: any = userPromise.data();
            options.collapseKey = channelInfo.product.uid + channelInfo.owner.uid;
            console.log('Owner', userInfo)
            token = userInfo.tokenDevice;
        } else {
            const userPromise = await db.collection('userShortInfo').doc(channelInfo.visitor.uid).get();
            const userInfo: any = userPromise.data();
            options.collapseKey = channelInfo.product.uid + channelInfo.visitor.uid;
            console.log('Visitor', userInfo)
            token = userInfo.tokenDevice;
        }
        if (token) {
            await admin.messaging().sendToDevice(token, payload, options);
        }
    })

