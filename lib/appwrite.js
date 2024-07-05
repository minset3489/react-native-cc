import {
    Account,
    Avatars,
    Client,
    Databases,
    Query,
    ID,
    Storage,
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
  const storage = new Storage(client)
  
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
        databaseId,
        userCollectionId,
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

  export const signOut = async () => {
    try{
      const session = await account.deleteSession("current")
      return session
    }catch(error){
      throw new Error(error)
    }
  }

  export const getCurrentUser = async () => {
    try{
      const currentAccount = await account.get();

      if(!currentAccount){
        throw Error;
      }

      const currentUser = await databases.listDocuments(
        databaseId,
        userCollectionId,
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
      videoCollectionId,
      [Query.orderDesc('$createdAt')]
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
export const searchPosts = async (query) => {
  try{
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title', query)]
    )

    return posts.documents
  }
  catch(error){
    throw new Error(error)
    console.log(error)
  }
}
export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export const  getFilePreview =  async (fileId, type) => {
  let fileUrl

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type")
    }

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    throw new Error(error)
  }
}

// Upload File
export const  uploadFile= async (file, type) => {
  if (!file) return

  // const { mimeType, ...rest } = file;
  // const asset = { type: mimeType, ...rest }

  const asset = { 
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri
   }

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl
  } catch (error) {
    throw new Error(error)
  }
}

// Create Video Post
export const createVideoPost =  async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ])

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    )

    return newPost

  } catch (error) {
    throw new Error(error)
  }
}