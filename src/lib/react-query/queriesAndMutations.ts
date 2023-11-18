import {
    useQuery, //fetching the data
    useMutation, //modify the data
    useQueryClient,
    useInfiniteQuery,
    //useInfiniteQuery,
} from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavePost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './queryKeys'

//this mutation is for creating the user
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser ) => createUserAccount(user)
    })
}

//this mutation is for signing in the account
export const useSignInAccount = () => {
    return useMutation({
        mutationFn: 
        (user: {
            email: string; 
            password: string;
        }) => signInAccount(user),
    })
}
//this mutation is for logout 
export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}
//this mutation is for createPost
export const useCreatePost = () => {
   const queryClient = useQueryClient();

   return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })
    }
   }) 
}

//fetching queries
export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ postId, likesArray }: {postId: string; likesArray: 
        string[] }) => likePost(postId, likesArray),
        onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID , data?.id],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
}

export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
        savePost(userId, postId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ( savedRecordId: string ) => deleteSavePost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}
//User Queries
export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser,
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, postId],
      queryFn: () => getPostById(postId),
      enabled: !!postId,
    });
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (post: IUpdatePost) => updatePost(post),
      onSuccess: (data) => {
       queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
       }) 
      }
    });
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ postId, imageId}: { postId: string, imageId: 
        string}) => deletePost(postId, imageId),
      onSuccess: () => {
       queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
       }) 
      }
    });
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        getNextPageParam: (lastPage) => {
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;

            return lastId;
        }
    })
}

export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
}