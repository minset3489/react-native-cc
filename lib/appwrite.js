import {
    Account,
    Avatars,
    Client,
    Databases,
    Query,
    ID,
  } from "react-native-appwrite";
  
  export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: 'com.ms.aora',
    projectId: '667d0574001fd21cecf6',
    databaseId: '667d06a3002305d1da8d',
    userCollectionId: '667d06be002b36a32101',
    videoCollectionId: '667d06ef0016edcac1ec',
    storageId: '667d087f003cce1d1364'
  };
  const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
  } = appwriteConfig
  
  const client = new Client();
  
  client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);
  
  const account = new Account(client);
  const avatars = new Avatars(client);
  const databases = new Databases(client);
  
  // Register user
  export const createUser= async (email, password, username) => {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
  
      if (!newAccount) throw new Error('Failed to create a new account');
  
      const avatarUrl = avatars.getInitials(username);
  
      await signIn(email, password);
  
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );
  
      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  // Sign In
  export const signIn = async (email, password) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  export const getCurrentUser = async () => {
    try{
      const currentAccount = await account.get();

      if(!currentAccount){
        throw Error;
      }

      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId',currentAccount.$id)]
      )

      if(!currentUser){
        throw Error;
      }

      return currentUser.documents[0];

    }
    catch(error){
      console.log(error)
    }
  }
  
export const getAllPosts = async () => {
  try{
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId
    )

    return posts.documents
  }
  catch(error){
    throw new Error(error)
    console.log(error)
  }
}

export const getLatestPosts = async () => {
  try{
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    )

    return posts.documents
  }
  catch(error){
    throw new Error(error)
    console.log(error)
  }
}