import { View, FlatList,TouchableOpacity,Image} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppwrite from '../../lib/useAppwrite'
import { getUserPosts, signOut } from '../../lib/appwrite'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

import { icons } from "../../constants"

import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'


const Profile = () => {

  const { user, setUser, setIsLogged } = useGlobalContext()
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id))

  const logout = async () => {
    await signOut()
    setUser(null)
    setIsLogged(false)
    router.replace('/sign-in')
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList 
        data = {posts}
        keyExtractor={(item) =>  item.$id}
        renderItem={({item})=> (
          <>
            <VideoCard video={item}/>
          </>
        )}

        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Profile