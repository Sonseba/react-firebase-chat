import {create} from 'zustand'
import {getUserData} from "./auth.js";

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    fetchUserInfo: async ( user) => {
        if(!user) return set( {currentUser: null, isLoading: false} );
        try{

            let userData = await getUserData(user.uid)

            if(userData) {
                set( {currentUser: userData, isLoading: false} );
            } else {
                set( {currentUser: null, isLoading: false} );
            }

        } catch (error) {
            console.log(error);
            return set( {currentUser: null, isLoading: false} )
        }
    }
    })

)