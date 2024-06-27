import { ID, Account, Client } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint : 'https://cloud.appwrite.io/v1',
    platform : 'com.ms.aora',
    projectId : '667d0574001fd21cecf6',
    databaseId : '667d06a3002305d1da8d',
    userCollectionId : '667d06be002b36a32101',
    videoCollectionId : '667d06ef0016edcac1ec',
    storageId : '667d087f003cce1d1364'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
    
    const account = new Account(client)

export const createUser = () => {
    account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
        .then(function (response) {
            console.log(response);
        }, function (error) {
            console.log(error);
        })
}






