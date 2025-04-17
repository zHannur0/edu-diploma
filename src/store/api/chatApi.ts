import {createApi} from "@reduxjs/toolkit/query/react";
import {Chat, ChatHistory, ChatMessage} from "@/types/Chat";
import baseQueryWithReauth from "@/store/api/baseQuery";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Chat"],
    endpoints: (builder) => ({
        getChatHistory: builder.query<ChatHistory, number>({
            query: (id) => ({
                url: `chats/${id}/history/`,
            }),
            providesTags: ["Chat"]
        }),
        getChat: builder.query<Chat[], void>({
            query: () => ({
                url: `chats/chats`,
            }),
        }),
        sendMessage: builder.mutation<ChatMessage, ChatMessage>({
            query: (data) => ({
                url: "chats/messages/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chat"]
        }),
    }),
});

export const { useGetChatHistoryQuery, useGetChatQuery, useSendMessageMutation
} = chatApi;
