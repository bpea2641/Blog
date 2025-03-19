import { configureStore, createSlice } from "@reduxjs/toolkit";

let boardData = createSlice({
    name: 'board',
    initialState : {
        title: "",
        content: "",
        boardList: []
    },
    reducers: {
        setBoard: (state, action) => {
            state.boardList = action.payload
        },
        setBoardDetails: (state, action) => {
            state.title = action.payload.title;  // 수정
            state.content = action.payload.content;  // 수정
        }
    }
});



let userData = createSlice({
    name : 'user',
    initialState : {
        username: "",
        password: "",
        displayName: "",
        authorities: [],
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
        enabled: true,
        id: null
    },
    reducers: {
        setUser: (state, action) => {
            return {
                ...state,
                username: action.payload.username,
                password: action.payload.password,
                displayName: action.payload.displayName,
                authorities: action.payload.authorities,
                accountNonExpired: action.payload.accountNonExpired,
                accountNonLocked: action.payload.accountNonLocked,
                credentialsNonExpired: action.payload.credentialsNonExpired,
                enabled: action.payload.enabled,
                id: action.payload.id
            };
        },
        resetUser: () => ({
            username: "",
            password: "",
            displayName: "",
            authorities: [],
            accountNonExpired: true,
            accountNonLocked: true,
            credentialsNonExpired: true,
            enabled: true,
            id: null
        })
    }
});


export let { setUser, resetUser } = userData.actions;
export let { setBoard, setBoardDetails } = boardData.actions;

const store = configureStore({
    reducer: {
        user: userData.reducer,
        board: boardData.reducer
    }
});

export default store;
